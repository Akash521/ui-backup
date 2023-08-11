import datetime
import logging
from datetime import date
from jinja2 import pass_environment
import pandas as pd
import requests
#from config import *
import base64
from config.config import *
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from utils import *
import pql
import uuid
from functools import wraps,lru_cache
import jwt
import json
import string
from pytz import timezone
from kubernetes import client, config

tz = timezone(time_zone)


logger= logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

config.load_kube_config(config_file='/app/images/kubeconfig')
k8s_apps_v1 = client.AppsV1Api()
k8s_apps_ser = client.CoreV1Api()

@app.route("/ping", methods=['GET'])
def ping():
    return jsonify({'ping': 'pong'})


def create_folder(dir):
    path = str(dir)
    if not os.path.exists(path):
        os.makedirs(os.path.normpath(path))
        logger.debug("Created folder %s" % path)
    else:
        logger.debug("Folder %s already exists" % path)
    if os.environ.get('RUNNING_IN_DOCKER') == 'TRUE':
        os.chmod(os.path.normpath(path), 0o777)

@lru_cache(maxsize=16)
def check_secret_key():
    try:
        # json_query = {'db_name': db_name, 'collection_table_name': 'secret', 'condition': None}
        # pivot_secret = requests.post('{}/list_data'.format(dal_url), json=json_query).json()['result'][0]
        # app.config['SECRET_KEY']= pivot_secret['sweet_tooth']

        sec = k8s_apps_ser.read_namespaced_secret(token_secret, "default").data
        secret_key = base64.b64decode(sec["secret"]).decode('utf-8').rstrip()
        app.config['SECRET_KEY'] = secret_key
    except:
        logger.error("Exception occurred at **** analytics_app / check_secret_key_function **** \n", exc_info=True)


def check_for_token(func):
    @wraps(func)
    def wrapped(*args, **kwargs):

        try:
            check_secret_key()
        
            token =request.args.get('token')
            if not token:
                return jsonify({'result':'missing token'}),403
            try:
                data=jwt.decode(token,app.config['SECRET_KEY'], algorithms=['HS256'])
            except:
                logger.error("Exception occurred at **** event_app / check_for_token_function **** \n", exc_info=True)
                return jsonify({'result':'token invalid'}),403
            return func(*args,**kwargs)
        except:
            logger.error("Exception occurred at **** analytics_app / check_for_token_function **** \n", exc_info=True)
    return wrapped

@app.route("/get_state_list/<account_id>/<user_name>", methods=['GET'])
@check_for_token
def get_state_list(account_id, user_name):
    try:
        json_query={'db_name':db_name,'collection_table_name': location_collection,
                    'condition':None, 'field_name':'state'}
        states = requests.post('{}/get_unique_values'.format(dal_url), json=json_query)
        try:
            state_list = states.json()['result']
        except:
            state_list = []

        return jsonify({'status':'success','state_list':state_list})
    except:
        logger.error("Exception occurred at **** analytics_app / get_state_list_function **** \n", exc_info=True)
        return jsonify({'status':'failed','error':'failed to state wise list'})


@app.route("/get_city_list/<account_id>/<user_name>/<state>", methods=['GET'])
@check_for_token
def get_city_list(account_id, user_name,state):
    try:
        json_query={'db_name':db_name,'collection_table_name': location_collection,
                    'condition':"state='%s'" % state, 'field_name':'city'}
        cities = requests.post('{}/get_unique_values'.format(dal_url), json=json_query)
        try:
            city_list = cities.json()['result']
        except:
            city_list = []

        return jsonify({'status':'success','city_list':city_list})
    except:
        logger.error("Exception occurred at **** analytics_app / get_city_list_function **** \n", exc_info=True)
        return jsonify({'status':'failed','error':'failed to get citiwise data'})

@app.route("/get_location_list/<account_id>/<user_name>/<state>/<city>", methods=['GET'])
@check_for_token
def get_location_list(account_id, user_name,state,city):
    try:
        json_query={'db_name':db_name,'collection_table_name': location_collection,
                    'condition':"state='%s' and city='%s'" % (state,city), 'field_name':'location'}
        locations = requests.post('{}/get_unique_values'.format(dal_url), json=json_query)
        try:
            location_list = locations.json()['result']
        except:
            location_list = []

        return jsonify({'status':'success','location_list':location_list})
    except:
        logger.error("Exception occurred at **** analytics_app / get_location_list_function **** \n", exc_info=True)
        return jsonify({'status':'failed','error':'failed to get location wise list'})

@app.route("/get_priority_list/<account_id>/<user_name>", methods=['GET'])
@check_for_token
def get_priority_list(account_id, user_name):
    return jsonify({'status':'success','priority_list': default_priority_list})



def change_date_format(d):
    return datetime.datetime.strptime(d, '%Y-%m-%d').strftime('%d/%m/%y')


def datetime_change(from_datetime, to_datetime):
    try:

        if to_datetime!="" and from_datetime!="":
            cond_to_datetime=to_datetime.split(' ')
            to_alert_date= cond_to_datetime[0]
            to_time =  cond_to_datetime[1]
            to_alert =change_date_format(cond_to_datetime[0])
            to_datetime=to_alert+' '+ to_time
            cond_from_datetime=from_datetime.split(' ')
            from_alert_date= cond_from_datetime[0]
            from_time = cond_from_datetime[1]
            from_alert = change_date_format(cond_from_datetime[0])
            from_datetime=from_alert+' '+ from_time

        elif to_datetime == "" and from_datetime == "":
            to_date = datetime.datetime.now(tz)
            from_date = to_date - datetime.timedelta(duration_period)
            to_alert_date = to_date.strftime('%Y-%m-%d')
            from_alert_date = from_date.strftime('%Y-%m-%d')
            to_alert=datetime.datetime.strptime(to_alert_date,'%Y-%m-%d').strftime('%d/%m/%y')
            to_time='23:59:59'
            to_datetime=to_alert+' '+to_time
            from_alert=datetime.datetime.strptime(from_alert_date,'%Y-%m-%d').strftime('%d/%m/%y')
            from_time='00:00:00'
            from_datetime=from_alert+' '+from_time

        elif to_datetime == "" and from_datetime != "":
            to_date = datetime.datetime.now(tz)
            to_alert_date = to_date.strftime('%Y-%m-%d')
            to_alert=datetime.datetime.strptime(to_alert_date,'%Y-%m-%d').strftime('%d/%m/%y')
            to_time='23:59:59'
            to_datetime=to_alert+' '+to_time
            cond_from_datetime=from_datetime.split(' ')
            from_alert_date= cond_from_datetime[0]
            from_alert=change_date_format(cond_from_datetime[0])
            from_time=cond_from_datetime[1]
            from_datetime=from_alert+' '+from_time

        elif to_datetime != "" and from_datetime == "":
            cond_to_datetime=to_datetime.split(' ')
            to_alert_date= cond_to_datetime[0] 
            to_alert_date = datetime.datetime.strptime(to_alert_date, '%Y-%m-%d')
            to_alert = change_date_format(cond_to_datetime[0])
            to_time=cond_to_datetime[1]
            to_datetime=to_alert+' '+to_time
            from_datetime = str(to_alert_date - datetime.timedelta(duration_period))
            from_datetime=datetime.datetime.strptime(from_datetime,'%Y-%m-%d %H:%M:%S').strftime('%d/%m/%y %H:%M:%S')
            from_alert_date=datetime.datetime.strptime(from_datetime,'%d/%m/%y %H:%M:%S').strftime('%Y-%m-%d %H:%M:%S')
            to_alert_date=str(to_alert_date)
            to_alert_date=to_alert_date.split(' ')[0]
            from_alert_date=from_alert_date.split(' ')[0]

    except:
        logger.error("Exception occurred at **** analytics_app / get_priority_list **** \n", exc_info=True)
        to_date = datetime.datetime.now(tz)
        from_date = to_date - datetime.timedelta(duration_period)
        to_alert_date = to_date.strftime('%Y-%m-%d')
        from_alert_date = from_date.strftime('%Y-%m-%d')
        to_alert=datetime.datetime.strptime(to_alert_date,'%Y-%m-%d').strftime('%d/%m/%y')
        to_time='23:59:59'
        to_datetime=to_alert+' '+to_time
        from_alert=datetime.datetime.strptime(from_alert_date,'%Y-%m-%d').strftime('%d/%m/%y')
        from_time='00:00:00'
        from_datetime=from_alert+' '+from_time

    to_datetime=datetime.datetime.strptime(to_datetime,'%d/%m/%y %H:%M:%S')
    from_datetime=datetime.datetime.strptime(from_datetime, '%d/%m/%y %H:%M:%S')

    return from_alert_date, to_alert_date, from_datetime, to_datetime

@app.route("/get_analytics_data/<account_id>/<user_name>", methods=['POST'])
@check_for_token
def get_analytics_data(account_id, user_name):
    try:
        data = request.json
        state = data['state']
        city = data['city']
        location = data['location']
        # area = data['area']
        to_datetime = data['to_alert_date']
        from_datetime = data['from_alert_date']

        from_alert_date, to_alert_date, from_datetime, to_datetime = datetime_change(from_datetime, to_datetime)
        
        try:
            json_query = {'db_name': db_name, 'collection_table_name': location_collection,'condition': None}
            locations = requests.post('{}/list_data'.format(dal_url), json=json_query)
            locations = locations.json()['result']
        except:
            logger.error("Exception occurred at **** analytics_app /  get_analytics_data **** \n", exc_info=True)
            locations = []

        try:
            json_query = {'db_name': db_name, 'collection_table_name': camera_collection,'condition': None}
            cameras = requests.post('{}/list_data'.format(dal_url), json=json_query)
            cameras = cameras.json()['result']
        except:
            logger.error("Exception occurred at **** analytics_app /  get_analytics_data **** \n", exc_info=True)
            cameras = []

        unique_locations = []
        unique_states = []
        unique_cities = []
        unique_cameras = []
        loc_wise_cams = {}

        for loc in locations:
            if loc['state'] not in unique_states:
                unique_states.append(loc['state'])
            if loc['city'] not in unique_cities:
                unique_cities.append(loc['city'])
            if loc['location'] not in unique_locations:
                unique_locations.append(loc['location'])

        for cam in cameras:
            if cam['cam_name'] not in unique_cameras:
                unique_cameras.append(cam['cam_name'])
            
            if cam['location'] not in loc_wise_cams:
                loc_wise_cams[cam['location']] = []
            
            loc_wise_cams[cam['location']].append(cam['cam_name'])


        try:
            priority = data['priority']
        except:
            priority = ''
        if state == '' and city == '' and location =='':
            condition = None
            table_var = 'state'
        if state != '' and city == '' and location =='':
            condition = "(state=='%s')" % (state)
            table_var = 'city'
        if state != '' and city != '' and location =='':
            condition = "(state=='%s' and city=='%s')" % (state,city)
            table_var = 'location'
        if state != '' and city != '' and location !='':
           condition = "(state=='%s' and city=='%s' and location=='%s')" % (state,city,location)
           table_var = 'cam_name'

        if to_alert_date == '' or from_alert_date == '':
            to_date = datetime.datetime.now()
            from_date = to_date - datetime.timedelta(duration_period)
            to_alert_date = to_date.strftime('%Y-%m-%d')
            from_alert_date = from_date.strftime('%Y-%m-%d')
        
        if condition:
            condition += " and (alert_date <= date('%s') and alert_date >= date('%s'))" % (to_alert_date ,from_alert_date)
        else:
            condition = "(alert_date <= date('%s') and alert_date >= date('%s'))" % (to_alert_date ,from_alert_date)

        if priority != '' and priority in default_priority_list:
            condition += " and priority=='%s'" % (priority)

        if condition:
            condition += " and (verified=='true')"

        json_query = {'db_name': db_name, 'collection_table_name': alert_collection,'condition': condition}
        cam_alerts = requests.post('{}/list_data'.format(dal_url), json=json_query)
        alerts = cam_alerts.json()['result']
        df = pd.DataFrame(alerts)
        try: 
            pie_df = df['alert_category'].value_counts()
        except:
            logger.error("Exception occurred at **** analytics_app /  get_analytics_data**** \n", exc_info=True)

            table_data = []
            for cam in loc_wise_cams[location]:
                table_dict = {}
                table_values = [{i:j} for i,j in zip(alert_name, [0]*len(alert_name))]
                table_dict['name'] = cam
                table_dict['values'] = table_values
                
                table_data.append(table_dict)

            return jsonify({'status':'success','pie_data': [],'table_data':table_data,'date_data':[]})
        
        alerts_df = pd.DataFrame(index=alert_name)

        fin_pie_df = alerts_df.join(pie_df).fillna(0) 
        fin_pie_df=fin_pie_df.reset_index()
        pie_df_list = fin_pie_df.to_dict('split')['data']
        pie_data = [{item[0]: int(item[1])} for item in pie_df_list]

        table_df = df[[table_var, 'alert_category']].pivot_table(index=table_var, columns='alert_category', aggfunc=len)
        table_df_trans = table_df.T
        
        if table_var == 'state':
            for i in unique_states:
                if i not in table_df_trans.columns:
                    table_df_trans[i] = float(0)

        if table_var == 'city':
            for i in unique_cities:
                if i not in table_df_trans.columns:
                    table_df_trans[i] = float(0)
        
        if table_var == 'location':
            for i in unique_locations:
                if i not in table_df_trans.columns:
                    table_df_trans[i] = float(0)
        
        if table_var == 'cam_name':
            for i in unique_cameras:
                if i not in table_df_trans.columns:
                    table_df_trans[i] = float(0)

            for i in table_df_trans.columns:
                if i not in loc_wise_cams[location]:
                    table_df_trans.drop(str(i), axis=1, inplace=True)

        fin_table_df = alerts_df.join(table_df_trans).T.fillna(0).reset_index()
        table_df_list = fin_table_df.to_dict('split')['data']
        table_data = [{"name": item[0], "values": [{alert: int(count)} for alert, count in zip(fin_table_df.columns[1:], item[1:])]}
                    for item in table_df_list]


        date_df = df[['alert_category', 'alert_date']].pivot_table(index='alert_category', columns='alert_date', aggfunc=len)
        date_df_up=alerts_df.join(date_df)
        date_df_trans = date_df_up.T
        d1 =datetime.datetime.strptime(from_alert_date,'%Y-%m-%d')
        d2 = datetime.datetime.strptime(to_alert_date,'%Y-%m-%d')
        date_arr = pd.date_range(d1,d2,freq='d').strftime('%Y-%m-%d').tolist()
        date_arr_df = pd.DataFrame(index=date_arr)
        fin_date_df=date_arr_df.join(date_df_trans).T.fillna(0).reset_index()
        date_df_list = fin_date_df.to_dict('split')['data']
        date_data = [{"name": item[0], "values": [{date: int(count)} for date, count in zip(fin_date_df.columns[1:], item[1:])]} for
                    item in date_df_list]

        condition, atm_condition, table_var , state_count, city_count = get_pql_query(state, city, location, to_alert_date, from_alert_date, priority, cam_name='')
        # json_query_atm = {'db_name': db_name, 'collection_table_name': location_collection,'condition': atm_condition}
        # total_cam_count = pd.DataFrame(requests.post('{}/list_data'.format(dal_url), json=json_query_atm).json()['result'])

        json_query = {'db_name': db_name, 'collection_table_name': alert_collection,'condition': condition}
        cam_alerts = requests.post('{}/list_data'.format(dal_url), json=json_query)

        alerts = cam_alerts.json()['result']

        alert_count=len(alerts)

        # state_count = len(total_cam_count['state'].unique())
        # city_count = len(total_cam_count['city'].unique())
        location_count = len(unique_locations)
        cam_count = len(unique_cameras)

        # return jsonify({'status':'success','pie_data': pie_data,'table_data':table_data,'date_data':date_data, 'alert_count':alert_count,'cam_count':len(total_cam_count), 'state_count':state_count, 'city_count':city_count})
        return jsonify({'status':'success','pie_data': pie_data,'table_data':table_data,'date_data':date_data, 'alert_count':alert_count,'cam_count':cam_count, 'location_count':location_count})
    except:
        logger.error("Exception occurred at **** analytics_app / get_analytics_data_function **** \n", exc_info=True)
        return jsonify({'status':'failed','error':'failed to get analytics data'})


# @app.route("/get_analytics_data_2/<account_id>/<user_name>", methods=['POST'])
# @check_for_token
# def get_analytics_data_2(account_id, user_name):
#     try:
#         data = request.json
#         state = data['state']
#         city = data['city']
#         location = data['location']
#         #area = data['area']
#         to_datetime = data['to_alert_date']
#         from_datetime = data['from_alert_date']

#         from_alert_date, to_alert_date, from_datetime, to_datetime = datetime_change(from_datetime, to_datetime)
        
#         try:
#             priority = data['priority']
#         except:
#             priority = ''

#         if state == '' and city == '' and location =='':
#             condition = None
#         if state != '' and city == '' and location =='':
#             condition = "(state=='%s')" % (state)
#         if state != '' and city != '' and location =='':
#             condition = "(state=='%s' and city=='%s')" % (state,city)
#         if state != '' and city != '' and location !='':
#             condition = "(state=='%s' and city=='%s' and location=='%s')" % (state,city,location)
#         #if state != '' and city != '' and location !='' and area != '':
#         #    condition = "(state=='%s' and city=='%s' and location=='%s' )" % (state,city,location,area)

#         if to_alert_date == '' or from_alert_date == '':
#             to_date = datetime.datetime.now()
#             from_date = to_date - datetime.timedelta(duration_period)
#             to_alert_date = to_date.strftime('%Y-%m-%d')
#             from_alert_date = from_date.strftime('%Y-%m-%d')

#     #    condition += " and (alert_date <= date('%s') and alert_date >= date('%s'))" % (to_alert_date ,from_alert_date)
#         if condition:
#             condition += " and (alert_date <= date('%s') and alert_date >= date('%s'))" % (to_alert_date ,from_alert_date)
#         else:
#             condition = "(alert_date <= date('%s') and alert_date >= date('%s'))" % (to_alert_date ,from_alert_date)

#         if priority != '' and priority in default_priority_list:
#             condition += " and priority=='%s'" % (priority)

#         json_query = {'db_name': db_name, 'collection_table_name': alert_collection,'condition': condition}
#         cam_alerts = requests.post('{}/list_data'.format(dal_url), json=json_query)
#         alerts = cam_alerts.json()['result']
#         df = pd.DataFrame(alerts)
#         try:
#             cam_count = len(df['cam_name'].unique())
#         except:
#             cam_count = 0
#         try: 
#             pie_df = df['alert_category'].value_counts()
#         except:
#             return jsonify({'pie_data': [],'table_data':[],'date_data':[]})
        
#         alerts_df = pd.DataFrame(index=alert_name)

#         fin_pie_df = alerts_df.join(pie_df).fillna(0) 
#         fin_pie_df=fin_pie_df.reset_index()
#         pie_df_list = fin_pie_df.to_dict('split')['data']
#         pie_data = [{item[0]: int(item[1])} for item in pie_df_list]
        

#         table_data = alerts

        
#         date_df = df[['alert_category', 'alert_date']].pivot_table(index='alert_category', columns='alert_date',
#                                                             aggfunc=len)
#         date_df_up=alerts_df.join(date_df)
#         date_df_trans = date_df_up.T
#         d1 = datetime.datetime.strptime(from_alert_date,'%Y-%m-%d')
#         d2 = datetime.datetime.strptime(to_alert_date,'%Y-%m-%d')
#         date_arr = pd.date_range(d1,d2,freq='d').strftime('%Y-%m-%d').tolist()
#         date_arr_df = pd.DataFrame(index=date_arr)
#         fin_date_df=date_arr_df.join(date_df_trans).T.fillna(0).reset_index()
#         date_df_list = fin_date_df.to_dict('split')['data']
#         date_data = [{"name": item[0], "values": [{date: int(count)} for date, count in zip(fin_date_df.columns[1:], item[1:])]} for
#                     item in date_df_list]

#         return jsonify({'status':'success','pie_data': pie_data,'table_data':table_data,'date_data':date_data, 'cam_count': cam_count})
#     except:
#         logger.error("Exception occurred at **** analytics_app / get_analytics_data_2_function **** \n", exc_info=True)
#         return jsonify({'status':'failed','error':'failed to get analytics preview data'})


@app.route("/get_analytics_preview_charts/<account_id>/<user_name>", methods=['POST'])
@check_for_token
def get_analytics_preview_charts(account_id,user_name):
    data = request.json
    state = data['state']
    city = data['city']
    location = data['location']
    cam_name = data['cam_name']
    to_datetime = data['to_alert_date']
    from_datetime = data['from_alert_date']

    # json_query_user = {'db_name':db_name,'collection_table_name': user_collection,'condition':"username='%s'"%(user_name)}
    # user_status = requests.post('{}/list_data'.format(dal_url),json=json_query_user).json()['result'][0]['staff_status']

    from_alert_date, to_alert_date, from_datetime, to_datetime = datetime_change(from_datetime, to_datetime)

    try:
        priority = data['priority']
    except:
        priority = ''
    condition, _, __ , ___, ____ = get_pql_query(state, city, location, to_alert_date, from_alert_date, priority, cam_name)

    json_query = {'db_name': db_name, 'collection_table_name': alert_collection,'condition': condition}
    cam_alerts = requests.post('{}/list_data'.format(dal_url), json=json_query)
    alerts = cam_alerts.json()['result']

    try:
        df = pd.DataFrame(alerts)
        df["date"]=pd.to_datetime(df["date"], format='%d/%m/%y %H:%M:%S')
        Date1 = df["date"] >= from_datetime
        Date2 = df["date"] <= to_datetime
        df = df.loc[Date1 & Date2]
        records_total = len(df.T)
    except:
        logger.debug("Exception occurred at **** analytics_app / get_analytics_preview_charts **** \n", exc_info=True)
        return jsonify({'status':'success','pie_data': [],'table_data':[],'date_data':[],'recordsTotal' : 0, 'recordsFiltered' : 0})

    try:
        df['alert_date']=df['date'].dt.date
    except:
        logger.debug("Exception occurred at **** analytics_app / get_analytics_preview_charts  **** \n", exc_info=True)
        df=df

    try:
        cam_count = len(df['cam_name'].unique())
    except:
        logger.debug("Exception occurred at **** analytics_app / get_analytics_preview_charts **** \n", exc_info=True)
        cam_count = 0
    try: 
        pie_df = df['alert_category'].value_counts()
    except:
        logger.debug("Exception occurred at **** analytics_app / get_analytics_preview_charts **** \n", exc_info=True)
        return jsonify({'status':'success','pie_data': [],'table_data':[],'date_data':[],'recordsTotal' : 0, 'recordsFiltered' : 0})
    
    alerts_df = pd.DataFrame(index=alert_name)

    fin_pie_df = alerts_df.join(pie_df).fillna('')
    fin_pie_df=fin_pie_df.reset_index()
    pie_df_list = fin_pie_df.to_dict('split')['data']
    for i in range(len(pie_df_list)):
        if isinstance(pie_df_list[i][1], float):
            pie_df_list[i][1]=int(pie_df_list[i][1])

    # pie_data = [{item[0]: item[1]} for item in pie_df_list]
    pie_data = []
    zero_count = 0

    for item in pie_df_list:
        pie_data.append({item[0]: item[1]})

        if item[1] == '':
            zero_count += 1

    if zero_count == len(pie_data):
        pie_data = []
    
    df['alert_date']=pd.to_datetime(pd.Series(df['alert_date']), format = '%Y-%m-%d')
    df['alert_date']=df['alert_date'].apply(lambda x: x.strftime('%Y-%m-%d')).to_list()
    
    date_df = df[['alert_category', 'alert_date']].pivot_table(index='alert_category', columns='alert_date',
                                                        aggfunc=len)
    date_df_up=alerts_df.join(date_df)
    date_df_trans = date_df_up.T
    d1 = datetime.datetime.strptime(from_alert_date,'%Y-%m-%d')
    d2 = datetime.datetime.strptime(to_alert_date,'%Y-%m-%d')
    date_arr = pd.date_range(d1,d2,freq='d').strftime('%Y-%m-%d').tolist()
    date_arr_df = pd.DataFrame(index=date_arr)
    #fin_date_df=date_arr_df.join(date_df_trans).T.fillna(0).reset_index()
    fin_date_df=date_df_trans.join(date_arr_df, how='outer').T.fillna('').reset_index()
    date_df_list = fin_date_df.to_dict('split')['data']

    for i in range(len(date_df_list)):
        for j in range(len(date_df_list[i])):
            if isinstance(date_df_list[i][j], float):
                date_df_list[i][j]=int(date_df_list[i][j])


    date_data = [{"name": item[0], "values": [{date: count} for date, count in zip(fin_date_df.columns[1:], item[1:])]} for
                 item in date_df_list]
                 
    return jsonify({'status':'success','pie_data': pie_data,'date_data':date_data, 'cam_count': cam_count,'recordsTotal' : records_total})


@app.route("/get_analytics_data_preview/<account_id>/<user_name>", methods=['POST'])
@check_for_token
def get_analytics_data_preview(account_id,user_name):
    data = request.json
    state = data['state']
    city = data['city']
    location = data['location']
    cam_name = data['cam_name']
    to_datetime = data['to_alert_date']
    from_datetime = data['from_alert_date']
    draw = data['draw']
    start=int(data['start'])
    length=int(data['length'])
    #regex = data['search']['regex']
    value = data['search']['value'].lower()

    # json_query_user = {'db_name':db_name,'collection_table_name': user_collection,'condition':"username='%s'"%(user_name)}
    # user_status = requests.post('{}/list_data'.format(dal_url),json=json_query_user).json()['result'][0]['staff_status']

    dt_mongofmt = lambda x : '0'+x[1:]  #temporary fix for issue in mongo at the time of coding
    to_dt, from_dt = dt_mongofmt(to_datetime), dt_mongofmt(from_datetime)
    
    priority = data['priority'] if 'priority' in data else ''

    try:
        cond_query = {'state': state, 'city': city, 'location': location, 'cam_name':cam_name,'priority': priority}
        Countcond,Matchcond, unfilt_Countcond = searchTextinDB(cond_query, to_dt, from_dt, value, start, length)
        filter_query={'db_name':db_name,'collection_table_name': alert_collection,'condition':Matchcond}
        filtered_alerts = requests.post('{}/custom_query'.format(dal_url),json=filter_query).json()['result']
        count_query={'db_name':db_name,'collection_table_name': alert_collection,'condition':Countcond}
        count_filtered = requests.post('{}/custom_query'.format(dal_url),json=count_query).json()['result'][0]['doc_count']
        alert_count_cond={'db_name':db_name,'collection_table_name': alert_collection,'condition':unfilt_Countcond}
        records_total= requests.post('{}/custom_query'.format(dal_url),json=alert_count_cond).json()['result'][0]['doc_count']
    except:
        logger.error("Exception occurred at **** analytics_app / get_analytics_data_preview **** \n", exc_info=True)
        records_total = 0
        count_filtered = 0
        filtered_alerts = []

    try:
        out_df = pd.DataFrame(filtered_alerts)
        cam_count = len(out_df['cam_name'].unique())
        out_df['date']=out_df['date'].apply(lambda x:datetime.datetime.strptime(str(x[2:]),'%y-%m-%d %H:%M:%S').strftime('%d/%m/%y %H:%M:%S'))
        out=out_df.fillna('').reset_index()
        datetime_alerts=json.loads(json.dumps(list(out.T.to_dict().values())))
        data = datetime_alerts

    except:
        logger.error("Exception occurred at **** analytics_app / get_analytics_data_preview **** \n", exc_info=True)
        data = filtered_alerts
        cam_count = 0
                 
    return jsonify({'status':'success','data':data,'cam_count': cam_count, 'recordsFiltered' : count_filtered, 'recordsTotal' : records_total, 'draw':draw})


@app.route("/get_analytics_data_opt/<account_id>/<user_name>", methods=['GET'])
@check_for_token
def get_analytics_data_opt(account_id, user_name):
    data = request.json
    state = "MH"
    city = "pune"
    location = "vimannagar"
#    area = data['area']
    to_alert_date = ""
    from_alert_date = ""
    try:
        priority = data['priority']
    except:
        priority = ''
    if state == '' and city == '' and location =='':
        condition = None
        table_var = 'state'
    if state != '' and city == '' and location =='':
        condition = "(state=='%s')" % (state)
        table_var = 'city'
    if state != '' and city != '' and location =='':
        condition = "(state=='%s' and city=='%s')" % (state,city)
        table_var = 'location'
    if state != '' and city != '' and location !='':
        condition = "(state=='%s' and city=='%s' and location=='%s')" % (state,city,location)
        table_var = 'area'

    if to_alert_date == '' or from_alert_date == '':
        to_date = datetime.now()
        from_date = to_date - datetime.timedelta(duration_period)
        to_alert_date = to_date.strftime('%Y-%m-%d')
        from_alert_date = from_date.strftime('%Y-%m-%d')
    
    if condition:
        condition += " and (alert_date <= date('%s') and alert_date >= date('%s'))" % (to_alert_date ,from_alert_date)
    else:
        condition = "(alert_date <= date('%s') and alert_date >= date('%s'))" % (to_alert_date ,from_alert_date)

    if priority != '' and priority in default_priority_list:
        condition += " and priority=='%s'" % (priority)
    json_query = {'db_name': db_name, 'collection_table_name':alert_collection,'condition':condition}
    cam_alerts = requests.post('{}/list_data'.format(dal_url), json=json_query)
    alerts = cam_alerts.json()['result']
    df = pd.DataFrame(alerts)
    df[['alert_1','alert_2','alert_status','area','cam_name','city','location','mqtt_notif_sent','priority','read_flag','send_notif_flag','state','video_status']] = df[['alert_1','alert_2','alert_status','area','cam_name','city','location','mqtt_notif_sent','priority','read_flag','send_notif_flag','state','video_status']].astype('category')
    df.drop([ '_id','alert_2', 'assigned_to',
       'covid_flag', 'end_frame', 'frame_diff',
       'mqtt_notif_sent', 'person_1_face_link', 'person_1_mask_flag',
       'person_2_face_link', 'person_2_mask_flag', 'read_flag',
       'send_notif_flag', 'start_frame',
       'video_status'], axis=1, inplace=True)
    try: 
        pie_df = df['alert_1'].value_counts()
    except:
        return jsonify({'pie_data': [],'table_data':[],'date_data':[]})
    
    alerts_df = pd.DataFrame(index=alert_name)
    fin_pie_df = alerts_df.join(pie_df).fillna(0) 
    fin_pie_df=fin_pie_df.reset_index()
    pie_df_list = fin_pie_df.to_dict('split')['data']
    pie_data = [{item[0]: int(item[1])} for item in pie_df_list]

    table_df = df[[table_var, 'alert_1']].pivot_table(index=table_var, columns='alert_1', aggfunc=len)
    table_df_trans = table_df.T
    fin_table_df = alerts_df.join(table_df_trans).T.fillna(0).reset_index()
    table_df_list = fin_table_df.to_dict('split')['data']
    table_data = [{"name": item[0], "values": [{alert: int(count)} for alert, count in zip(fin_table_df.columns[1:], item[1:])]}
                  for item in table_df_list]


    date_df = df[['alert_1', 'alert_date']].pivot_table(index='alert_1', columns='alert_date',
                                                        aggfunc=len)
    date_df_up=alerts_df.join(date_df)
    date_df_trans = date_df_up.T
    d1 =datetime.strptime(from_alert_date,'%Y-%m-%d')
    d2 =datetime.strptime(to_alert_date,'%Y-%m-%d')
    date_arr = pd.date_range(d1,d2,freq='d').strftime('%Y-%m-%d').tolist()
    date_arr_df = pd.DataFrame(index=date_arr)
    fin_date_df=date_arr_df.join(date_df_trans).T.fillna(0).reset_index()
    date_df_list = fin_date_df.to_dict('split')['data']
    date_data = [{"name": item[0], "values": [{date: int(count)} for date, count in zip(fin_date_df.columns[1:], item[1:])]} for
                 item in date_df_list]

    return jsonify({'status':'success','pie_data': pie_data,'table_data':table_data,'date_data':date_data})

@app.route("/get_vehicle_states/<account_id>/<user_name>", methods=['GET'])
@check_for_token
def get_vehicle_states(account_id, user_name):
    try:
        json_query={'db_name':db_name,'collection_table_name': voi_track_collection,
                    'condition':None}
        states = requests.post('{}/list_data'.format(dal_url), json=json_query)
        
        state_list = states.json()['result']
        total_vehicles = len(state_list)
        vehicles_inside = [s for s in state_list if 'state' in s]
        vehicles_inside = [s for s in vehicles_inside if s['state']=='in']
        vehicles_inside = len(vehicles_inside)

        return jsonify({'status':'success','total_vehicles':total_vehicles, 'vehicles_inside':vehicles_inside})
    except:
        logger.error("Exception occurred at **** analytics_app / get_vehicle_states function **** \n", exc_info=True)
        return jsonify({'status':'failed','error':'failed to vehicle states'})




@app.route("/get_alerts_csv/<account_id>/<user_name>", methods=['POST'])
@check_for_token
def get_alerts_csv(account_id,user_name,**kwargs):
    try:
        try:
            data = request.json
        except:
            data=kwargs
        try:
            data = request.json
            state = data['state']
            city = data['city']
            cam_name=data['cam_name']
            location = data['area']
            to_datetime = data['to_alert_date']
            from_datetime = data['from_alert_date']
        except:
            state,city,location,cam_name,to_datetime,from_datetime='','','','','',''

        try:
            alert_date=data["alert_date"]
        except:
            alert_date=''        

        
        from_alert_date, to_alert_date, from_datetime, to_datetime = datetime_change(from_datetime, to_datetime)

        try:
            priority = data['priority']
        except:
            #logger.error("Exception occurred at **** analytics_app / get_analytics_data **** \n", exc_info=True)
            priority = ''
        
        if state == '' and city == '' and location =='' and cam_name =='':
            condition = ""
        
        if state != '' and city == '' and location =='' and cam_name =='':
            condition = "(state=='%s')" % (state)
        
        if state != '' and city != '' and location =='' and cam_name =='':
            condition = "(state=='%s' and city=='%s')" % (state,city)
        
        if state != '' and city != '' and location !='' and cam_name =='':
            condition = "(state=='%s' and city=='%s' and location=='%s')" % (state,city,location)

        if state != '' and city != '' and location !='' and cam_name !='':
            condition = "(state=='%s' and city=='%s' and location=='%s' and cam_name=='%s')" % (state,city,location,cam_name)    

        if alert_date!='':
            if condition:
                condition += " and (alert_date == '%s') and verified=='true'" % (alert_date)
            else:
                condition = "(alert_date == '%s' ) and verified=='true'" % (alert_date)
            
                  
        else:
            if condition:
                #condition += " and (alert_date <= '%s' and alert_date >= '%s') and verified=='true'" % (to_alert_date ,from_alert_date)
                condition += " and ((alert_date <= '%s' and alert_date >= '%s' and verified=='true'"%(to_alert_date ,from_alert_date)+ "and alert_category not in {})".format(["VOI","POI","NONPOI"]) + "or (alert_date <= '%s' and alert_date >= '%s' and (verified=='true' or verified=='unverified')"%(to_alert_date ,from_alert_date) +"and alert_category in {}))".format(["VOI","NONPOI","POI"])
            else:
                #condition = "(alert_date <= '%s' and alert_date >= '%s') and verified=='true'" % (to_alert_date ,from_alert_date)
                condition += "(alert_date <= '%s' and alert_date >= '%s' and verified=='true'"%(to_alert_date ,from_alert_date)+ "and alert_category not in {})".format(["VOI","POI","NONPOI"]) + "or (alert_date <= '%s' and alert_date >= '%s' and (verified=='true' or verified=='unverified')"%(to_alert_date ,from_alert_date) +"and alert_category in {}) ".format(["VOI","NONPOI","POI"])


        if priority != '' and priority in default_priority_list:
            condition += " and priority=='%s'" % (priority)

        mCond=pql.find(condition)

        keys = ['alert_1',
                'alert_id',
                'city',
                'location',
                'cam_name',
                'priority',
                'alert_date',
                'date',
                'video']
               
        renamed_keys = ['Alert Name',
                        'Alert ID',
                        'City',
                        'Area Name',
                        'Camera Name',
                        'Priority',
                        'Date',
                        'Time',
                        'Evidence Clip']
                       
        proj = dict(zip(keys,[1]*len(keys)))
        proj['_id']= 0
        proj['poi_details']=1
        proj['voi_details']=1
        
       
        #days= get_date_array(from_alert_date_,to_alert_date_)
        # match_dict_1 = {"$match": {"$and":[{"verified":{"$in":["true"]}},{"alert_category":{"$nin":["POI","NONPOI","VOI"]}},{"alert_date":{"$in":days}}]}}
        # match_dict_2 = {"$match": {"$and":[{"verified":{"$in":["true","unverified"]}},{"alert_category":{"$in":["POI","NONPOI","VOI"]}},{"alert_date":{"$in":days}}]}}

        # match={
        #     "$match":{"$or":[
        #             {"verified":{"$in":["true"]},"alert_category":{"$nin":["POI","NONPOI","VOI"]},"alert_date":{"$in":days}},
        #             {"verified":{"$in":["true","unverified"]},"alert_category":{"$in":["POI","NONPOI","VOI"]},"alert_date":{"$in":days}}
        #         ]}},{"$project":proj}
        
        aggPipe = [ {'$match':mCond},
                    {'$project':proj}]
        
        cond = "db['%s'].aggregate({}, allowDiskUse=True)".format(aggPipe)
        json_query={'db_name':db_name,'collection_table_name': alert_collection,'condition':cond}
        cam_alerts = requests.post('{}/custom_query'.format(dal_url),json=json_query).json()['result']   
        
                 
        alerts_data = pd.json_normalize(cam_alerts, )
        try:
            alerts_data=alerts_data[pd.to_datetime(alerts_data['date']) <= pd.Timestamp(data['to_alert_date'])]
            alerts_data=alerts_data[pd.to_datetime(alerts_data['date']) >= pd.Timestamp(data['from_alert_date'])]
        except:
            pass    
        keys.extend(list(filter(lambda x:x.startswith(("voi_details","poi_details")),alerts_data.columns)))
        renamed_keys.extend([string.capwords(i.split('.')[1]) for i in keys if i.startswith(("voi_details","poi_details"))])
        
        alerts_data.rename(columns = dict(zip(keys, renamed_keys)), inplace = True)
        alerts_data.fillna(value='', inplace = True)
        if {'Poi_face_path', 'Poi_id'}.issubset(alerts_data.columns):
            alerts_data.drop(['Poi_face_path', 'Poi_id'], axis=1,inplace=True)
        if {'Vehicle Color','Vehicle Type'}.issubset(alerts_data.columns):
            alerts_data['Vehicle Color']=alerts_data['Vehicle Color'].map(lambda l:','.join(map(str, l)) if isinstance(l,list) else l)
            alerts_data['Vehicle Type']=alerts_data['Vehicle Type'].map(lambda l:','.join(map(str, l)) if isinstance(l,list) else l)
        if {'Time','Date','Evidence Clip'}.issubset(alerts_data.columns):
            alerts_data['Time'] = alerts_data['Time'].map(time_from_datetime)
            alerts_data['Date'] = alerts_data['Date'].map(lambda x : datetime.datetime.strftime(datetime.datetime.strptime(x,'%Y-%m-%d'),"%d/%m/%Y") if x else "")
            alerts_data['Evidence Clip'] = alerts_data['Evidence Clip'].map(lambda x : f'http://{domain_name}/nginx/{x}' if x else "")
       
        remove_keys=['Poi_face_path', 'Poi_id']
        renamed_keys=[keys for keys in renamed_keys if keys not in remove_keys]
        if not alerts_data.empty:    
            alerts_data = alerts_data[renamed_keys]    
        data_id = str(uuid.uuid4()).split('-')[-1]
        create_folder(PATH_TO_SAVE+'/alert_data')
        data_path = PATH_TO_SAVE+'/alert_data/'+ str(data_id)+'.csv'
        alerts_data.to_csv(data_path, index= False)
        path_to_send = domain_name + '/nginx' + '/alert_data/' + str(data_id) + '.csv'
        return jsonify({'status': 'success', 'file_path':path_to_send})
    except:
        logger.error("Exception occurred at **** analytics_app / get_alert_csv **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'Failed To Generate Report'})

@app.route("/get_poi_voi_csv/<account_id>/<user_name>/<service>", methods=['POST'])
@check_for_token
def get_poi_voi_csv(account_id,user_name,service,**kwargs):
    try:
        try:
            data = request.json
        except:
            data=kwargs
        to_datetime = data['to_date']
        from_datetime = data['from_date']
        to_alert_date = to_datetime.split(' ')[0]
        from_alert_date = from_datetime.split(' ')[0]
        split_to_date = to_alert_date.split('-')
        split_from_date = from_alert_date.split('-')
        to_db_date = f"{split_to_date[-1]}/{split_to_date[-2]}/{split_to_date[-3][2:]} {to_datetime.split(' ')[1]}" 
        from_db_date = f"{split_from_date[-1]}/{split_from_date[-2]}/{split_from_date[-3][2:]} {from_datetime.split(' ')[1]}"
        keys = ['alert_1',
                'alert_id',
                'city',
                'location',
                'cam_name',
                'priority',
                'alert_date',
                'date',
                'video']
               
        renamed_keys = ['Alert Name',
                        'Alert ID',
                        'City',
                        'Area Name',
                        'Camera Name',
                        'Priority',
                        'Date',
                        'Time',
                        'Evidence Clip']
                      
        proj = dict(zip(keys,[1]*len(keys)))
        proj['_id']= 0
        proj['poi_details']=1
        proj['voi_details']=1
        days= get_date_array(from_alert_date,to_alert_date)
        # if service == "POI":
        #     match_dict = {"$match": {"$and":[{"verified":"true"},{"alert_category":{"$in":["POI","NONPOI"]}},{"alert_date":{"$gte":from_alert_date}},{"alert_date":{"$lte":to_alert_date}}]}}
        # elif service == "VOI":
        #     match_dict = {"$match": {"$and":[{"verified":"true"},{"alert_category":"VOI"},{"alert_date":{"$gte":from_alert_date}},{"alert_date":{"$lte":to_alert_date}}]}}
        if service == "POI":
            match_dict = {"$match": {"$and":[{"verified":{"$in":["true","unverified"]}},{"alert_category":{"$in":["POI","NONPOI"]}},{"alert_date":{"$in":days}}]}}
            
        elif service == "VOI":
            match_dict = {"$match": {"$and":[{"verified":{"$in":["true","unverified"]}},{"alert_category":"VOI"},{"alert_date":{"$in":days}}]}}
        
        aggPipe = [ match_dict, 
                    {'$project':proj}]
        
        cond = "db['%s'].aggregate({}, allowDiskUse=True)".format(aggPipe)
        json_query={'db_name':db_name,'collection_table_name': alert_collection,'condition':cond}
        cam_alerts = requests.post('{}/custom_query'.format(dal_url),json=json_query).json()['result']   
        
        # try:
        #     for i in range(len(cam_alerts)):
        #         if cam_alerts[i]['alert_date'] == from_alert_date:
        #             if cam_alerts[i]['date'] < from_db_date:
        #                 cam_alerts.remove(cam_alerts[i])
                       
                
        # for i in range(1,len(cam_alerts)):
        #     if cam_alerts[-i]['alert_date'] == to_alert_date:
        #         if cam_alerts[-i]['date'] > to_db_date:
        #             cam_alerts.remove(cam_alerts[-i])
        #     else:
        #         pass
        alerts_data = pd.json_normalize(cam_alerts, )
        try:
            alerts_data=alerts_data[pd.to_datetime(alerts_data['date']) <= pd.Timestamp(to_datetime)]
            alerts_data=alerts_data[pd.to_datetime(alerts_data['date']) >= pd.Timestamp(from_datetime)]
        except:
            pass    
        keys.extend(list(filter(lambda x:x.startswith(("voi_details","poi_details")),alerts_data.columns)))
        renamed_keys.extend([string.capwords(i.split('.')[1]) for i in keys if i.startswith(("voi_details","poi_details"))])
        
        alerts_data.rename(columns = dict(zip(keys, renamed_keys)), inplace = True)
        alerts_data.fillna(value='', inplace = True)
        if {'Poi_face_path', 'Poi_id'}.issubset(alerts_data.columns):
            alerts_data.drop(['Poi_face_path', 'Poi_id'], axis=1,inplace=True)
        if {'Vehicle Color','Vehicle Type'}.issubset(alerts_data.columns):
            alerts_data['Vehicle Color']=alerts_data['Vehicle Color'].map(lambda l:','.join(map(str, l)) if isinstance(l,list) else l)
            alerts_data['Vehicle Type']=alerts_data['Vehicle Type'].map(lambda l:','.join(map(str, l)) if isinstance(l,list) else l)

        if {'Time','Date','Evidence Clip'}.issubset(alerts_data.columns):
            alerts_data['Time'] = alerts_data['Time'].map(time_from_datetime)
            alerts_data['Date'] = alerts_data['Date'].map(lambda x : datetime.datetime.strftime(datetime.datetime.strptime(x,'%Y-%m-%d'),"%d/%m/%Y") if x else "")
            alerts_data['Evidence Clip'] = alerts_data['Evidence Clip'].map(lambda x : f'http://{domain_name}/nginx/{x}' if x else "")
        
        
        remove_keys=['Poi_face_path', 'Poi_id']
        renamed_keys=[keys for keys in renamed_keys if keys not in remove_keys]
        if not alerts_data.empty:    
            alerts_data = alerts_data[renamed_keys]    
        data_id = str(uuid.uuid4()).split('-')[-1]
        create_folder(PATH_TO_SAVE+'/alert_data')
        data_path = PATH_TO_SAVE+'/alert_data/'+ str(data_id)+'.csv'
        alerts_data.to_csv(data_path, index= False)
        path_to_send = 'alert_data/' + str(data_id) + '.csv'
        return jsonify({'status': 'success', 'file_path':path_to_send})
    except:
        logger.error("Exception occurred at **** analytics_app / get_poi_voi_csv **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'Failed To Generate Report'})


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=4441, debug=True)
