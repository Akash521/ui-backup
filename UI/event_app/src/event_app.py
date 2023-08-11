import json
import logging
import os
import shutil
import pickle
import shlex
import subprocess
import time
import traceback
import uuid
import threading
from datetime import datetime, timedelta, date
from functools import lru_cache, wraps
from numplate_encoder import get_numplate_model
import cv2
import faiss
import jwt
import numpy as np
import pandas as pd
import pymongo
import requests
import base64
#from config import *
from config.config import *
from flask import Flask, jsonify, make_response, request
from flask_cors import CORS, cross_origin
from kubernetes import client, config
from pytz import timezone
from scipy.spatial.distance import cosine

# from FaceDetector import FaceDetector
# from FR_dlib import FaceRecognition
from json_encoder import JSONEncoder
from launch_service import is_port_in_use, launch_service, is_port_free
# from poi import *
from utils import *
import torch
from onvif2 import ONVIFCamera
from zeep.transports import Transport

realtimeAlertLimit = 500

logger= logging.getLogger(__name__)
# FORMAT = "\n\n %(asctime)s --- %(message)s"
# logging.basicConfig(format = FORMAT, datefmt= "%d-%b-%y %H:%M:%S", level= logging.DEBUG)

# detector = FaceDetector()
# recg = FaceRecognition()

vehicle_detector = {}
num_plate_recognizer = get_numplate_model()

tz = timezone(time_zone)

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 15 * 1000 * 1000
CORS(app)

config.load_kube_config(config_file='/app/k8s/kubeconfig')
k8s_apps_v1 = client.AppsV1Api()
k8s_apps_ser = client.CoreV1Api()

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
        logger.error("Exception occurred at **** event_app / check_secret_key **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to get secret key'})    

def check_for_token(func):
    @wraps(func)
    def wrapped(*args, **kwargs):

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
    return wrapped


@app.route("/get_token", methods=['POST'])
def get_token():
    try:
        data=request.json
        
        check_secret_key()

        #Check for Username
        json_query = {'db_name': db_name, 'collection_table_name': user_collection,'condition': "username='%s'" % (data['username'])}
        resp_username = requests.post('{}/list_data'.format(dal_url), json=json_query).json()['result'][0]
        if not resp_username:
            # print('in get token',resp_username)
            return make_response(jsonify({'WWW-Authenticate':'Basic realm:"login error"'}),403)

        # check for password
        if 'cajun' in resp_username and 'passhash' in resp_username:
            if not check_passhash(data['password'], resp_username['cajun'], resp_username['passhash']):
                return make_response(jsonify({'WWW-Authenticate': 'Basic realm:"login error"'}), 403)

        elif resp_username['password'] != data['password']:
            return make_response(jsonify({'WWW-Authenticate': 'Basic realm:"login error"'}), 403)

        token=jwt.encode({
            'user':data['username'],
            'password':data['password'],
            'exp':datetime.utcnow()+timedelta(weeks=52)},
            app.config['SECRET_KEY']
            )

        return jsonify({'token':token})
    except:
        logger.error("Exception occurred at **** event_app / get_token_function **** \n", exc_info=True)
        # return jsonify({'ping': ''})
        return make_response(jsonify({'WWW-Authenticate':'Basic realm:"login error"'}),403)

@app.route("/ping", methods=['GET'])
@check_for_token
def ping():
    return jsonify({'ping': 'pong'})


@app.route("/capture_frame/<account_id>/<user_name>", methods=['POST'])
@check_for_token
def capture_frame(account_id,user_name):
    data = request.json
    cam_url = data['cam_url']
    path = PATH_TO_SAVE + '/' + user_name
    if not os.path.exists(path):
       os.makedirs(path)
    try:
        cap = cv2.VideoCapture(cam_url)
        # print("----------------------", cap.isOpened())
        _, frame = cap.read()
        frame = cv2.resize(frame, (640, 384))
    except:
        logger.error("Exception occurred at **** event_app / capture_frame_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'Invalid RTSP/RTMP url'})
    uid = str(uuid.uuid4())
    try:
       cv2.imwrite(path + '/'+ uid +'.jpg', frame)
    except:
        logger.error("Exception occurred at **** event_app / capture_frame_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'Failed to save frame'})

    json_query={'db_name':db_name,'collection_table_name': location_collection,'condition':None}
    pincode_details=requests.post('{}/list_data'.format(dal_url),json=json_query)
    pincode_details = pincode_details.json()['result']

    return jsonify({'breach_image': user_name + '/'+ uid +'.jpg',
                    'image_height': frame.shape[0],
                    'image_width': frame.shape[1],
                    'non_perimeter_without_time': non_perimeter_without_time,
                    'non_perimeter_with_time': non_perimeter_with_time,
                    'perimeter_without_time': perimeter_without_time,
                    'perimeter_with_time': perimeter_with_time,
                    'pincode_details': eval(JSONEncoder().encode(pincode_details)),
                    #'perimeter_types': perimeter_types,
                    'status':'success'})

@app.route("/save_pincode_details/<account_id>/<user_name>", methods=['POST'])
@check_for_token
def save_pincode_details(account_id,user_name):
    try:
        data = request.json
        
        json_query={'db_name':db_name,'collection_table_name': location_collection,'condition':"location='%s'"%data['location']}
        pincode_details=requests.post('{}/list_data'.format(dal_url),json=json_query)
        pincode_details = pincode_details.json()['result']

        if len(pincode_details) >= 1:
            return jsonify({'status': 'failed','error':'Pincode details already exists'})
        else:
            json_query = {'data':data,'db_name':db_name,'collection_table_name': location_collection}
            resp = requests.post('{}/insert_data'.format(dal_url),json=json_query)
            return jsonify({'status':'success'})

    except:
        logger.error("Exception occurred at **** event_app / save_pincode_details **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'Failed to save pincode details'})    

@app.route("/get_atm_lat_long_map/<account_id>/<user_name>",methods=['GET'])
@check_for_token  
def get_atm_lat_long_map(account_id, user_name):
    '''
        Main API when we click on map page.
        Given a user type return different info.
        Response :
            {
             "atm_lat_long": [{Details of the atm along with lat long}],
             "total_live_cams": int,
             "total_alert_count": int   
            }
    '''
    try:
        # Find the type of the user
        # json_query_user = {'db_name':db_name,'collection_table_name': user_collection,'condition':"username='%s'"%(user_name)}
        # user_status = requests.post('{}/list_data'.format(dal_url),json=json_query_user).json()['result'][0]['staff_status']

        # Change in atm list according to use type
        # if user_status == "cust_server":
        #     cond = "cust_view='true' and atm_id_status='occupied'"
        # else:
        #     cond = "atm_id_status='occupied'"

        # Find respective atms
        # json_query = {'db_name':db_name,'collection_table_name': location_collection,'condition': ""}
        # resp = requests.post('{}/list_data'.format(dal_url),json=json_query).json()['result']
        # atm_ids = [atm["atm_id"] for atm in resp]

        # Count condition change according to use type
        # if user_status == "cust_server":
        #     aggPipe = [ {"$match": {"verified": "true" , "alert_1" : { "$nin": hidden_alerts}, "alert_2" : { "$nin": hidden_alerts}}}, {"$group": {"_id": "$atm_id" , "count": {"$sum": 1}}}]
        # else:
        #     aggPipe = [ {"$match": {"verified": "true"}}, {"$group": {"_id": "$atm_id" , "count": {"$sum": 1}}}]

        # cond = "db['%s'].aggregate({}, allowDiskUse=True)".format(aggPipe)
        # json_query_search = { "db_name": db_name, "collection_table_name": alert_collection, "condition": cond }
        # resp_atm_count = requests.post("{}/custom_query".format(dal_url), json=json_query_search).json()["result"]
        # atm_count_dict = {atm['_id']: atm['count'] for atm in resp_atm_count if atm['_id'] in atm_ids}
        # json_query_search = { "db_name": db_name, "collection_table_name": alert_collection, "condition": "" }
        # total_alert_count = requests.post("{}/count_data".format(dal_url), json=json_query_search).json()["result"]
        # Getting all the cameras
        json_query={'db_name':db_name,'collection_table_name': user_collection,'condition':"username='%s'"%user_name}
        usr_data=requests.post('{}/list_data'.format(dal_url),json=json_query).json()['result'][0]

        json_query_cam = {'db_name':db_name,'collection_table_name': camera_collection,'condition':"cam_status = '%s'"%'live'}
        total_live_cams = requests.post('{}/count_data'.format(dal_url),json=json_query_cam).json()['result']

        json_query_location = {'db_name':db_name,'collection_table_name': location_collection,'condition':""}
        location_lat_long = requests.post('{}/list_data'.format(dal_url),json=json_query_location).json()['result']
        location_lat_long= [d for d in location_lat_long if (d['longitude'] and d['latitude'])]
        if usr_data["staff_status"] == "cust_server":
            aggPipe = [ {"$match": {"verified":"true"}},{"$group": {"_id": "$location" , "count": {"$sum": 1}}}]
        else:
            aggPipe = [ {"$group": {"_id": "$location" , "count": {"$sum": 1}}}]

        cond = "db['%s'].aggregate({}, allowDiskUse=True)".format(aggPipe)
        json_query_search = { "db_name": db_name, "collection_table_name": alert_collection, "condition": cond }
        loc_alert_count = requests.post("{}/custom_query".format(dal_url), json=json_query_search).json()["result"]

        loc_alert_count_dict = {loca['_id']: loca['count'] for loca in loc_alert_count}
        total_alert_count = 0
        for loc in location_lat_long:
            try:
                loc['alert_count'] =  loc_alert_count_dict[loc['location']]
                total_alert_count = total_alert_count + loc_alert_count_dict[loc['location']]
            except:
                loc['alert_count'] = 0
        # Filter cameras with respect to atms
        # cam_dict = dict()
        # for cam in resp_cams:
        #     if cam['atm_id'] in atm_ids:
        #         try:
        #             cam_dict[cam["atm_id"]].append({"cam_name": cam["cam_name"], "cam_status": cam["cam_status"]})
        #         except:
        #             cam_dict[cam["atm_id"]] = []
        #             cam_dict[cam["atm_id"]].append({"cam_name": cam["cam_name"], "cam_status": cam["cam_status"]})
        
        # atm_list = []
        # total_alert_count = 0
        # total_live_cams_count = 0
        # for atm in resp:
        #     resp_count = atm_count_dict.get(atm['atm_id'])
        #     if not resp_count:
        #         resp_count = 0
        #     atm['alert_count'] = resp_count
        #     total_alert_count += resp_count

        #     try:
        #         live_count = [cam["cam_status"] for cam in cam_dict.get(atm['atm_id'])].count('live') 
        #     except:
        #         live_count = 0

        #     if live_count:
        #         total_live_cams_count += live_count
        #         atm['atm_status']='online'
        #     else:
        #         atm['atm_status']='offline'

        #     atm_list.append(atm)

        
        return jsonify({"status":"success","location_lat_long":location_lat_long,"total_live_cams":total_live_cams,"total_alert_count":total_alert_count})
        
    except:
        logger.error("Exception occurred at **** event_app / get_atm_lat_long_map **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'Failed to load location wise count'})

@app.route("/get_atm_cam_alert_map/<account_id>/<user_name>/<location>/<cam_name>",methods=['GET'])
@check_for_token  
def get_atm_cam_alert_map(account_id, user_name, location, cam_name):
    try:
        # json_query_user = {'db_name':db_name,'collection_table_name': user_collection,'condition':"username='%s'"%(user_name)}
        # user_status = requests.post('{}/list_data'.format(dal_url),json=json_query_user).json()['result'][0]['staff_status']
        cond = "location='%s' and cam_name ='%s'"%(location, cam_name)
        # if user_status == "cust_server":
            # cond += " and ( alert_1 not in %s and alert_2 not in %s)"%(hidden_alerts, hidden_alerts) 
        
        json_query={'db_name':db_name,'collection_table_name': alert_collection,'condition':cond}
        resp=requests.post('{}/list_data'.format(dal_url),json=json_query).json()['result']

        # resp.sort(key = lambda x:x['date'],reverse=True)
        resp.reverse()
        if resp:
            return jsonify({"status":"success","location_cam_alerts":resp,"count":len(resp)})
        else:
            return jsonify({'status': 'failed','error':"No alert found"})

    except:
        logger.error("Exception occurred at **** event_app / get_atm_cam_alert_map **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':"No alert found"})

@app.route("/get_atm_cam_map/<account_id>/<user_name>/<location>",methods=['GET'])
@check_for_token  
def get_atm_cam_map(account_id, user_name, location):

    json_query={'db_name':db_name,'collection_table_name': camera_collection,'condition':"location='%s'"%(location)}
    resp_cameras=requests.post('{}/list_data'.format(dal_url),json=json_query).json()['result']

    # json_query={'db_name':db_name,'collection_table_name': location_collection,'condition':"location='%s'"%(location)}
    # resp_atm=requests.post('{}/list_data'.format(dal_url),json=json_query).json()['result'][0]
    
    # if '//' in domain_name:
    #     domain = domain_name.split('//')[1]
    # else:
    #     domain = domain_name
    json_query={'db_name':db_name,'collection_table_name': user_collection,'condition':"username='%s'"%user_name}
    usr_data=requests.post('{}/list_data'.format(dal_url),json=json_query).json()['result'][0]

    xx=[]  
    try:
        for dt in resp_cameras:
            # Validating cam_status key in camera dict
            if 'cam_status' in dt:
                # if dt['cam_status'] == 'live':
                #     port=resp_atm['cam_url_details'][dt['cam_name']]['node_port']
                # #     dt['nabto_cam_url']='{}:{}'.format(domain, port)
                # json_query_user = {'db_name':db_name,'collection_table_name': user_collection,'condition':"username='%s'"%(user_name)}
                # user_status = requests.post('{}/list_data'.format(dal_url),json=json_query_user).json()['result'][0]['staff_status']
                # cond = "atm_id='%s' and cam_name ='%s' and verified='true'"%(atm_id, dt['cam_name'])
                # if user_status == "cust_server":
                # cond += " and ( alert_1 not in %s and alert_2 not in %s)"%(hidden_alerts, hidden_alerts) 
                if usr_data["staff_status"] == "cust_server":
                    json_query={'db_name':db_name,'collection_table_name': alert_collection,'condition':"verified = 'true' and cam_name ='%s'"%(dt['cam_name'])}
                else:
                    json_query={'db_name':db_name,'collection_table_name': alert_collection,'condition':"cam_name ='%s'"%(dt['cam_name'])}
                try:
                    dt['alert_count'] = requests.post('{}/count_data'.format(dal_url),json=json_query).json()['result']
                except:
                    logger.error("Exception occurred at **** event_app / get_atm_cam_map **** \n", exc_info=True)
                    dt['alert_count'] = 0
                xx.append(dt)

        return jsonify({"status":"success","atm_cam_details":xx})
    except:
        logger.error("Exception occurred at **** event_app / get_atm_cam_map **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'Failed to fetch data from server mentioned location'})


@app.route("/getAllAlerts/<account_id>/<user_name>/<p>/<date>/<alert_status>", methods=['POST'])    
def getAllAlerts(account_id,user_name,p,date, alert_status):
    filters=request.json
    start=int(filters['start'])
    length=int(filters['length'])
    draw = filters['draw']
    regex = filters['search']['regex']
    value = filters['search']['value'].lower()
    search_list = []
    alert_names = list(default_priority.keys())
    #alert_names.remove('Client Active')
    #alert_names.remove('Client Inactive')
    #alert_names=alert_names+['Cash Loading']+['Suspicious Activity']
    # print(filters)
    #json_query={'db_name':db_name,'collection_table_name': user_collection,'condition':"username='%s'"%(user_name)}
    #user_status= requests.post('{}/list_data'.format(dal_url),json=json_query).json()['result'][0]['staff_status']
    # print(resp_user)
    # json_query={'db_name':db_name,'collection_table_name': alert_collection,'condition':"city='%s' and priority='%s'"%(user_name,p)}

    try:
        json_query = {'db_name':db_name,'collection_table_name': user_collection,'condition':"username='%s'"%(user_name)}
        user_status = requests.post('{}/list_data'.format(dal_url),json=json_query).json()['result'][0]['staff_status']
    except:
        user_status = ""
    
    try:
        if value == '':
            try:
                user_date_wise_alerts,alert_count, user_data, prioritywise_alert_count = getAlerts(alert_status,user_name,date,p,start,length,user_status)
                resp_count = prioritywise_alert_count[p]
                # return jsonify({'status':'success', 'alert_names': alert_names ,'data':user_date_wise_alerts, 'active_status':user_data['active_status'],'priority_count':{'P1':prioritywise_alert_count['P1'],'P2':prioritywise_alert_count['P2'],'P3':prioritywise_alert_count['P3']}})
                return jsonify({'status':'success' , "data":user_date_wise_alerts, "recordsFiltered": resp_count, "recordsTotal":resp_count, "draw": draw, 'priority_count':{'P1':prioritywise_alert_count['P1'],'P2':prioritywise_alert_count['P2'],'P3':prioritywise_alert_count['P3']},'alert_names':alert_names})
            except:

                logger.error("Exception occurred at **** event_app / AllAlerts **** \n", exc_info=True)
                return jsonify({'status':'failed'})
                # p1 = list(raven_db['alert'].find({"assigned_to":user_name,"priority":p},{'_id':0}).skip(int(start)))
            
        if value:
            
            # json_query={"db_name": db_name, "collection_table_name": alert_collection, "condition": "assigned_to='%s' and priority='%s'"%(user_name,p)}
            # p1=requests.post('{}/list_data'.format(dal_url),json=json_query).json()['result']
            try:
                search_list,alert_count, user_data, prioritywise_alert_count = getAlerts(alert_status,user_name,date,p,start,length,user_status,value=value)
            
                resp_count = prioritywise_alert_count[p]
      
                # search_list = [j for i,j in enumerate(user_date_wise_alerts) if value in str(j.values()).lower()]
                # resp_count = len(search_list)
 
            
            except Exception as e:
                traceback.print_exc()
                return jsonify({'status':'failed'})
            
            # return jsonify({'status':'success' , 'comments':list(comments_list.values()),"data":search_list[start:start+length], "recordsFiltered": len(search_list), "recordsTotal":resp_count, "draw": draw,'active_status':user_data['active_status'], 'priority_count':{'P1':prioritywise_alert_count['P1'],'P2':prioritywise_alert_count['P2'],'P3':prioritywise_alert_count['P3']},'alert_names':alert_names})
            return jsonify({'status':'success',"data":search_list, "recordsFiltered": alert_count, "recordsTotal":resp_count, "draw": draw, 'priority_count':{'P1':prioritywise_alert_count['P1'],'P2':prioritywise_alert_count['P2'],'P3':prioritywise_alert_count['P3']},'alert_names':alert_names})
            
            # return jsonify({"data":search_list[:10], "recordsFiltered": len_search, "recordsTotal":resp_count, "draw": draw,'active_status':resp_user['active_status']})
  
    except:
        traceback.print_exc()
        return jsonify({'status':'failed'})



@app.route("/get_help_desk_alerts/<account_id>/<user_name>/<p>/<date>/<alert_status>", methods=['GET']) 
@check_for_token
def get_help_desk_alerts(account_id, user_name, p, date, alert_status):
    try:
        # data = request.json
        alert_names = list(default_priority.keys())
        # alert_names.remove('Client Active')
        # alert_names.remove('Client Inactive')
        # alert_names=alert_names+['Cash Loading']+['Suspicious Activity']
        # try:
        #     date = data['date']
        # except:
        #     logger.error("Exception occurred at **** event_app / get_help_desk_alerts **** \n", exc_info=True)
        #     date = datetime.now().strftime('%Y-%m-%d')
        
        # json_query = {'db_name':db_name,'collection_table_name': user_collection,'condition':"username='%s'"%(user_name)}
        # user_status = requests.post('{}/list_data'.format(dal_url),json=json_query).json()['result'][0]['staff_status']
        
        #staff status check
        # if user_status != 'administrator':
        #     if alert_status == 'pending':

        #         user_wise_alerts = getHelpdeskAlertQuery({"$ne":"resolved"},p,user_name)
                
        #         cond = priorityCountQuery({"$ne": "resolved"},user_name)

        #     else:# elif data['alert_status']=='resolved':

        #         user_wise_alerts = getHelpdeskAlertQuery("resolved",p,user_name)

        #         cond = priorityCountQuery("resolved",user_name)
        #         # ]
       # else:
        #if alert_status == 'pending':
            
        user_wise_alerts = getHelpdeskAlertQuery("unverified",p,{"$ne":"nullUser"})

        cond = priorityCountQuery("unverified",{"$ne":"nullUser"})                

        # else:#elif data['alert_status']=='resolved':
            
        #     user_wise_alerts = getHelpdeskAlertQuery("resolved",p,{"$ne":"nullUser"})

        #     cond = priorityCountQuery("resolved",{"$ne":"nullUser"})  


        json_query_user = {'db_name':db_name,'collection_table_name': alert_collection,'condition':user_wise_alerts}
        user_wise_alerts=requests.post('{}/custom_query'.format(dal_url),json=json_query_user).json()['result']
        # user_date_wise_alerts.reverse()

        prioritywise_alert_count = {p:0 for i, p in enumerate(default_priority_list)}


        json_query_priority={'db_name':db_name,'collection_table_name': alert_collection,'condition':cond}
        prioity_count = requests.post('{}/custom_query'.format(dal_url),json=json_query_priority).json()['result']
        for p in prioity_count:
            prioritywise_alert_count[p['_id']] = realtimeAlertLimit if p['count']>=realtimeAlertLimit else p['count']


        json_query_user={'db_name':db_name,'collection_table_name': user_collection,'condition':"username='%s'"%(user_name)}
        user_data=requests.post('{}/list_data'.format(dal_url),json=json_query_user).json()['result'][0]

        return jsonify({'status':'success', 'alert_names': alert_names, 'data':user_wise_alerts, 'priority_count':{'P1':prioritywise_alert_count['P1'],'P2':prioritywise_alert_count['P2'],'P3':prioritywise_alert_count['P3']}})
        # return jsonify({'status':'success', 'alert_names': alert_names ,'data':user_date_wise_alerts, 'active_status':user_data['active_status'],'priority_count':{'P1':P1_count,'P2':P2_count,'P3':P3_count}})

    except:
        logger.error("Exception occurred at **** event_app / get_help_desk_alerts **** \n", exc_info=True)
        return jsonify({'status':'failed'})


@app.route("/alert_action/<account_id>/<user_name>", methods=['POST'])
@check_for_token  
def alert_action(account_id, user_name):
    '''
    API to update verify key in the alert dict.
        verified            => ['unverified', 'true', 'false']

                          Tabs on UI  =>|          [True]       |        [False]
                                        |                       |  
                                        |  CMark alert as True  | Mark alert as False
    payload :
        {       
            verify              : 'true' with comment for [Close] (Marks alert as True) | verified => 'true', qrt_frontend_status => 'resolved'
                                  'true' with false_checkbox_flag == 'true' for [False] (Marks alert as False) | verified => 'false', qrt_frontend_status => 'resolved'
                                  'false' for [False] (Marks False alert as unverified) | verified => 'unverified', qrt_frontend_status => 'pending'
            
            comment             : Must for P1 and P2 [Close]
            
            false_checkbox_flag : 'true'  for [False]
                                  'false' for [Close]
            
            alert_data          : {alert_dict}
        }

    '''
    try:
        data = request.json
        alert_id = data['alert_data']['alert_id']
        # try:
        #     comment = data['comment']
        # except:
        #     # logger.error("Exception occurred at **** event_app / alert_action **** \n", exc_info=True)
        #     comment = ''
        
        try:
            false_checkbox_flag = data['false_checkbox_flag']
        except:
            # logger.error("Exception occurred at **** event_app / alert_action **** \n", exc_info=True)
            false_checkbox_flag = 'false'

        # Updating verified key 
        # if not update_verified_key(data['verify'], user_name, data['alert_data'], comment, false_checkbox_flag,comment_flag=True, account_name= account_id, pub_cust_server = True):
        #     return jsonify({'status': 'Failed to update verified status. Try again.','alert_id':alert_id})
        # res = 'Alert Closed'
        # if false_checkbox_flag == 'true':
        #     if data['verify'] == 'true' :
        #         res = 'False Successfully'
        #     else:
        #         res = 'Unverified Successfully'
        # if verification == 'true':
        #     update_data = {'verified':'true'}
        # elif verification == 'false':
        #     update_data = {'verified':'false'}
        # elif verification == 'unverified':
        #     verification = {'verified':'unverified'}
        # else:
        #     pass
        #if data['verification_key'] == "true":
        #    update_data = data
        #else:
        #    update_data = {'verified': data['verification_key']}

        update_data = data
        update_data['alert_data']['verified'] = data['verification_key']
    
        json_query={'data':update_data['alert_data'],'db_name':db_name,'collection_table_name': alert_collection,'condition':"alert_id='%s'"%(alert_id)}
        resp=requests.post('{}/update_data'.format(dal_url),json=json_query).json()

        if resp['status']:
            return jsonify({'status': 'success','alert_id':alert_id})
        else:
            return jsonify({'status': 'failed','alert_id':alert_id})

    except:
        logger.error("Exception occurred at **** event_app / alert_action **** \n", exc_info=True)
        return jsonify({'status':'failed','alert_id':alert_id})


@app.route("/start_service/<account_id>/<user_name>", methods=['POST'])
@check_for_token
def start_service(account_id, user_name, **kwargs):
    try:
        try:
            data = request.json
        except:
            data = kwargs
        try:
            license_key_verification = license_key_verify()
            if license_key_verification[0] and "success" in license_key_verification:
                pass
            elif not license_key_verification[0] and "camera limit exceed" in license_key_verification:
                return jsonify({'status': 'Failed', 'error': 'Camera Limit Exceed For Your License'})
            elif not license_key_verification[0] and "failed to verify license" in license_key_verification:
                return jsonify({'status': 'Failed', 'error': 'Failed To Verify License Key'})
            elif not license_key_verification[0] and "license not added" in license_key_verification: 
                return jsonify({'status': 'Failed', 'error': 'License Key Not Added'}) 
        except:
            return jsonify({'status': 'failed', 'error': 'License Verification Failed'})

        cam_info_dict = generate_cam_dict(account_id,user_name,"",data['cam_name'],data['cam_url'],data['state'],data['city'],data['location'],data['pincode'], data['user_email'],data['type']) 
        
        try:
            cam_info_dict['to_phone_no'] = data['to_phone_number']
        except:
            # logger.error("Exception occurred at **** event_app / start_service_function **** \n", exc_info=True)
            cam_info_dict['to_phone_no'] = ""
        try:
            cam_info_dict['user_contact'] = data['user_contact']
        except:
            # logger.error("Exception occurred at **** event_app / start_service_function **** \n", exc_info=True)
            cam_info_dict['user_contact'] = ''
            
        while True:
            random_port = np.random.randint(30000,32767)
            # result = is_port_in_use(random_port)
            result = is_port_free(random_port)
            # if result == False:
            if result == True:
                break

        cam_info_dict['cam_output_url'] = f'ws://{domain_name.split(":")[0]}:{random_port}'
        service_name = str(cam_info_dict['cam_name']) + '-livestream'

        try:
            json_query = {'db_name': db_name, 'collection_table_name': camera_collection, 'condition': "cam_name='%s'"%str(cam_info_dict['cam_name'])}
            cam_present = requests.post('{}/list_data'.format(dal_url),json = json_query)
            data1 = cam_present.json()['result']
        except:
            data1 = []
        
        if data1 == []:
            try:
                service_name = str(cam_info_dict['cam_name']) + '-livestream'
                # re1 = launch_service(service_name=service_name, data=cam_info_dict, ffmpeg_image_flag=True,random_port=random_port)
                re1 = threading.Thread(target = launch_service, args = (True, service_name, cam_info_dict, random_port))
                re1.start()
                re1.join()

                json_query = {'data':cam_info_dict,'db_name':db_name,'collection_table_name': camera_collection}
                resp = requests.post('{}/insert_data'.format(dal_url),json=json_query)
            
            except:
                return jsonify({'status': 'failed', 'error': 'livestream pod not launched'})
        
        else:
            return jsonify({'status': 'failed', 'error': 'camera already added'})
        
        return jsonify({'status': 'success'})
    
    except:
        logger.error("Exception occurred at **** event_app / start_service **** \n", exc_info=True)
        return jsonify({'status': 'failed'})

    
@app.route("/modify_service/<account_id>/<user_name>/<cam_name>", methods=['POST'])
@check_for_token
def modify_service(account_id, user_name, cam_name):
    data = request.json
    json_query = {'db_name': db_name, 'collection_table_name': camera_collection,
                                      'condition': "cam_name='%s' and cam_status='%s'" % (cam_name, 'live')}
    resp = requests.post('{}/list_data'.format(dal_url), json=json_query)
    data1 = resp.json()['result'][0]

    coord_keys  = [
        'Loitering',
        # 'POI',
        #'VOI',
        'Stevedore',
        # 'NONPOI',
        'Crawling',
        'Drone',
        'Crowd',
        'Intrusion',
        'wall jump',
        'Unattended Station'
        ]
    coord_values = [
        ["loitering_breach_coordinates"],
        # ["p_o_i_breach_coordinates"],
        #["authorised_vehicle_breach_coordinates"],
        ["stevedore_breach_coordinates"],
        # ["n_o_n_p_o_i_breach_coordinates"],
        ['crawling_breach_coordinates'],
        ['drone_breach_coordinates'],
        ['crowd_breach_coordinates'],
        ["intrusion_breach_coordinates"],
        ['wall_jump_breach_coordinates'],
        ['unattended_station_breach_coordinates']
    ]
    coord_nones = [{}, {}, {}]

    for  k,v,n in zip(coord_keys, coord_values, coord_nones):

        try:
            for val in v:
                data[val]
        except:
            #logger.error("Exception occurred at **** event_app / modify_service_function **** \n", exc_info=True)
            if k not in data['alert_array']:
                for val in v:
                    data[val] = n
            
            elif all([data1.get(val) is not None and bool(data1[val])  for val in v]):
                for val in v:
                    data[val]=data1[val]
    try:
        data["intrusion_from_time"]
        data["intrusion_to_time"]
    except:
        # logger.error("Exception occurred at **** event_app / modify_service_function **** \n", exc_info=True)
        if "Intrusion" not in data['alert_array']:
            data["intrusion_from_time"]=''
            data['intrusion_to_time']=''
        elif data1.get('intrusion_from_time') and data1.get('intrusion_to_time') is not None and bool(data1['intrusion_from_time']) and bool(data1['intrusion_to_time']) :
            data["intrusion_from_time"]=data1['intrusion_from_time']
            data['intrusion_to_time']=data1['intrusion_to_time']
    try:
        data["intrusion_breach_coordinates"]
    except:
        if "Intrusion" not in data['alert_array']:
            data['intrusion_breach_coordinates'] = {}  
        
        elif data1.get("intrusion_breach_coordinates") is not None and bool(data1['intrusion_breach_coordinates']) :
            data['intrusion_breach_coordinates']=data1['intrusion_breach_coordinates']

    try:
        data["crawling_breach_coordinates"]
    except:
        if "Crawling" not in data['alert_array']:
            data['crawling_breach_coordinates'] = {}  
        
        elif data1.get("crawling_breach_coordinates") is not None and bool(data1['crawling_breach_coordinates']) :
            data['crawling_breach_coordinates']=data1['crawling_breach_coordinates']
            
    try:
        data["wall_jump_from_time"]
        data["wall_jump_to_time"]
    except:
        # logger.error("Exception occurred at **** event_app / modify_service_function **** \n", exc_info=True)
        if "Wall Jump" not in data['alert_array']:
            data["wall_jump_from_time"]=''
            data['wall_jump_to_time']=''
        elif data1.get('wall_jump_from_time') and data1.get('wall_jump_to_time') is not None and bool(data1['wall_jump_from_time']) and bool(data1['wall_jump_to_time']) :
            data["wall_jump_from_time"]=data1['wall_jump_from_time']
            data['wall_jump_to_time']=data1['wall_jump_to_time']
    try:
        data["wall_jump_breach_coordinates"]
    except:
        if "Wall Jump" not in data['alert_array']:
            data['wall_jump_breach_coordinates'] = {}
        elif data1.get("wall_jump_breach_coordinates") is not None and bool(data1['wall_jump_breach_coordinates']) :
            data['wall_jump_breach_coordinates']= data1['wall_jump_breach_coordinates']

    try:
        data["unattended_station_from_time"]
        data["unattended_station_to_time"]
    except:
        if "Unattended Station" not in data['alert_array']:
            data["unattended_station_from_time"]=''
            data['unattended_station_to_time']=''
        elif data1.get('unattended_station_from_time') and data1.get('unattended_station_to_time') is not None and bool(data1['unattended_station_from_time']) and bool(data1['unattended_station_to_time']) :
            data["unattended_station_from_time"]=data1['unattended_station_from_time']
            data['unattended_station_to_time']=data1['unattended_station_to_time']

    try:
        data["unattended_station_breach_coordinates"]
    except:
        if "Unattended Station" not in data['alert_array']:
            data['unattended_station_breach_coordinates'] = {}
        elif data1.get("unattended_station_breach_coordinates") is not None and bool(data1['unattended_station_breach_coordinates']) :
            data['unattended_station_breach_coordinates']= data1['unattended_station_breach_coordinates']

    try:
        data["unauthorised_entry_from_time"]
        data["unauthorised_entry_to_time"]
    except:
        if "Unauthorised Entry" not in data['alert_array']:
            data["unauthorised_entry_from_time"]=''
            data['unauthorised_entry_to_time']=''
        elif data1.get('unauthorised_entry_from_time') and data1.get('unauthorised_entry_to_time') is not None and bool(data1['unauthorised_entry_from_time']) and bool(data1['unauthorised_entry_to_time']) :
            data["unauthorised_entry_from_time"]=data1['unauthorised_entry_from_time']
            data['unauthorised_entry_to_time']=data1['unauthorised_entry_to_time']

    try:
        data["unauthorised_entry_breach_coordinates"]
    except:
        if "Unauthorised Entry" not in data['alert_array']:
            data['unauthorised_entry_breach_coordinates'] = {}
        elif data1.get("unauthorised_entry_breach_coordinates") is not None and bool(data1['unauthorised_entry_breach_coordinates']) :
            data['unauthorised_entry_breach_coordinates']= data1['unauthorised_entry_breach_coordinates']

    # Drone Intrusion Breach
    try:
        data["drone_breach_coordinates"]
    except:
        if "Drone" not in data['alert_array']:
            data['drone_breach_coordinates'] = {}
        elif data1.get("drone_breach_coordinates") is not None and bool(data1['drone_breach_coordinates']) :
            data['drone_breach_coordinates']= data1['drone_breach_coordinates']

    ##Crowd

    try:
        data["crowd_breach_coordinates"]
    except:
        if "Crowd" not in data['alert_array']:
            data['crowd_breach_coordinates'] = {}
        elif data1.get("crowd_breach_coordinates") is not None and bool(data1['crowd_breach_coordinates']) :
            data['crowd_breach_coordinates']= data1['crowd_breach_coordinates']
    
    try:
        if 'Authorised Vehicle' in data['alert_array']:
            if 'authorised_vehicle_breach_coordinates' in data:
                for key, value in data['authorised_vehicle_breach_coordinates'].items():
                    if len(eval(value)) == 4:
                        data['authorised_vehicle_breach_coordinates'] = {key:value}
                    elif len(eval(value)) == 2:
                        data['dist_ref_coordinates'] = eval(value)
            elif 'authorised_vehicle_breach_coordinates' in data1:
                data['authorised_vehicle_breach_coordinates'] = data1['authorised_vehicle_breach_coordinates']
            else:
                data['authorised_vehicle_breach_coordinates'] = {}
        else:
            data['authorised_vehicle_breach_coordinates'] = {}
            #data['VOIDistance'] = {}
            #data['speed_limit'] ={}
    
    except:
        logger.error("Exception occurred at **** event_app / modify_service_function **** \n", exc_info=True)
        pass
        
    for key in ['dist_ref_coordinates', 'VOIDistance', 'speed_limit']:
        if key not in data and key in data1:
            data[key] = data1[key]
        elif key not in data:
            data[key] = None

    # data['authorised_vehicle_breach_coordinates'] = {}
    # data['dist_ref_coordinates'] = {}
    # data['VOIDistance'] = {}
    # data['speed_limit'] ={}

    try:
        data["loitering_duration"]
    except:
        try:
            data["loitering_duration"] = data1["loitering_duration"]
        except:
            data["loitering_duration"] = ""

    try:
        data["unattended_station_duration"]
    except:
        try:
            data["unattended_station_duration"] = data1["unattended_station_duration"]
        except:
            data["unattended_station_duration"] = ""

    try:
        data["overcrowd_person_count"]
    except:
        try:
            data["overcrowd_person_count"] = data1["overcrowd_person_count"]
        except:
            data["overcrowd_person_count"] = ""


    cam_info_dict=modify_cam_dict(cam_name,data1['pincode'],data1['cam_input_url'],data['alert_array'],data['intrusion_breach_coordinates'],data['loitering_breach_coordinates'],
                                 data['authorised_vehicle_breach_coordinates'],data['stevedore_breach_coordinates'],data['intrusion_from_time'],data['intrusion_to_time'], data['dist_ref_coordinates'], data['VOIDistance'], data['speed_limit'], data['drone_breach_coordinates'],
                                 data['crowd_breach_coordinates'], data['unattended_station_breach_coordinates'],data["unattended_station_from_time"],data["unattended_station_to_time"],data["wall_jump_breach_coordinates"],data["wall_jump_from_time"],data["wall_jump_to_time"], data['crawling_breach_coordinates'], data["loitering_duration"], data["unattended_station_duration"], data["overcrowd_person_count"])
    
    
    json_query={'data':cam_info_dict,'db_name':db_name,'collection_table_name': camera_collection,'condition':"cam_name='%s'" % cam_name}
    resp=requests.post('{}/update_data'.format(dal_url),json=json_query)
    
    for service_name in ['ravennonpoi', 'ravenhomeland', 'ravenvoi', 'ravenpoi', 'ravenstevedore']:
        try:
            service_name = service_name+'-'+str(cam_info_dict['cam_name']) 
            k8s_apps_v1.delete_namespaced_deployment(service_name.lower(),'default')
        except:
            logger.error("Exception occurred at **** event_app / modify_service_function **** \n", exc_info=True)
            pass
    # try:     
    #     service_name = 'livestream-'+str(cam_info_dict['cam_name']) 
    #     k8s_apps_ser.delete_namespaced_service(service_name.lower(),'default')
    # except:
    #     pass
    #time.sleep(10)
    if set(cam_info_dict['alert_array']) & set(homeland_events) :
        homeland_detection_flag = 1
    else:
        homeland_detection_flag = 0

    if len(cam_info_dict['alert_array']) >= 1:
        try:
            # service_name = str(cam_info_dict['cam_name']) + '-livestream'
            # re1 = launch_service(service_name=service_name, data=cam_info_dict, ffmpeg_image_flag=True,random_port=random_port)
        
            try:
                if cam_info_dict['authorised_vehicle_detection_flag'] == 1:
                    service_name = str(cam_info_dict['cam_name']) + '-voi'
                    re2 = launch_service(service_name=service_name, data=cam_info_dict, ffmpeg_image_flag=False)
            except:
                logger.error("Exception occurred at **** event_app / modify_service_function **** \n", exc_info=True)
                pass
            try:
                if cam_info_dict['authorised_entry_detection_flag'] == 1 or cam_info_dict['unauthorised_entry_detection_flag'] == 1:
                    service_name = str(cam_info_dict['cam_name']) + '-poi'
                    re2 = launch_service(service_name=service_name, data=cam_info_dict, ffmpeg_image_flag=False)
            except:
                logger.error("Exception occurred at **** event_app / modify_service_function **** \n", exc_info=True)
                pass
            # try:
            #     if cam_info_dict['unauthorised_entry_detection_flag'] == 1:
            #         service_name = str(cam_info_dict['cam_name']) + '-nonpoi'
            #         re2 = launch_service(service_name=service_name, data=cam_info_dict, ffmpeg_image_flag=False)
            # except:
            #     logger.error("Exception occurred at **** event_app / modify_service_function **** \n", exc_info=True)
            #     pass
            try:
                if cam_info_dict['drone_detection_flag'] == 1:
                    service_name = str(cam_info_dict['cam_name']) + '-ravendrone'
                    re2 = launch_service(service_name=service_name, data=cam_info_dict, ffmpeg_image_flag=False)
            except:
                logger.error("Exception occurred at **** event_app / modify_service_function **** \n", exc_info=True)
                pass
            
            # if len(cam_info_dict['alert_detection_arr']) != 0:
            #     service_name = str(cam_info_dict['cam_name']) + '-ap'
            #     re2 = launch_service(service_name=service_name, data=cam_info_dict, ffmpeg_image_flag=False)

                #if homeland_detection_flag == 1:
            service_name = str(cam_info_dict['cam_name']) + '-homeland'
            re2 = launch_service(service_name=service_name, data=cam_info_dict, ffmpeg_image_flag=False)
 

            service_name = str(cam_info_dict['cam_name']) + '-ravenbackend'
            re2 = launch_service(service_name=service_name, data=cam_info_dict, ffmpeg_image_flag=False)
        except:
            logger.error("Exception occurred at **** event_app / modify_service_function **** \n", exc_info=True)
            return jsonify({'status': 'failed', 'error': 'raven pod not launched'})
    return jsonify({'status': 'success', 'alert_array': data['alert_array']})


@app.route("/stop_process/<account_id>/<user_name>", methods=['POST'])
@check_for_token
def stop_process(account_id, user_name):
    data = request.json
    cam_name_list = data['cam_name_list']
    for cam_name in cam_name_list:
        try:
            # cam_info_dict = list(db_cam.find({'cam_name': cam_name}))[0]
            json_query={'db_name':db_name,'collection_table_name': camera_collection,'condition':"cam_name='%s'"%cam_name}
            cam_details=requests.post('{}/list_data'.format(dal_url),json=json_query)
            cam_info_dict = cam_details.json()['result'][0]
            dep_cam_name=check_special_characters(cam_info_dict['cam_name'])
            try:     
                service_name = 'livestream-'+str(dep_cam_name) 
                k8s_apps_v1.delete_namespaced_deployment(service_name.lower(),'default')
            except:
                logger.error("Exception occurred at **** event_app / stop_process_function **** \n", exc_info=True)
                pass

            try:     
                service_name = 'livestream-'+str(dep_cam_name) 
                k8s_apps_ser.delete_namespaced_service(service_name.lower(),'default')
            except:
                logger.error("Exception occurred at **** event_app / stop_process_function **** \n", exc_info=True)
                pass


            # try:
            #     service_name = 'ravenbackend-'+str(cam_info_dict['cam_name']) 
            #     k8s_apps_v1.delete_namespaced_deployment(service_name.lower(),'default')
            # except:
            #     logger.error("Exception occurred at **** event_app / stop_process_function **** \n", exc_info=True)
            #     pass

            try:
                service_name = 'ravendrone-'+str(dep_cam_name) 
                k8s_apps_v1.delete_namespaced_deployment(service_name.lower(),'default')
            except:
                pass

            try:
                service_name = 'ravenhomeland-'+str(dep_cam_name) 
                k8s_apps_v1.delete_namespaced_deployment(service_name.lower(),'default')
            except:
                logger.error("Exception occurred at **** event_app / stop_process_function **** \n", exc_info=True)
                pass

            try:
                service_name = 'ravenvoi-'+str(dep_cam_name)
                k8s_apps_v1.delete_namespaced_deployment(service_name.lower(),'default')
            except:
                logger.error("Exception occurred at **** event_app / stop_process_function **** \n", exc_info=True)
                pass

            try:
                service_name = 'ravenpoi-'+str(dep_cam_name)
                k8s_apps_v1.delete_namespaced_deployment(service_name.lower(),'default')
            except:
                logger.error("Exception occurred at **** event_app / stop_process_function **** \n", exc_info=True)
                pass

            try:
                service_name = 'ravenstevedore-'+str(dep_cam_name)
                k8s_apps_v1.delete_namespaced_deployment(service_name.lower(),'default')
            except:
                logger.error("Exception occurred at **** event_app / stop_process_function **** \n", exc_info=True)
                pass
            
            try:
                service_name = 'ravennonpoi-'+str(dep_cam_name)
                k8s_apps_v1.delete_namespaced_deployment(service_name.lower(),'default')
            except:
                logger.error("Exception occurred at **** event_app / stop_process_function **** \n", exc_info=True)
                pass
        except:
            logger.error("Exception occurred at **** event_app / stop_process_function **** \n", exc_info=True)
            return jsonify({'status': 'failed', 'error': 'Failed to delete services'})
#        print('*******************************************************')

        # cam_details = list(db_cam.find({'cam_name': cam_name}))[0]
        json_query={'db_name':db_name,'collection_table_name': camera_collection,'condition':"cam_name='%s'"%cam_name}
        cam_details=requests.post('{}/list_data'.format(dal_url),json=json_query)
        cam_details = cam_details.json()['result'][0]
        state = cam_details['state']
        city = cam_details['city']
        location = cam_details['location']
        # stand_type = cam_details['stand_type']
        #area = cam_details['area']
        alert_id = str(uuid.uuid4())
#        alert = 'Stand Monitoring Disabled'
#        alert_dict = generate_alert_dict(city, location, area, cam_name, alert_id, alert)
        alert_1 = 'Monitoring Disabled'                                                                                                 
        thumbnail = ''                                                                                                                
        alert_url = ''                                                                                                                
        start_frame = 0                                                                                                               
        frame =None                                                                                                                       
        #alert_dict = generate_alert_dict(city, location, area, cam_name, alert_id, alert)                                                 
        alert_dict = generate_alert_dict(frame, state,city, location,
                                                         cam_name, alert_id, alert_url, start_frame,                                      
                                                         thumbnail, alert_status='running', alert_1=alert_1,                          
                                                         alert_2='')   
        json_query={'db_name':db_name,'collection_table_name': alert_collection}
        resp=requests.post('{}/insert_data'.format(dal_url),json=json_query)
        
        json_query_={'db_name':db_name,'collection_table_name': camera_collection,'condition':"cam_name='%s'"%cam_name}
        cam_details=requests.post('{}/remove_data'.format(dal_url),json=json_query_)
            

    return jsonify({'status': 'success'})

@app.route("/search_vehicle_details/<account_id>/<user_name>", methods=['POST'])
@check_for_token
def search_vehicle_details(account_id, user_name):
    try:
        data = request.json
        # condition_dict = {}
        # for key in data.keys():
        #     if len(data[key])!=0:
        #         condition_dict[key] = data[key]
        if not bool(data['cam_name']):
            aggPipe = [{"$match": {"$or":[{"color": {"$in": [x.lower() for x in data['color']]}},{"type": {"$in":[x.lower() for x in data['type']]}},
                       {"vehicle_number": data['vehicle_number']}]}},
                       {"$addFields":{ "fullyeardate": 
                                                            {"$concat":[
                                                {"$arrayElemAt": [{"$split":["$date","/"]},0]},"/",
                                                {"$arrayElemAt": [{"$split":["$date","/"]},1]},"/",
                                                "20",{"$arrayElemAt": [{"$split":["$date","/"]},2]}]
                                            }}},
                        {"$addFields": {"dateObj": {"$dateFromString": {"dateString": "$fullyeardate","format": "%%d/%%m/%%Y %%H:%%M:%%S"}}}},
                        {"$sort": {"dateObj": -1}},
                        {"$project": {"_id": 0}},
                        {"$group": {"_id": "$cam_name","count": {"$sum": 1},"cam_name": {"$push": "$$ROOT"}}},
                        {"$project": {"count":1,
                         "cam_name": {"$slice": ["$cam_name",data["start"],data["length"]]}}}
                       ]
            #aggPipe=[{"$match":{"color":{"$in":data["color"]},"type":{"$in":data["type"]},"vehicle_number":data["vehicle_number"]}},{"$group": {"_id": "$cam_name", "cam_name": {"$push": "$$ROOT"}}},{"$project": {"_id":0, "cam_name": '$_id',"mostRecentTitle": {"$slice": ["$cam_name", 0, 1]}}}]
        else:
            aggPipe=[{"$match":{"cam_name":data["cam_name"]}},{"$match":{"$or":[{"color":{"$in":[x.lower() for x in data['color']]}},{"type":{"$in":[x.lower() for x in data['type']]}},{"vehicle_number":data["vehicle_number"]}]}},
                    {"$addFields":{ "fullyeardate": 
                                    {"$concat":[
                                            {"$arrayElemAt": [{"$split":["$date","/"]},0]},"/",
                                            {"$arrayElemAt": [{"$split":["$date","/"]},1]},"/",
                                            "20",{"$arrayElemAt": [{"$split":["$date","/"]},2]}]
                                        }}},
                    {"$addFields": {"dateObj": {"$dateFromString": {"dateString": "$fullyeardate","format": "%%d/%%m/%%Y %%H:%%M:%%S"}}}},
                    {"$sort": {"dateObj": -1}},
                    {"$project":{"_id":0}},{"$group": {"_id": "$cam_name","count": {"$sum": 1},"cam_name": {"$push": "$$ROOT"}}}, {"$project": {"count":1,
                        "cam_name": {"$slice": ["$cam_name",data["start"],data["length"]]}}}]

        
        cond = "db['%s'].aggregate({}, allowDiskUse=True)".format(aggPipe)
        json_query_search = { "db_name": db_name, "collection_table_name": voi_collection, "condition": cond }
        cam_list = requests.post("{}/custom_query".format(dal_url), json=json_query_search).json()["result"]
        

        # condition = ""
        # for key in condition_dict.keys():
        #     if key != 'vehicle_number':
        #         cond = "%s in %s and " % (key,[x.lower() for x in condition_dict[key]])
        #     else:
        #         cond = "%s = regex('%s') and " % (key,condition_dict[key])
        #     condition+=cond
        
        # condition = condition[:-5]
        
        # if len(condition) > 4:
        #     json_query = {'db_name': db_name, 'collection_table_name': voi_collection,
        #                 'condition': condition}
        #     voi_details = requests.post('{}/list_data'.format(dal_url), json=json_query)
        #     voi_info_dict = voi_details.json()['result']

            # unique_cams = []
            # for cams in voi_info_dict:
            #     unique_cams.append([cams['cam_name'], cams['location'], cams['city'], cams['state']])
            # unique_cams = [list(x) for x in set(tuple(x) for x in unique_cams)]

        #cam_details=[{"cam_name":i["cam_name"],"location":i["location"],"city":i["city"],"state":i["state"]} for i in [x["cam_name"] for x in cam_list][0]]   
        #unique_cams=list(set([i["_id"] for i in cam_list]))
        unique_cams=[{x["_id"]:x["cam_name"],"cam_name":x["_id"],"count":x["count"]} for x in cam_list]

        final_resp=[]
        for i in unique_cams:
            images=[]
            for j in i[i["cam_name"]]:
                images.append({'image_url':j['thumbnail_url'], 
                                'vehicle_type':j['type'],
                                'vehicle_color':j['color'], 
                                'vehicle_number':j['vehicle_number'],
                                'date':j['date']})
            final_resp.append({"cam_name":i["cam_name"],"count":i["count"],"location":i[i["cam_name"]][0]["location"],"city":i[i["cam_name"]][0]["city"],"state":i[i["cam_name"]][0]["state"],"all_images":images})                

            
        return jsonify({"status":"success","data":final_resp})
    except:
        logger.error("Exception occurred at **** event_app / search_vehicle_details **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'Failed to search vehicle details'})    

    
@app.route("/get_img_n_coord/<account_id>/<user_name>/<cam_name>", methods=['GET'])
@check_for_token
def get_img_n_coord(account_id, user_name,cam_name):
    try:
        dir_path = f"{volume_target}/img_with_coord/{cam_name}"
        if not os.path.exists(dir_path):
            os.makedirs(dir_path)
        serv_imgpath = {}
        json_query = {'db_name': db_name, 'collection_table_name': camera_collection,
                                        'condition': "cam_name='%s'" % (cam_name)}
        resp = requests.post('{}/list_data'.format(dal_url), json=json_query)
        cam_data = resp.json()['result'][0]
        coor_dim = [640,384]
        img_size = [352,288]
        
        need_coord = {'crawling_breach_coordinates':'Crawling','crowd_breach_coordinates':'Overcrowd','drone_breach_coordinates':'Drone','intrusion_breach_coordinates':'Intrusion','loitering_breach_coordinates':'Loitering','unattended_station_breach_coordinates':'Unattended Station','authorised_vehicle_breach_coordinates':'Authorised Vehicle','wall_jump_breach_coordinates':'Wall Jump'}
        for serv_coord in need_coord.keys():
            if cam_data[serv_coord] != {}:
                try:
                    if not os.path.exists(f"{volume_target}/{cam_data['atm_cam_thumb']}"):
                        cam_url = cam_data['cam_url']
                        cap = cv2.VideoCapture(cam_url)
                        _, frame = cap.read()
                        frame = cv2.resize(frame, (352, 288))
                        cv2.imwrite(f"{volume_target}/{cam_data['atm_cam_thumb']}",frame)
                except:
                    pass
                frame = cv2.imread(f"{volume_target}/{cam_data['atm_cam_thumb']}")
                for coord in cam_data[serv_coord].keys():
                    coord_to_int = list(map(lambda line: [int((line[x]*img_size[x])/coor_dim[x]) for x in range(len(line))],eval(cam_data[serv_coord][coord])))
                    img_mod = cv2.polylines(frame, [np.array([coord_to_int],np.int32)], True, (0,120,255),2)
                cv2.imwrite(f"{dir_path}/{serv_coord}.jpg",img_mod)
                serv_imgpath[need_coord[serv_coord]] = f"img_with_coord/{cam_name}/{serv_coord}.jpg"
        return jsonify({"status":"success","data":serv_imgpath})
    except:
        logger.error("Exception occurred at **** event_app / get_img_n_coord **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'Perimeter service not added'})  


@app.route("/get_vehicle_colors_types/<account_id>/<user_name>", methods=['GET'])
@check_for_token
def get_vehicle_colors_types(account_id, user_name):
    try:
        # json_query={'db_name':db_name,'collection_table_name': voi_collection,'condition':None}
        # users=requests.post('{}/list_data'.format(dal_url),json=json_query)
        # users = users.json()['result']
        # colors = []
        # types = []
        # for user in users:
        #     colors.append(user['color'])
        #     types.append(user['type'])
        # colors = list(np.unique(colors))
        # types = list(np.unique(types))

        types = ['Car','TwoWheeler','Tractor','Truck','Bus','Auto']
        colors = ['Black','White','Red','Blue','Silver','Maroon','Green']


    #    types = ['Car','Bike','Tractor','Truck','Bus','Rickshaw']
    #    colors = ['Black','White','Red','Lime','Blue','Yellow','Cyan','Magenta','Silver','Gray','Maroon','Olive','Green','Purple','Teal','Navy']

        #users = {'colors':colors, 'types': types}
        return jsonify({'status':'success','colors': eval(JSONEncoder().encode(colors)),'types':eval(JSONEncoder().encode(types))})
    except:
        logger.error("Exception occurred at **** event_app / get_vehicle_colors_types **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'Failed to get vehicle colors and types'})    

# @app.route("/get_citywise_alert_count/<account_id>/<user_name>", methods=['GET'])
# @check_for_token
# def get_citywise_alert_count(account_id,user_name):
#     citywise_alert_dict = {}
#     unique_cities = pd.DataFrame(list(db_cam.find()))['city'].unique().tolist()
#     for city in unique_cities:
#         citywise_alert_dict[city]={}
#         for alert in alert_array:
#             alert_count = db_alert.find({'city':city,'alert_1':alert}).count()
#             citywise_alert_dict[city][alert] = alert_count
#     return jsonify({'citywise_alert_counts':eval(JSONEncoder().encode(citywise_alert_dict))})

# @app.route("/get_citylocation_alert_count/<account_id>/<user_name>/<city>", methods=['GET'])
# def get_citylocation_alert_count(account_id,user_name,city):
#     citylocation_alert_dict = {}
#     unique_locations = pd.DataFrame(list(db_cam.find({'city':city})))['location'].unique().tolist()
#     for location in unique_locations:
#         citylocation_alert_dict[location]={}
#         for alert in alert_array:
#             alert_count = db_alert.find({'city':city,'location':location,'alert_1':alert}).count()
#             citylocation_alert_dict[location][alert] = alert_count
#     return jsonify({'citylocation_alert_dict':eval(JSONEncoder().encode(citylocation_alert_dict))})

@app.route("/get_citywise_alert_count/<account_id>/<user_name>", methods=['GET'])
@check_for_token
def get_citywise_alert_count(account_id,user_name):
    try:
        citywise_alert_list = []
        citywise_alert_dict = {}

        json_query={'db_name':db_name,'collection_table_name': camera_collection,'condition':None}
        resp=requests.post('{}/list_data'.format(dal_url),json=json_query)
        # unique_cities = pd.DataFrame(list(db_cam.find()))['city'].unique().tolist()
        resp = resp.json()['result']

        unique_cities = pd.DataFrame(resp)['city'].unique().tolist()

        for city in unique_cities:
            citywise_alert_dict = {}
            citywise_alert_dict['city'] = {}
            citywise_alert_dict['alerts'] = {}
            citywise_alert_dict['city'] = city
            for alert in alert_array:
                json_query={'db_name':db_name,'collection_table_name': alert_collection,'condition':"city='%s' and alert_1='%s' and send_notif_flag='%s'"%(city,alert,'Y')}
                alert_count=requests.post('{}/count_data'.format(dal_url),json=json_query)
                # alert_count = db_alert.find({'city':city,'alert_1':alert}).count()
                alert_count = alert_count.json()['result']
                citywise_alert_dict['alerts'][alert] = alert_count
            citywise_alert_list.append(citywise_alert_dict)
        return jsonify({'status':'success','citywise_alert_counts':eval(JSONEncoder().encode(citywise_alert_list))})
    except:
        logger.error("Exception occurred at **** event_app / get_citywise_alert_count **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to get citywise alert count'})    

@app.route("/get_citylocation_alert_count/<account_id>/<user_name>/<city>", methods=['GET'])
@check_for_token
def get_citylocation_alert_count(account_id,user_name,city):
    try:
        citylocation_alert_list = []
        citylocation_alert_dict = {}

        json_query={'db_name':db_name,'collection_table_name': camera_collection,'condition':"city='%s'"%city}
        resp=requests.post('{}/list_data'.format(dal_url),json=json_query)
        # unique_locations = pd.DataFrame(list(db_cam.find({'city':city})))['location'].unique().tolist()
        resp = resp.json()['result']
        unique_locations = pd.DataFrame(resp)['location'].unique().tolist()
        
        for location in unique_locations:
            citylocation_alert_dict = {}
            citylocation_alert_dict['location'] = {}
            citylocation_alert_dict['alerts'] = {}
            citylocation_alert_dict['location'] = location
            for alert in alert_array:
                json_query={'db_name':db_name,'collection_table_name': alert_collection,'condition':"city='%s' and location='%s' and alert_1='%s' and send_notif_flag='%s'"%(city,location,alert,'Y')}
                alert_count=requests.post('{}/count_data'.format(dal_url),json=json_query)
                # alert_count = db_alert.find({'city':city,'location':location,'alert_1':alert}).count()
                citylocation_alert_dict['alerts'][alert] = alert_count.json()['result']
            citylocation_alert_list.append(citylocation_alert_dict)
        return jsonify({'status':'success','citylocation_alert_dict':eval(JSONEncoder().encode(citylocation_alert_list))})
    except:
        logger.error("Exception occurred at **** event_app / get_citylocation_alert_count **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to get city alert count'})        

@app.route("/get_alerts_by_location/<account_id>/<user_name>/<city>/<location>", methods=['GET'])
@check_for_token
def get_alerts_by_location(account_id,user_name,city,location):
    try:
        json_query={'db_name':db_name,'collection_table_name': alert_collection,'condition':"city='%s' and location='%s' and send_notif_flag='%s'"%(city,location,'Y')}
        locationwise_alerts=requests.post('{}/list_data'.format(dal_url),json=json_query)
        locationwise_alerts = locationwise_alerts.json()['result']
        # locationwise_alerts = list(db_alert.find({'city':city,'location':location}))
        return jsonify({'status':'success','locationwise_alerts':eval(JSONEncoder().encode(locationwise_alerts))})
    except:
        logger.error("Exception occurred at **** event_app / get_alerts_by_location **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to get alerts by location'})    

@app.route("/get_live_cams/<account_id>/<user_name>/<service>", methods=['GET'])
@check_for_token
def get_live_cams(account_id, user_name,service):
    try:
        if service == "POI":
            aggPipe = [ {"$match": {"alert_array":{"$in":["Authorised Entry","Unauthorised Entry"]}}},{"$project":{'_id':0}}]
        elif service == "VOI":
            aggPipe = [ {"$match": {"alert_array":{"$in":["Authorised Vehicle"]}}},{"$project":{'_id':0}}]
        else :
            aggPipe = [ {"$match": {"cam_status":"live"}},{"$project":{'_id':0}}]
        cond = "db['%s'].aggregate({}, allowDiskUse=True)".format(aggPipe)
        json_query_search = { "db_name": db_name, "collection_table_name": camera_collection, "condition": cond }
        cam_list = requests.post("{}/custom_query".format(dal_url), json=json_query_search).json()["result"]
        # all_cam_list = {}
        location_list = []
        res = []
        #[{camera:[cam_dict],name:lacation_name},{}]
        for cam in cam_list:
        
            if cam["location"] not in location_list:
                res.append({"camera":[cam],"name":cam["location"]})
                location_list.append(cam["location"])

            else:
                res[location_list.index(cam["location"])]['camera'].append(cam)

        default_duration = {}
        default_count = {}

        try:
            json_query = {'db_name':db_name,'collection_table_name': param_collection,'condition': None}
            default_params = requests.post('{}/list_data'.format(dal_url),json=json_query).json()['result'][0]

        except:
            # logger.error("Exception occurred at **** event_app / get_live_cams **** \n", exc_info=True)
            default_params = {}
        
        if 'loitering_duration' not in default_params:
            default_params['loitering_duration'] = loiter_start_counter_min // fps
            
        if 'unattended_station_duration' not in default_params:
            default_params['unattended_station_duration'] = present_start_counter_min_ // fps

        if 'overcrowd_person_count' not in default_params:
            default_params['overcrowd_person_count'] = overcrowd_threshold

        for key, value in default_params.items():
            if key == 'loitering_duration':
                default_duration['Loitering'] = value

            if key == 'unattended_station_duration':
                default_duration['Unattended Station'] = value

            if key == 'overcrowd_person_count':
                default_count['Overcrowd'] = value

        return jsonify({'status':'success','live_cams': res,
                        'services':services, 'duration_parameter':default_duration,
                        'count_parameter':default_count})
    except Exception as e:
        logger.error("Exception occurred at **** event_app / get_live_cams **** \n", exc_info=True)
        return jsonify({'status':'failed','error':"failed to get live cams"})     

@app.route("/get_cam_alerts_nop/<account_id>/<user_name>/<cam_name>/<page>", methods=['GET'])
@check_for_token
def get_cam_alerts_nop(account_id,user_name, cam_name,page):
    try:
        page_limit = 100

        json_query={'db_name':db_name,'collection_table_name': alert_collection,'condition':"cam_name='%s'"%cam_name}
        cam_alert_count = requests.post('{}/count_data'.format(dal_url),json=json_query).json()["result"]

        aggPipe = [ {"$match": {"cam_name": cam_name}}, 
            { "$sort" : { "_id" : -1 } },
            { "$skip": (int(page))*page_limit},
            { "$limit" :page_limit},
            {"$project":{'_id':0}}]
        cond = "db['%s'].aggregate({}, allowDiskUse=True)".format(aggPipe)
        json_query_search = { "db_name": db_name, "collection_table_name": alert_collection, "condition": cond }
        cam_list = requests.post("{}/custom_query".format(dal_url), json=json_query_search).json()["result"]
        # limit = (int(page)+1)*page_limit
        # if limit > len(cam_alerts):
        #     limit = len(cam_alerts)

        return jsonify({'status':'success','cam_alerts': cam_list,'total_alerts_count':cam_alert_count})
    except Exception as e:
        logger.error("Exception occurred at **** event_app / get_live_camsget_cam_alerts_nop **** \n", exc_info=True)
        return jsonify({'status':'failed', 'error': "failed to load get_cam_alerts_"})

@app.route("/show_default_counters/<account_id>/<user_name>", methods=['GET'])
@check_for_token
def show_default_counters(account_id, user_name):
    try:
        try:
            json_query = {'db_name':db_name,'collection_table_name': param_collection,'condition': None}
            default_params = requests.post('{}/list_data'.format(dal_url),json=json_query).json()['result'][0]
        except:
            # logger.error("Exception occurred at **** event_app / show_default_counters **** \n", exc_info=True)
            default_params = {}

        if 'loitering_duration' not in default_params:
            default_params['loitering_duration'] = loiter_start_counter_min // fps
            
        if 'unattended_station_duration' not in default_params:
            default_params['unattended_station_duration'] = present_start_counter_min_ // fps

        if 'overcrowd_person_count' not in default_params:
            default_params['overcrowd_person_count'] = overcrowd_threshold

        return jsonify({'status': 'success', 'default_params': default_params})
        
    except:
        logger.error("Exception occurred at **** event_app / show_default_counters **** \n", exc_info=True)
        return jsonify({'status': 'failed', 'error': "failed to show default counters"})

@app.route("/update_default_counters/<account_id>/<user_name>", methods=['POST'])
@check_for_token
def update_default_counters(account_id, user_name):
    try:
        data = request.json
        data = data['default_params']

        try:
            json_query = {'db_name':db_name,'collection_table_name': param_collection,'condition': None}
            default_params = requests.post('{}/list_data'.format(dal_url),json=json_query).json()['result'][0]
        except:
            default_params = {}

        if default_params:
            json_query = {'data':data, 'db_name':db_name, 'collection_table_name': param_collection,'condition': "loitering_duration='%s'"%default_params['loitering_duration']}
            resp = requests.post('{}/update_data'.format(dal_url),json=json_query)

            if resp.json()['status']:
                return jsonify({'status': 'success'})
            else:
                return jsonify({'status': 'failed', 'error': "failed to update default counters"})

        else:
            json_query = {'data':data, 'db_name':db_name, 'collection_table_name': param_collection}
            resp = requests.post('{}/insert_data'.format(dal_url),json=json_query)
            
            if resp.json()['status']:
                return jsonify({'status': 'success'})
            else:
                return jsonify({'status': 'failed', 'error': "failed to update default counters"})

    except:
        logger.error("Exception occurred at **** event_app / update_default_counters **** \n", exc_info=True)
        return jsonify({'status': 'failed', 'error': "failed to update default counters"})


@app.route("/get_cam_alerts/<account_id>/<user_name>/<cam_name>", methods=['GET'])
@check_for_token
def get_cam_alerts(account_id,user_name, cam_name):
    '''
    response:
    -200
        description: if success return a priority wise alert list ,default priority list and status(livestream pod up and running) and 
                     if fails return status(fail) with a error msg 'livestream pod not launched'
    -403  
        description: return an JWT token authentication error with msg "WWW-Authenticate':'Basic realm:"login error""
    '''
    # aggPipe = [
    #     {"$match": {"cam_name": cam_name}},
    #     {"$sort": {"date": -1}},
    #     {"$limit": 100},
    #     {"$group": {"_id": "$priority", "priority": {"$push": "$$ROOT"}}}]
    json_query={'db_name':db_name,'collection_table_name': user_collection,'condition':"username='%s'"%user_name}
    usr_data=requests.post('{}/list_data'.format(dal_url),json=json_query).json()['result'][0]
    #if usr_data["staff_status"] == "cust_server":
    # aggPipe = [
    #     {"$match": {"$or":[{"cam_name": cam_name,"verified":"true",
    #     "alert_category":{"$nin":["NONPOI","POI","VOI"]}},
    #     {"cam_name": cam_name,"alert_category":{"$in":["NONPOI","POI","VOI"]}}]}},
    #     {"$addFields":{ "fullyeardate": 
    #                 {"$concat":[
    #                         {"$arrayElemAt": [{"$split":["$date","/"]},0]},"/",
    #                         {"$arrayElemAt": [{"$split":["$date","/"]},1]},"/",
    #                         "20",{"$arrayElemAt": [{"$split":["$date","/"]},2]}]
    #                     }}},
    #     {"$addFields": {"dateObj": {"$dateFromString": {"dateString": "$fullyeardate","format": "%%d/%%m/%%Y %%H:%%M:%%S"}}}},
    #     {"$sort": {"dateObj": -1}},
    #     {"$project": {"_id": 0}},
    #     {"$limit": 100},
    #     {"$group": {"_id": "$priority", "priority": {"$push": "$$ROOT"}}}]
    # else:

    #     if usr_data["staff_status"] in ["administrator","support","security"]:
    #         aggPipe = [
    #         {"$match": {"cam_name": cam_name, "verified":{"$ne": "false"}}},
    #         {"$addFields":{ "fullyeardate": 
    #                     {"$concat":[
    #                             {"$arrayElemAt": [{"$split":["$date","/"]},0]},"/",
    #                             {"$arrayElemAt": [{"$split":["$date","/"]},1]},"/",
    #                             "20",{"$arrayElemAt": [{"$split":["$date","/"]},2]}]
    #                         }}},
    #         {"$addFields": {"dateObj": {"$dateFromString": {"dateString": "$fullyeardate","format": "%%d/%%m/%%Y %%H:%%M:%%S"}}}},
    #         {"$sort": {"dateObj": -1}},
    #         {"$project": {"_id": 0}},
    #         {"$limit": 100},
    #         {"$group": {"_id": "$priority", "priority": {"$push": "$$ROOT"}}}]

    #     else:
    aggPipe = [
        {"$match": {"cam_name": cam_name}},
        {"$addFields":{ "fullyeardate": 
                    {"$concat":[
                            {"$arrayElemAt": [{"$split":["$date","/"]},0]},"/",
                            {"$arrayElemAt": [{"$split":["$date","/"]},1]},"/",
                            "20",{"$arrayElemAt": [{"$split":["$date","/"]},2]}]
                        }}},
        {"$addFields": {"dateObj": {"$dateFromString": {"dateString": "$fullyeardate","format": "%%d/%%m/%%Y %%H:%%M:%%S"}}}},
        {"$sort": {"dateObj": -1}},
        {"$project": {"_id": 0}},
        {"$limit": 100},
        {"$group": {"_id": "$priority", "priority": {"$push": "$$ROOT"}}}]
    # json_query={'db_name':db_name,'collection_table_name': alert_collection,'condition':"cam_name='{0}' and groupby='priority' and push_data='$$ROOT'".format(cam_name)}
    # cam_alerts=requests.post('{}/list_data'.format(dal_url),json=json_query)
    cond = "db['%s'].aggregate({}, allowDiskUse=True)".format(aggPipe)
    json_query={'db_name':db_name,'collection_table_name': alert_collection,'condition':cond}
    with requests.post('{}/custom_query'.format(dal_url),json=json_query)  as resp:
        cam_alerts_dict = resp.json()['result']
    priority_alert_list, priority_names = [], []
    for i in range(len(cam_alerts_dict)):
        d=list(cam_alerts_dict[i].values())
        priority_alert_list.append({'name': d[0], 'Alerts':d[1]})
        priority_names.append(d[0])
    uncommon_elements = set(default_priority_list) ^ set(priority_names)
    priority_alert_list.extend([{'name':i, 'Alerts':[]} for i in uncommon_elements])
    # for i in range(len(priority_names)):
    #     priority_alert_list[i]['Alerts'].sort(key=lambda k : k['date']) 
    
    # pods=k8s_apps_ser.list_namespaced_pod(namespace="default",label_selector="app=livestream-"+str(cam_name))
    # is_pod_present_flag=0
    # for pod in pods.items:
    #     if 'livestream-'+str(cam_name) in pod.metadata.name:    #or  pod.status.phase=='Running':
    #         is_pod_present_flag=1

    # if not is_pod_present_flag:
    #     try:
    #         json_query={'db_name':db_name,'collection_table_name': camera_collection,'condition':"cam_status='live' and cam_name='%s'"%(cam_name)}
    #         cam_info=requests.post('{}/list_data'.format(dal_url),json=json_query)
    #         cam_info_dict=cam_info.json()["result"][0]
    #         while True:
    #             random_port = np.random.randint(30000,32767)
    #             result = is_port_in_use(random_port)
    #             if result == False:
    #                 break   
    #         cam_info_dict['cam_output_url'] = f'ws://{domain_name.split(":")[0]}:{random_port}'
    #         json_query={'data':cam_info_dict,'db_name':db_name,'collection_table_name': camera_collection,'condition':"cam_name='%s'"%(cam_name)}
    #         resp=requests.post('{}/update_data'.format(dal_url),json=json_query)
    #         service_name = str(cam_info_dict['cam_name']) + '-livestream'
    #         re1 = launch_service(service_name=service_name, data=cam_info_dict, ffmpeg_image_flag=True,random_port=random_port)
    #     except:
    #         logger.error("Exception occurred at **** event_app / get_cam_alerts_function **** \n", exc_info=True)
    #         return jsonify({'status': 'fail', 'error': 'livestream pod not launched'})    
    
    return jsonify({'status':'success','cam_alerts': priority_alert_list, "priorities": default_priority_list})

@app.route("/add_user/<account_id>/<user_name>", methods=['POST'])
@check_for_token
def add_user(account_id, user_name):
    try:
        data = request.json
        user_dict = dict()
        user_dict['username'] = str(data['username'])
        # user_dict['password'] = str(data['password'])
        user_dict['cajun'], user_dict['passhash'] = generate_cajun(str(data['password']))
        user_dict['name'] = data['name']
        user_dict['employee_id'] = str(time.time()).replace('.','_')
        user_dict['contact'] = str(data['contact'])
        user_dict['account_name'] = account_id
        user_dict['staff_status'] = str(data['staff_status'])

        json_query={'db_name':db_name,'collection_table_name': user_collection,'condition':"username='%s' or employee_id='%s'"%(user_dict['username'], user_dict['employee_id'])}
        
        try:
            user_data=requests.post('{}/list_data'.format(dal_url),json=json_query)
            user_data=user_data.json()['result'][0]
            return jsonify({'status': 'failed','error': 'user exists'})
        except:
            logger.error("Exception occurred at **** event_app / add_user_function **** \n", exc_info=True)
            pass

        json_query = {'data':user_dict,'db_name':db_name,'collection_table_name': user_collection}
        resp = requests.post('{}/insert_data'.format(dal_url),json=json_query)
    except:
        logger.error("Exception occurred at **** event_app / add_user_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':"Failed to add user"})
    
    return jsonify({'status': 'success'})

@app.route('/update_alert_read_flag/<account_id>/<user_name>/<alert_id>', methods=['POST'])
@check_for_token
def update_alert_read_flag(account_id, user_name, alert_id):
    try:
        '''
        For changing read_flag in alert dict.
        '''
        json_query = {'data':{'read_flag' : 'Y'},'db_name':db_name,'collection_table_name': alert_collection,'condition':"alert_id='%s'"%(alert_id)}
        resp = requests.post('{}/update_data'.format(dal_url),json=json_query).json()
        if resp['status']:
            return jsonify({'status':'success'})
    except:
        logger.error("Exception occurred at **** event_app / update_alert_read_flag **** \n", exc_info=True)
        return jsonify({'status':'failed','error':'Failed to Update Data'})

@app.route("/reset_password/<account_id>/<user_name>", methods=['POST'])
@check_for_token
def reset_password(account_id,user_name):
    data = request.json

    try:
        json_query={'db_name':db_name,'collection_table_name': user_collection,'condition':"username='%s'"%user_name}
        usr_data=requests.post('{}/list_data'.format(dal_url),json=json_query).json()['result'][0]
    except:
        logger.error("Exception occurred at **** event_app / reset_password_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':"username not found"})
    
    if data['new_password']!= data['confirm_password']:
        return jsonify({'status': 'failed','error': 'password does not match'})

    if 'cajun' in usr_data and 'passhash' in usr_data:
        if not check_passhash(data['old_password'], usr_data['cajun'], usr_data['passhash']):
            return jsonify({'status': 'old password is incorrect'})
        else:
            _data = {}
            _data['cajun'], _data['passhash'] = generate_cajun(data['new_password'])
            json_query = {'data': _data, 'db_name': db_name, 'collection_table_name': user_collection,'condition': "username='%s'" % (user_name)}
            resp = requests.post('{}/update_data'.format(dal_url), json=json_query)

    elif usr_data['password']==data['old_password']:
        _data = {}
        _data['cajun'], _data['passhash'] = generate_cajun(data['new_password'])
        json_query={'data':_data,'db_name':db_name,'collection_table_name': user_collection,'condition':"username='%s'"%(user_name)}
        resp=requests.post('{}/update_data'.format(dal_url),json=json_query)

    else:
        return jsonify({'status': 'failed','error': 'old password is incorrect'})

    return jsonify({'status': 'success'})


@app.route("/get_users/<account_id>/<user_name>", methods=['GET'])
@check_for_token
def get_users(account_id,user_name):
    try:
        try:
            json_query = {'db_name':db_name, 'collection_table_name':user_collection, 'condition':"username='%s'"%user_name}
            usr_data = requests.post('{}/list_data'.format(dal_url),json=json_query).json()['result'][0]
        except:
            logger.error("Exception occurred at **** event_app / reset_password_function **** \n", exc_info=True)
            return jsonify({'status': 'failed','error':"username not found"})

        json_query={'db_name':db_name,'collection_table_name': user_collection,'condition':None}
        users=requests.post('{}/list_data'.format(dal_url),json=json_query)
        users = users.json()['result']

        if usr_data['staff_status'] == 'administrator':
            for i in users:
                if i['staff_status'] == 'super_administrator':
                    users.remove(i)

        return jsonify({'status':'success','users': eval(JSONEncoder().encode(users))})
    except:
        logger.error("Exception occurred at **** event_app / get_users_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to get User details'})    

@app.route("/get_user_details/<account_id>/<user_name>/<unique_id>", methods=['GET'])
@check_for_token
def get_user_details(account_id,user_name,unique_id):
    try:
        json_query={'db_name':db_name,'collection_table_name': user_collection,'condition':"unique_id='%s'"%unique_id}
        users=requests.post('{}/list_data'.format(dal_url),json=json_query)
        users = users.json()['result']
        return jsonify({'status':'success','users': eval(JSONEncoder().encode(users))})
    except:
        logger.error("Exception occurred at **** event_app / get_user_details_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to get user details'})    

@app.route("/modify_user/<account_id>/<user_name>", methods=['POST'])
@check_for_token
def modify_user(account_id,user_name):
    try:
        data = request.json
        json_query={'data':data.copy(),'db_name':db_name,'collection_table_name': user_collection,'condition':"unique_id='%s'"%(data['unique_id'])}
        resp=requests.post('{}/update_data'.format(dal_url),json=json_query)
        return jsonify({'status': 'success'})
    except:
        logger.error("Exception occurred at **** event_app / modify_user_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to modify user'})    

@app.route("/delete_user/<account_id>/<user_name>", methods=['POST'])
@check_for_token
def delete_user(account_id,user_name):
    try:
        data = request.json
        #json_query={'db_name':db_name,'collection_table_name': user_collection,'condition':"unique_id='%s'"%(data['unique_id'])}
        json_query={'db_name':db_name,'collection_table_name': user_collection,'condition':"username='%s'"%(data['username'])}
        resp=requests.post('{}/remove_data'.format(dal_url),json=json_query)
    except:
        logger.error("Exception occurred at **** event_app / delete_user_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':"failed to delete user"})
    return jsonify({'status': 'success'})

@app.route("/checkcurrentpassword", methods=['POST'])
def checkcurrentpassword():
    try:
        data = request.json
        json_query = {'db_name':db_name,'collection_table_name': user_collection,'condition':"username='%s'"%(data['username'])}
        try:
            user_data = requests.post('{}/list_data'.format(dal_url),json=json_query).json()['result'][0]
        except:
            logger.error("Exception occurred at **** event_app / checkcurrentpassword_function **** \n", exc_info=True)
            return jsonify({'status': 'failed','error': 'Incorrect User'})

        password_verified = False
        if 'cajun' not in user_data or 'passhash' not in user_data:
            if user_data['password'] == data['password']:
                password_verified = True
        else:
            if check_passhash(data['password'], user_data['cajun'], user_data['passhash']):
                password_verified = True

        # if user_data['password'] == data['password']:
        if password_verified:
            token_resp=get_token().get_json(force=True)
            #token_resp=requests.post('{}/get_token'.format('http://0.0.0.0:4440'),json={'username':data['username'],'password':data['password']}).json()
            if 'WWW-Authenticate' in token_resp.keys():
                return jsonify({'status': 'failed'})

            return jsonify({'status': 'success','name':user_data['name'],'account_name': user_data['account_name'],'employee_id':user_data['employee_id'],'email':user_data['username'],'userlogin_status':user_data['staff_status'],'token':token_resp})

        else:
            return jsonify({'status': 'failed','error': 'Incorrect Password'})
    except:
        logger.error("Exception occurred at **** event_app / checkcurrentpassword_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':"username password not found"})

######################################################################################
#                                                                                    #
#                                       STEVEDORE                                    #
#                                                                                    #
######################################################################################

@app.route("/get_cam_events/<account_id>/<user_name>/<cam_name>", methods=['GET'])
@check_for_token
def get_cam_events(account_id, user_name, cam_name):
    try:
        # SPECIFY YOUR FRAME DIFFERENCE CONDITION ALONG WITH CAMERA FILTER WHILE FETCHING THE DATA  FROM event DB
        # cam_events = list(db_event.find({'cam_name': cam_name}))
        json_query={'db_name':db_name,'collection_table_name': event_collection,'condition':"cam_name='%s'"%cam_name}
        cam_events=requests.post('{}/list_data'.format(dal_url),json=json_query)
        cam_events = cam_events.json()['result']
        return jsonify({'status':'success','cam_events': eval(JSONEncoder().encode(cam_events))})
    except:
        logger.error("Exception occurred at **** event_app / get_cam_events_function **** \n", exc_info=True)
        return jsonify({'status':'failed'})    

@app.route("/get_cam_list/<account_id>/<user_name>", methods=['GET'])
@check_for_token
def get_cam_list(account_id,user_name):
    try:
        # live_cams = db_cam.find()
        json_query={'db_name':db_name,'collection_table_name': camera_collection,'condition':None}
        live_cams=requests.post('{}/list_data'.format(dal_url),json=json_query)
        live_cams= live_cams.json()['result']
        live_cams_list=[]
        for cam in live_cams:
            live_cams_list.append(cam)
        return jsonify({'status':'success','cam_list':eval(JSONEncoder().encode(live_cams_list))})
    except:
        logger.error("Exception occurred at **** event_app / get_cam_list_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to get camera list'})    

@app.route("/get_truck_list/<account_id>/<user_name>/<cam_name>", methods=['GET'])
@check_for_token
def get_truck_list(account_id,user_name, cam_name):
    try:
        # cam_events = db_truck.find({'cam_name':cam_name,'event_name': 'Truck operation',\
                                # 'truck_status': 'completed'})
        json_query={'db_name':db_name,'collection_table_name': truck_collection,'condition':"truck_status='%s'"%'completed'}
        cam_events=requests.post('{}/list_data'.format(dal_url),json=json_query)
        cam_events=cam_events.json()['result']
        truck_list=[]
        for event in cam_events:
                truck_list.append(event)
        return jsonify({'status':'success','truck_list':eval(JSONEncoder().encode(truck_list))})
    except:
        logger.error("Exception occurred at **** event_app / get_truck_list_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to get truck list'})    

@app.route("/get_truck_events/<account_id>/<user_name>/<truck_id>", methods=['GET'])
@check_for_token
def get_truck_events(account_id,user_name, truck_id):
    try:
        event_dict_arr =[]
        # truck_events = list(db_truck.find({'truck_id': truck_id}))
        json_query={'db_name':db_name,'collection_table_name': truck_collection,'condition':"truck_id='%s'"%truck_id}
        truck_events=requests.post('{}/list_data'.format(dal_url),json=json_query)
        truck_events=truck_events.json()['result']
        for event in truck_events:
            if event['event_start_time']!='' and event['event_end_time'] !='':
                event_end_copy = event.copy()
                event_end_copy['event_time'] = event_end_copy['event_end_time']
                event_dict_arr.append(event_end_copy)
                event_start_copy = event.copy()
                event_start_copy['event_time'] = event_start_copy['event_start_time']
                event_start_copy['event_end_time'] = ''
                event_dict_arr.append(event_start_copy)
            
            if event['event_start_time']!='' and event['event_end_time'] =='':
                event['event_time'] = event['event_start_time']
                event_dict_arr.append(event)    

    #    sorted_event_arr = sorted(event_dict_arr, key=lambda k: datetime.strptime(k['event_time'],'%A %d %B %Y %X'))       
        sorted_event_arr = event_dict_arr
        #sorted_event_arr = sorted(event_dict_arr, key=lambda k: k['event_time']) 
        sorted_event_arr = eval(JSONEncoder().encode(sorted_event_arr))
        truck_events = eval(JSONEncoder().encode(truck_events))
        return jsonify({'status':'success','graph_event_data': truck_events,'event_data':sorted_event_arr})
    except:
        logger.error("Exception occurred at **** event_app / get_truck_events_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to get truck inward and outward time'})    
@app.route("/get_cam_truck_count/<account_id>/<user_name>", methods=['GET'])
@check_for_token
def get_cam_truck_count(account_id, user_name):
    try:
    # cams = db_cam.find()
        json_query={'db_name':db_name,'collection_table_name': camera_collection,'condition':None}
        cams=requests.post('{}/list_data'.format(dal_url),json=json_query)
        cams=cams.json()['result']

        cam_truck_count_arr =[]
        area_arr =[]
        for cam in cams:
            # truck_count = int(db_truck.find({'cam_name':cam['cam_name'],'event_name': 'Truck operation',\
                                # 'truck_status': 'completed'}).count())
            json_query={'db_name':db_name,'collection_table_name': truck_collection,'condition':"cam_name='%s'"%cam['cam_name']}
            truck_count = requests.post('{}/count_data'.format(dal_url),json=json_query)
            # truck_count = truck_count.json()['result'][0]
            truck_count = truck_count.json()['result']
    
            area = cam['area']
            state = cam['state']  
            if state in area_arr:
                continue
            area_arr.append(state)
            cam_truck_count_arr.append({'city':cam['city'],\
                                        'location':cam['location'],'state':state, \
                                        'area':area,'truck_count':truck_count, \
                                        'cam_name':cam['cam_name'], 'cam_status':cam['cam_status']})
        return jsonify({'status':'success','cam_truck_count_dict': eval(JSONEncoder().encode(cam_truck_count_arr))})
    except:
        logger.error("Exception occurred at **** event_app / get_cam_truck_count_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to get truck count'})    

@app.route("/get_live_cam_events/<account_id>/<user_name>/<cam_name>", methods=['GET'])
@check_for_token
def get_live_cam_events(account_id,user_name, cam_name):
    try:
        # cam_events = list(db_truck.find({'cam_name': cam_name,'truck_status':'running'}))
        json_query = {'db_name':db_name,'collection_table_name': truck_collection,'condition':"cam_name='%s' and truck_status='running'"%cam_name}
        cam_events = requests.post('{}/list_data'.format(dal_url),json=json_query)
        cam_events = cam_events.json()['result']

        event_dict_arr = []
        for event in cam_events:
            if event['event_start_time']!='' and event['event_end_time'] !='':
                event_end_copy = event.copy()
                event_end_copy['event_time'] = event_end_copy['event_end_time']
                event_dict_arr.append(event_end_copy)
                event_start_copy = event.copy()
                event_start_copy['event_time'] = event_start_copy['event_start_time']
                event_start_copy['event_end_time'] = ''
                event_dict_arr.append(event_start_copy)

            if event['event_start_time']!='' and event['event_end_time'] =='':
                event['event_time'] = event['event_start_time']
                event_dict_arr.append(event)
        sorted_event_arr = event_dict_arr
        #sorted_event_arr = sorted(event_dict_arr, key=lambda k: k['event_time']) 
        #sorted_event_arr = sorted(event_dict_arr, key=lambda k: datetime.strptime(k['event_time'],'%A %d %B %Y %X'))
        sorted_event_arr = eval(JSONEncoder().encode(sorted_event_arr))
        cam_events = eval(JSONEncoder().encode(cam_events))
        return jsonify({'status':'success','graph_event_data': cam_events,'event_data':sorted_event_arr})
    except:
        logger.error("Exception occurred at **** event_app / get_live_cam_events_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to get truck entry and exit time'})    
######################################################################################
#                                                                                    #
#                                                                                    #
######################################################################################

@app.route("/add_smtp/<account_id>/<user_name>", methods=['POST'])
def add_smtp(account_id,user_name):
    try:
        data = request.json
        json_query={'db_name':db_name,'collection_table_name': smtp_collection,'condition':None}
        resp=requests.post('{}/remove_data'.format(dal_url),json=json_query)

        json_query={'data':data,'db_name':db_name,'collection_table_name': smtp_collection}
        resp=requests.post('{}/insert_data'.format(dal_url),json=json_query)
        return jsonify({'status': 'success'})
    except:
        logger.error("Exception occurred at **** event_app / add_smtp_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to add smtp'})    

@app.route("/get_smtp/<account_id>/<user_name>", methods=['GET'])
def get_smtp(account_id,user_name):
    try:
        json_query={'db_name':db_name,'collection_table_name': smtp_collection,'condition':None}
        smtp=requests.post('{}/list_data'.format(dal_url),json=json_query)
        smtp = smtp.json()['result']
        return jsonify({'status':'success','smtp': eval(JSONEncoder().encode(smtp))})
    except:
        logger.error("Exception occurred at **** event_app / get_smtp_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to get smtp'})    

@app.route("/add_twilio/<account_id>/<user_name>", methods=['POST'])
def add_twilio(account_id,user_name):
    try:
        data = request.json
        json_query={'db_name':db_name,'collection_table_name': twilio_collection,'condition':None}
        resp=requests.post('{}/remove_data'.format(dal_url),json=json_query)

        json_query={'data':data,'db_name':db_name,'collection_table_name': twilio_collection}
        resp=requests.post('{}/insert_data'.format(dal_url),json=json_query)
        return jsonify({'status': 'success'})
    except:
        logger.error("Exception occurred at **** event_app / add_twilio_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to add twilio'})    

@app.route("/get_twilio/<account_id>/<user_name>", methods=['GET'])
def get_twilio(account_id,user_name):
    try:
        json_query={'db_name':db_name,'collection_table_name': twilio_collection,'condition':None}
        twilio=requests.post('{}/list_data'.format(dal_url),json=json_query)
        twilio = twilio.json()['result']
        return jsonify({'status':'success','twilio': eval(JSONEncoder().encode(twilio))})
    except:
        logger.error("Exception occurred at **** event_app / get_twilio_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to get twilio'})    

@app.route("/change_notif_flag/<account_id>/<user_name>", methods=['POST'])
@check_for_token
def change_notif_flagg(account_id,user_name):
    try:
        data = request.json
        json_query={'data':{'read_notif_flag': 'Y'},'db_name':db_name,'collection_table_name': alert_collection,'condition':"alert_id='%s'"%data['alert_id']}
        resp=requests.post('{}/update_data'.format(dal_url),json=json_query)
        return jsonify({'status': 'success'})
    except:
        logger.error("Exception occurred at **** event_app / change_notif_flag_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to changed notify flag'})    

@app.route("/add_license/<account_id>/<user_name>", methods=['POST'])
@check_for_token
def add_license(account_id,user_name):
    try:
        data = request.json
        if not validate_license_key(data['license_key']):
            return jsonify({'status': 'failed','error':'Invalid License Key'})

        json_query={'db_name':db_name,'collection_table_name': license_collection,'condition':None}
        resp=requests.post('{}/remove_data'.format(dal_url),json=json_query)    

        json_query={'data':data,'db_name':db_name,'collection_table_name': license_collection}
        resp=requests.post('{}/insert_data'.format(dal_url),json=json_query)  
        return jsonify({'status': 'success'})
    except:
        logger.error("Exception occurred at **** event_app / add_license_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to add license'})    

@app.route("/get_license/<account_id>/<user_name>", methods=['GET'])
@check_for_token
def get_license(account_id,user_name):
    try:
        json_query={'db_name':db_name,'collection_table_name': license_collection,'condition':None}
        license=requests.post('{}/get_data'.format(dal_url),json=json_query)
        license = license.json()['result']
        return jsonify({"status":"success","data":license})
    except:
        logger.error("Exception occurred at **** event_app / get_license_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to get license'})    

@app.route("/verify_license_key/<account_id>/<user_name>", methods=["POST"])
@check_for_token
def verify_license_key(account_id,user_name):
    try:
        json_query={'db_name':db_name,'collection_table_name': camera_collection,'condition':"cam_status='%s'"%'live'}
        no_live_cams=requests.post('{}/count_data'.format(dal_url),json=json_query).json()['result']
        #no_live_cams = request.json['live_cams']
        
        json_query = {'db_name':db_name,'collection_table_name': license_collection,'condition':None}
        license = requests.post('{}/get_data'.format(dal_url),json=json_query)
        
        try:
            license_key = license.json()['result'][0]['license_key']
        except:
            logger.error("Exception occurred at **** event_app / verify_license_key_function **** \n", exc_info=True)
            return jsonify({'status': 'failed','error':'license not added'})
        license_key = license_key[-1 * int(len(license_key) / 2):] + license_key[:-1 * int(len(license_key) / 2)]
        k1 = b'1U5MClWgkwrxJwVtsJtsmH6sgHtMQVYYOqNQx6sygH0='
        k2 = b'NHwLuDtRuKjzgDhwTTX1xoHTWFgBMAcn5efn5xxX5G4='
        key3 = []
        for i in range(3):
            key3.append((i + 1) * 3)
        key3 = key3[::-1]
        key4 = []
        for i in range(2):
            key4.append((i + 1) * (i + 1))
        key4 = key4[::-1]
        num_acc_cam = decode_key('a' + license_key + 'a', k2, k1, key3, key4, 3)
        #num_cam = decode('a' + license_key + 'a', k2, k1, key3, key4, 3)
        if no_live_cams > num_acc_cam:
            return jsonify({'status': 'failed','error':'camera limit exceeded'})
        return jsonify({'status': 'success'})
    except:
        logger.error("Exception occurred at **** event_app / verify_license_key **** \n", exc_info=True)
        return jsonify({'status': 'failed'})    


@app.route("/get_priority/<account_id>/<user_name>", methods=["GET"])
@check_for_token
def get_priority(account_id, user_name):
    try:
        json_query = {'db_name': db_name, 'collection_table_name': priority_collection, 'condition': None}
        priority_list = requests.post('{}/list_data'.format(dal_url), json=json_query).json()['result']
        
        if len(priority_list) == 0:
            priority_list = show_default_priority
            
            for i in priority_list:
                if i['alert_name'] == "CCTV Active" or i['alert_name'] == "CCTV Inactive":
                    priority_list.remove(i)
                else:
                    json_query = {'data': i, 'db_name': db_name, 'collection_table_name': priority_collection}
                    resp = requests.post('{}/insert_data'.format(dal_url), json=json_query)
        
        return jsonify({'status': 'success', 'priority_list': priority_list, 'priorities': default_priority_list})
    
    except:
        logger.error("Exception occurred at **** event_app / get_priority_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to get priority wise alert'})    

@app.route("/set_priority/<account_id>/<user_name>", methods=["POST"])
@check_for_token
def set_priority(account_id, user_name):
    try:
        data = request.json
        
        for i in data["new_priority"]:
            data_ = {'priority': i['priority']}
            condition = "alert_name='%s'"%i['alert_name']
            json_query = {'data': data_,'db_name': db_name,'collection_table_name': priority_collection,'condition': condition}
            resp = requests.post('{}/update_data'.format(dal_url), json=json_query)
        
        if resp.json()['status'] == 1:
            return jsonify({'status': 'success'})
        else:
            return jsonify({'status': 'failed','error': 'failed to set priority wise alert'})
    
    except:
        logger.error("Exception occurred at **** event_app / set_priority_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to set priority wise alert'})    

@app.route("/get_alerts_view/<account_id>/<user_name>", methods=['GET'])
@check_for_token
def get_alert_view(account_id, user_name):
    try:
        ndays = 2
        ndays=int(ndays)
        to_date = datetime.now()
        from_date = to_date - timedelta(ndays)
        to_alert_date = to_date.strftime('%Y-%m-%d')
        from_alert_date = from_date.strftime('%Y-%m-%d')
        condition = "(alert_date <= date('%s') and alert_date >= date('%s'))" % (to_alert_date ,from_alert_date)

        json_query = {'db_name':db_name,'collection_table_name': alert_collection,'condition': condition}
        cam_alerts = requests.post('{}/list_data'.format(dal_url), json=json_query)
        
        try:
            alerts_list = cam_alerts.json()['result']
        except:
            logger.error("Exception occurred at **** event_app / get_alerts_view_function **** \n", exc_info=True)
            alerts_list =[]
        
        return jsonify({'status':'success','alert_data':alerts_list})
    except:
        logger.error("Exception occurred at **** event_app / get_alerts_view_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to get alerts'})    

@app.route("/add_voi_track/<account_id>/<user_name>", methods=['POST'])
@check_for_token
def add_voi_track(account_id,user_name):
    try:
        try:
            image_file = request.files['file'].read()
            data = request.form.to_dict()
            data['voi_id'] = str(uuid.uuid4()).split('-')[1]

            vehicle_number = data['vehicle_number']
            image_file = np.fromstring(image_file, np.uint8)
            img = cv2.imdecode(image_file, flags=1)
            try:
                index = faiss.read_index(PATH_TO_SAVE+'/'+'num_plate_embeddings')
                with open(PATH_TO_SAVE+'/'+'voi_nums', 'rb') as file_in:
                    vehicle_nums = list(pickle.load(file_in))
            except:
                logger.error("Exception occurred at **** event_app / add_voi_track_function **** \n", exc_info=True)
                index = faiss.IndexFlatL2(20)
                vehicle_nums = []
                
            ###
            #Get numplate bbox
            ###

            ##Get num plate embeddings
            img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            img = cv2.resize(img, [100,100])
            img = torch.from_numpy(img.astype(np.float32))
            img = torch.reshape(img, [1,1,100,100])
            output = num_plate_recognizer(img)
            embd = torch.nn.functional.normalize(output, p=2.0, dim = 1)
            embd = embd.cpu().detach().numpy()
            index.add(embd)
            vehicle_nums.append(vehicle_number)

            faiss.write_index(index, PATH_TO_SAVE+'/'+'num_plate_embeddings')
            with open(PATH_TO_SAVE+'/'+'voi_nums', 'wb') as fp:
                pickle.dump(np.array(vehicle_nums), fp)
        except:
            data = request.form.to_dict()
            data['voi_id'] = str(uuid.uuid4()).split('-')[1]
        
        json_query={'data':data,'db_name':db_name,'collection_table_name': voi_track_collection}
        resp=requests.post('{}/insert_data'.format(dal_url),json=json_query)
        return jsonify({'status': 'success'})
    except:
        logger.error("Exception occurred at **** event_app / add_voi_track_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to insert voi id'})    

@app.route("/get_voi_tracks/<account_id>/<user_name>", methods=['GET'])
@check_for_token
def get_voi_track(account_id,user_name):
    try:
        json_query={'db_name':db_name,'collection_table_name': voi_track_collection,'condition':None}
        voi_track=requests.post('{}/get_data'.format(dal_url),json=json_query)
        voi_track =voi_track.json()['result']
        return jsonify({'status':'success','data':voi_track})
    except:
        logger.error("Exception occurred at **** event_app / get_voi_tracks_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to get voi track records'})  

@app.route("/edit_voi_track/<account_id>/<user_name>", methods=['POST'])
@check_for_token
def edit_voi_track(account_id,user_name):
    try:
        data=request.json
        # Note: Currently only updates date
        data_ = {'date': data['new_date']}
        json_query={'data':data_, 'db_name':db_name,'collection_table_name': voi_track_collection,'condition':"voi_id='%s'"%(data['voi_id'])}
        resp=requests.post('{}/update_data'.format(dal_url),json=json_query)
        if resp.json()['status'] == 1:
            return jsonify({'status': 'success'})
        else:
            return jsonify({'status': 'failed','error': 'failed to edit voi track'})
    except:
        logger.error("Exception occurred at **** event_app / edit_voi_track function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to edit voi track '})  

@app.route("/delete_voi_track/<account_id>/<user_name>", methods=['POST'])
@check_for_token
def delete_voi_track(account_id,user_name):
    try:
        data=request.json
        json_query={'db_name':db_name,'collection_table_name': voi_track_collection,'condition':"voi_id='%s'"%(data['voi_id'])}
        resp=requests.post('{}/remove_data'.format(dal_url),json=json_query)
        return jsonify({'status': 'success'})
    except:
        logger.error("Exception occurred at **** event_app / delete_voi_track_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to delete voi id'})    

# @app.route("/add_poi_track/<account_id>/<user_name>", methods=['POST'])
# @check_for_token
# def add_poi_track(account_id,user_name):

#     try:
#         image_file = request.files['file']

#         path = PATH_TO_SAVE + '/' + user_name+'/poi'
#         if not os.path.exists(path):
#             os.makedirs(path)

#         form_dict = request.form.to_dict()
#         form_dict['poi_id'] = str(uuid.uuid4()).split('-')[1]
#         poi_face_path = path+'/'+form_dict['poi_id']+'.jpg'
#         image_file.save(poi_face_path)
#         # form_dict['poi_face_path']=poi_face_path.split(PATH_TO_SAVE+'/')[-1]
#         # json_query={'data':form_dict,'db_name':db_name,'collection_table_name': poi_track_collection}
#         # resp=requests.post('{}/insert_data'.format(dal_url),json=json_query)

#         name = form_dict['name']
#         frame = cv2.imread(poi_face_path)
#         frame2 = frame.copy()
#         frame = cv2.resize(frame, input_res, interpolation=cv2.INTER_CUBIC)
#         try:
#             index = faiss.read_index(PATH_TO_SAVE+'/'+'embedding')
#             with open(PATH_TO_SAVE+'/'+'person_id', 'rb') as file_in:
#                 person_id = list(pickle.load(file_in))
#         except:
#             logger.error("Exception occurred at **** event_app / add_poi_track_function **** \n", exc_info=True)
#             index = faiss.IndexFlatL2(128)
#             person_id = []

#         try:
#             form_dict['age']
#         except:
#             try:
#                 dob = form_dict['dob'][:4]
#                 today = date.today().year
#                 age = int(today) - int(dob)
#                 form_dict['age'] = age
#             except:
#                 pass

#         # _, encoded_image = cv2.imencode('.jpg', frame)
#         # encoded_image = encoded_image.tobytes()
#         # im_b64 = base64.b64encode(encoded_image).decode("utf8")
#         # payload = json.dumps({"image": im_b64, "other_key": "value"})
#         # with requests.post(api_detection_fr_url, data=payload) as resp:
#         #     det = resp.json()["fr_arr"][0]
#         det = detector.get_face_bbox(frame)
#         if not len(det):
#             return jsonify({'status': 'failed', 'error': 'failed to detect face please try with different image'})
#         det1 = det.copy()

#         det1[0] = det1[0] * (frame2.shape[1] / frame.shape[1])
#         det1[1] = det1[1] * (frame2.shape[0] / frame.shape[0])
#         det1[2] = det1[2] * (frame2.shape[1] / frame.shape[1])
#         det1[3] = det1[3] * (frame2.shape[0] / frame.shape[0])
#         bbox = [det1[0], det1[1], det1[2], det1[3]]
#         c_x, c_y = (int(bbox[0]) + int(bbox[2])) // 2, (int(bbox[1]) + int(bbox[3])) // 2
#         max_coord = max(abs(int(bbox[0]) - int(bbox[2])), abs(int(bbox[1]) - int(bbox[3]))) // 2
#         bbox = [c_x - max_coord, c_y - max_coord, c_x + max_coord, c_y + max_coord]
#         # patch = frame2[int(bbox[1]):int(bbox[3]), int(bbox[0]):int(bbox[2])]

#         embd = recg.get_embeddings(frame2,bbox)
#         index.add(embd)
#         person_id.append(name)

#         faiss.write_index(index, PATH_TO_SAVE+'/'+'embedding')
#         with open(PATH_TO_SAVE+'/'+'person_id', 'wb') as fp:
#             pickle.dump(np.array(person_id), fp)

#         form_dict['poi_face_path'] = poi_face_path.split(PATH_TO_SAVE + '/')[-1]
#         json_query = {'data': form_dict, 'db_name': db_name, 'collection_table_name': poi_track_collection}
#         resp = requests.post('{}/insert_data'.format(dal_url), json=json_query)

#         return jsonify({'result': 'face registered', 'status': 'success'})
#     except:
#         logger.error("Exception occurred at **** event_app / add_poi_track_function **** \n", exc_info=True)
#         os.remove(poi_face_path) if os.path.exists(poi_face_path) else None
#         return jsonify({'status': 'failed','error': 'failed to register new face'})


# @app.route("/get_poi_tracks/<account_id>/<user_name>", methods=['GET'])
# @check_for_token
# def get_poi_track(account_id,user_name):
#     try:
#         json_query={'db_name':db_name,'collection_table_name': poi_track_collection,'condition':None}
#         poi_track=requests.post('{}/get_data'.format(dal_url),json=json_query)
#         poi_track =poi_track.json()['result']

#         try:
#             for i in poi_track:
#                 if i['valid_upto'] == "":
#                     i.pop('valid_upto')   
#         except:
#             pass

#         return jsonify({'status':'success','data':poi_track})
#     except:
#         logger.error("Exception occurred at **** event_app / get_poi_tracks_function **** \n", exc_info=True)
#         return jsonify({'status': 'failed','error':'failed to get poi records'})    

# @app.route("/delete_poi_track/<account_id>/<user_name>", methods=['POST'])
# @check_for_token
# def delete_poi_track(account_id,user_name):
#     try:
#         data=request.json
#         json_query = {'db_name':db_name,'collection_table_name': poi_track_collection,'condition':"poi_id='%s'"%(data['poi_id'])}
#         resp = requests.post('{}/list_data'.format(dal_url), json=json_query)
#         resp1 = requests.post('{}/remove_data'.format(dal_url),json=json_query)
        
#         poi_details = resp.json()['result'][0]

#         try:
#             index = faiss.read_index(PATH_TO_SAVE+'/'+'embedding')
#             with open(PATH_TO_SAVE+'/'+'person_id', 'rb') as file_in:
#                 person_id = list(pickle.load(file_in))

#             name = poi_details['name']
#             rm_id = person_id.index(name)

#             index.remove_ids(np.array([rm_id]))
#             person_id.remove(name)

#             faiss.write_index(index, PATH_TO_SAVE+'/'+'embedding')
#             with open(PATH_TO_SAVE+'/'+'person_id', 'wb') as fp:
#                 pickle.dump(np.array(person_id), fp)

#         except:
#             index = faiss.read_index(PATH_TO_SAVE + '/' + 'backup_embedding')
#             with open(PATH_TO_SAVE + '/' + 'backup_person_id', 'rb') as file_in:
#                 person_id = list(pickle.load(file_in))

#             name = poi_details['name']
#             rm_id = person_id.index(name)

#             index.remove_ids(np.array([rm_id]))
#             person_id.remove(name)

#             faiss.write_index(index, PATH_TO_SAVE + '/' + 'backup_embedding')
#             with open(PATH_TO_SAVE + '/' + 'backup_person_id', 'wb') as fp:
#                 pickle.dump(np.array(person_id), fp)

#         return jsonify({'status': 'success'})
#     except :
#         logger.error("Exception occurred at **** event_app / delete_poi_track_function **** \n", exc_info=True)
#         return jsonify({'status': 'failed','error': 'failed to delete registered face'})

# @app.route("/update_poi_track/<account_id>/<user_name>", methods=['POST'])
# @check_for_token
# def update_poi_track(account_id,user_name):
    try:
        data = request.json
        update_data = {"valid_upto": data['valid_upto']}
        json_query = {'data':update_data, 'db_name':db_name, 'collection_table_name':poi_track_collection, 'condition':"poi_id='%s'"%(data['poi_id'])}
        resp = requests.post('{}/update_data'.format(dal_url), json=json_query)

        if resp.json()['status']:

            if os.path.exists(PATH_TO_SAVE + '/' + 'backup_embedding'):
                index = faiss.read_index(PATH_TO_SAVE + '/' + 'backup_embedding')
                with open(PATH_TO_SAVE + '/' + 'backup_person_id', 'rb') as file_in:
                    person_id = list(pickle.load(file_in))

                vector = index.reconstruct(person_id.index(data['name']))

                index.remove_ids(np.array([person_id.index(data['name'])]))
                person_id.remove(data['name'])

                faiss.write_index(index, PATH_TO_SAVE + '/' + 'backup_embedding')
                with open(PATH_TO_SAVE + '/' + 'backup_person_id', 'wb') as fp:
                    pickle.dump(np.array(person_id), fp)

                try:
                    index = faiss.read_index(PATH_TO_SAVE + '/' + 'embedding')
                    with open(PATH_TO_SAVE + '/' + 'person_id', 'rb') as file_in:
                        person_id = list(pickle.load(file_in))
                except:
                    logger.error("Exception occurred at **** event_app / update_poi_track **** \n", exc_info=True)
                    index = faiss.IndexFlatL2(128)
                    person_id = []

                index.add(np.array([vector]).astype('float32'))
                person_id.append(data['name'])

                faiss.write_index(index, PATH_TO_SAVE + '/' + 'embedding')
                with open(PATH_TO_SAVE + '/' + 'person_id', 'wb') as fp:
                    pickle.dump(np.array(person_id), fp)

            return jsonify({'status':'success'})
        else:
            return jsonify({'status':'failed', 'error':'failed to update registered face'})

    except:
        logger.error("Exception occurred at **** event_app / update_poi_track_function **** \n", exc_info=True)
        return jsonify({'status':'failed', 'error':'failed to update registered face'})


# @app.route("/backup_poi_track", methods=['POST'])
# # @check_for_token
# def backup_poi_track():
    try:
        data = request.json
        index = faiss.read_index(PATH_TO_SAVE + '/' + 'embedding')
        with open(PATH_TO_SAVE + '/' + 'person_id', 'rb') as file_in:
            person_id = list(pickle.load(file_in))

        vector = index.reconstruct(person_id.index(data['name']))

        index.remove_ids(np.array([person_id.index(data['name'])]))
        person_id.remove(data['name'])

        faiss.write_index(index, PATH_TO_SAVE + '/' + 'embedding')
        with open(PATH_TO_SAVE + '/' + 'person_id', 'wb') as fp:
            pickle.dump(np.array(person_id), fp)

        try:
            index = faiss.read_index(PATH_TO_SAVE + '/' + 'backup_embedding')
            with open(PATH_TO_SAVE + '/' + 'backup_person_id', 'rb') as file_in:
                person_id = list(pickle.load(file_in))
        except:
            logger.error("Exception occurred at **** event_app / backup_poi_track **** \n", exc_info=True)
            index = faiss.IndexFlatL2(128)
            person_id = []

        index.add(np.array([vector]).astype('float32'))
        person_id.append(data['name'])

        faiss.write_index(index, PATH_TO_SAVE + '/' + 'backup_embedding')
        with open(PATH_TO_SAVE + '/' + 'backup_person_id', 'wb') as fp:
            pickle.dump(np.array(person_id), fp)

        return jsonify({'status':'success'})
    
    except:
        logger.error("Exception occurred at **** event_app / backup_poi_track **** \n", exc_info=True)
        return jsonify({'status':'failed', 'error':'failed to backup registered face'})

# @app.route("/search_poi_details/<account_id>/<user_name>", methods=['POST'])
# @check_for_token
# def search_poi_details(account_id, user_name):
    try:
        image_file = request.files['file']
        path = PATH_TO_SAVE + '/' + user_name+'/poi'
        match_arr= []
        if not os.path.exists(path):
            os.makedirs(path)

        poi_face_path = path+'/'+str(uuid.uuid4())+'.jpg'
        image_file.save(poi_face_path)
        frame = cv2.imread(poi_face_path)
        face_bboxs = get_object_bbox_m1(frame)
        if len(face_bboxs)==0:
            return jsonify({'status': 'failed','error':'face not found'})
        else:
            embeddings = get_face_embeddings(face_bboxs[0],frame)

        json_query={'db_name':db_name,'collection_table_name': poi_collection,'condition':None}
        poi_dict=requests.post('{}/list_data'.format(dal_url),json=json_query)
        poi_dict = poi_dict.json()['result']

        unique_cams = []
        for poi in poi_dict:
            unique_cams.append([poi['cam_name'], poi['location'], poi['city'], poi['state']])
        unique_cams = [list(x) for x in set(tuple(x) for x in unique_cams)]

        for obj in poi_dict:
            past_embeddings = np.array(obj['embeddings'])
            for emb in past_embeddings:
                dist = cosine(emb,embeddings)
                if dist<0.75:
                    obj.pop('embeddings')
                    match_arr.append(obj)
                    break

        response = []
        for cams in unique_cams:
            all_images = []
            for i in range(len(match_arr)):
                if match_arr[i]['cam_name'] == cams[0]:
                    all_images.append({ 'image_url':match_arr[i]['thumbnail_url'],
                                        'date':match_arr[i]['date']})

            response.append({'cam_name':cams[0], 'location':cams[1], 'city':cams[2], 'state':cams[3], 'all_images':all_images})
        return jsonify(eval(JSONEncoder().encode(response)))
    except:
        logger.error("Exception occurred at **** event_app / search_poi_details_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'face details not found'})    

@app.route("/get_area_details/<account_id>/<user_name>", methods=['GET'])
@check_for_token
def get_area_details(account_id,user_name):
    try:
        json_query = {'db_name':db_name, 'collection_table_name': location_collection, 'condition': None}
        pin_details = requests.post('{}/list_data'.format(dal_url),json=json_query).json()['result']

        return jsonify({'status':'success','data': pin_details})
    except:
        logger.error("Exception occurred at **** event_app / get_area_details_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to get location details'})

@app.route("/delete_area_details/<account_id>/<user_name>", methods=['POST'])
@check_for_token
def delete_area_details(account_id,user_name):
    try:
        data = request.json
        json_query = {'db_name':db_name, 'collection_table_name': location_collection, 'condition': "location='%s'"%data['location']}
        pin_details = requests.post('{}/remove_data'.format(dal_url),json=json_query)

        return jsonify({'status':'success'})
    except:
        logger.error("Exception occurred at **** event_app / delete_area_details_function **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to delete location details'})

@app.route('/delete_alerts_by_id/<account_id>/<user_name>', methods=['POST'])
@check_for_token
def delete_alerts_by_id(account_id, user_name):
    '''
    Delete alert and respective files from server.
    
    payload :
        alert_ids: ['asfasf', 'asgsa']
    '''
    try:
        data = request.json
        alert_ids = data['alert_ids']

        for alert_id in alert_ids:
            try:
                json_query = {'db_name': db_name, 'collection_table_name': alert_collection, 'condition': "alert_id='%s'"%(alert_id)}
                alert_data = requests.post('{}/list_data'.format(dal_url), json=json_query).json()['result'][0]
                try:
                    video_path  =  PATH_TO_SAVE + '/' + alert_data['video']
                    thumbnail_path  = PATH_TO_SAVE + '/' + alert_data['thumbnail']
                    os.remove(video_path)
                    os.remove(thumbnail_path)
                except:
                    logger.error("Exception occurred at **** event_app / delete_alerts_by_id **** \n", exc_info=True)
                data = requests.post('{}/remove_data'.format(dal_url), json=json_query).json()
            except:
                logger.error("Exception occurred at **** event_app / delete_alerts_by_id **** \n", exc_info=True)
        
        return jsonify({'status': 'success'})
    except:
        logger.error("Exception occurred at **** event_app / delete_alerts_by_id **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to delete alert by alert ID'})


@app.route('/alert_name_update/<account_id>/<user_name>', methods=['POST'])
@check_for_token
def alert_name_update(account_id, user_name):
    try:
        data = request.json
        try:
            priority = default_priority[data['alert_1']]
        except:
            #logger.error("Exception occurred at **** event_app / alert_name_update Inalid alert name in priority list **** \n", exc_info=True)
            priority = 'P1'

        if "vehicle_number" in data:
            json_query = {'data':{"voi_details.Vehicle Number": data['vehicle_number']},"db_name": db_name, "collection_table_name":alert_collection, "condition":"alert_id='%s'"%data['alert_id']}
            resp = requests.post('{}/update_data'.format(dal_url), json=json_query)
            return jsonify({'status': 'success'})  
            
        if data['alert_1'] == "Camera Obsolete":            
            end_date = datetime.now()+timedelta(hours=5, minutes=30)
            removed_hours = end_date-timedelta(hours=12)
            a = removed_hours.strftime("%d:%m:%Y %H:%M:%S")
            dat = a.split(":")
            start_date  = datetime(int(dat[2][2:4]), int(dat[1]), int(dat[0]) ,int(dat[2][5:]),int(dat[3]),int(dat[4]))

            aggPipe = [{"$addFields": {"new_date": {"$dateFromString": {"dateString": "$date","format": "%%d/%%m/%%Y %%H:%%M:%%S"}}}},
                    {"$match": {"alert_1":"Camera Tampering","new_date": { "$gte": start_date, "$lte": end_date}}},
                    {"$set":{"verified": "true"}},{ "$merge": alert_collection}]
            cond = "db['%s'].aggregate({})".format(aggPipe)
            cond = "db['%s'].aggregate({}, allowDiskUse=True)".format(aggPipe)
            json_query_search = { "db_name": db_name, "collection_table_name": alert_collection, "condition": cond }
            resp = requests.post("{}/custom_query".format(dal_url), json=json_query_search).json()["result"]
            return jsonify({'status': 'success'})
        else:
            json_query = {'data':{'alert_1': data['alert_1'], 'alert_2': data['alert_2'],'priority': priority,'alert_edited_by':user_name},"db_name": db_name, "collection_table_name":alert_collection, "condition":"alert_id='%s'"%data['alert_id']}
            resp = requests.post('{}/update_data'.format(dal_url), json=json_query)
            return jsonify({'status': 'success'})
    except:
        logger.error("Exception occurred at **** event_app / alert_name_update **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':'failed to update alert name'})

@app.route("/add_alert/<account_id>/<user_name>", methods=['POST'])
@check_for_token
def add_alert(account_id,user_name):

    try:
        import requests
        video_file = request.files['file']
        form_data = request.form.to_dict()
        json_query = {'db_name': db_name, 'collection_table_name': camera_collection, 'condition': "cam_name='%s'"%(form_data["cam_name"])}
        cam_data = requests.post('{}/list_data'.format(dal_url), json=json_query).json()['result'][0]

        alert_id = str(uuid.uuid4()).split('-')[1]

        path = PATH_TO_SAVE + '/' + cam_data["state"]+ '/' + cam_data["city"]+ '/' + cam_data["location"]+ '/' + cam_data["cam_name"] + '/' + "alert/" + alert_id 
        # path = "/home/ankesh/Music/images"
        if not os.path.exists(path):
            os.makedirs(path)
        
        video_file.save(path+'/input_video.mp4')

        cap=cv2.VideoCapture(path+'/input_video.mp4')
        count = 0

        while cap.isOpened():
            ret,frame=cap.read()

            if ret==True:
                frame =  cv2.resize(frame,(640,384),interpolation=cv2.INTER_CUBIC)
                if count == 0:
                    cv2.imwrite(path+".jpg",frame)
                _,encoded_image = cv2.imencode('.jpg',frame)
                encoded_image = encoded_image.tobytes()
                im_b64 = base64.b64encode(encoded_image).decode("utf8")
                # detect_api_url = 'http://localhost:8080/detect_object_bbox'
                response = requests.post(detect_api_url, json={"image": im_b64}).json()
                colour = {'crawling': (100,50,50), 'throwing': (115,115,115),'person': (0,255,0), 'head': (0,255,255), 'weapon': (5,5,5), 'vehicle': (5,5,5),'animal': (5,5,5)} #'atm': (5,5,5),
                for j in response.keys():
                    try:
                        if response[j] != []:
                            color = colour[j]
                            #print(j)
                            for i in response[j]:
                                frame = cv2.rectangle(frame, (int(i[0]),int(i[1])), (int(i[2]),int(i[3])), color, 1)
                    except:
                        pass
                # cv2.imshow('frame',frame)
                cv2.imwrite(f"{path}/frame-%05d.jpg" % count, frame)
                count = count+1
                #print(response)#['person'])
                # if cv2.waitKey(1) & 0xFF == ord('q'):
                #     break
            else:
                break
        # cap.release()

        # cv2.destroyAllWindows()
        #save_video_path = PATH_TO_SAVE + '/' + cam_data["state"]+ '/' + cam_data["city"]+ '/' + cam_data["location"]+ '/' + cam_data["cam_name"] + '/' + "alert"
        cmd = ["ffmpeg","-y","-framerate",str(10),"-i",f"{path}" + "/frame-%05d.jpg","-c:v","libx264",f"{path}"+".mp4"]
        subprocess.call(cmd)
        video = cam_data["state"]+ '/' + cam_data["city"]+ '/' + cam_data["location"]+ '/' + cam_data["cam_name"] + '/' + "alert/" + alert_id +".mp4"
        thumbnail = cam_data["state"]+ '/' + cam_data["city"]+ '/' + cam_data["location"]+ '/' + cam_data["cam_name"] + '/' + "alert/" + alert_id + ".jpg"
        date_split = form_data['date'].split("/")
        alert_date = "20"+date_split[-1][:2]+"-"+date_split[-2]+"-"+date_split[-3]


        priority= default_priority[form_data['alert_1']]
        alert_dict = {"cam_name" : cam_data["cam_name"], "state" : cam_data["state"], "city" : cam_data["city"], "location" : cam_data["location"],
         "alert_id" : alert_id, "start_frame" : 50436, "end_frame" : 50436, 
         "frame_diff" : 100, "alert_1" : form_data['alert_1'], "alert_2" : form_data['alert_2'], 
         "alert_category" : form_data['alert_1'], "priority" : priority, 
         "thumbnail" : thumbnail, 
         "video" : video, 
         "alert_date" : alert_date, "date" : form_data['date'], "alert_status" : "completed", 
         "assigned_to" : "", "video_status" : "", "mqtt_notif_sent" : "N", "send_notif_flag" : "Y", 
         "read_flag" : "N", "person_1_face_link" : "", "person_1_mask_flag" : "", "person_2_face_link" : "",
         "person_2_mask_flag" : "", "covid_flag" : 1 }

        json_query = {'data':alert_dict,'db_name':db_name,'collection_table_name': alert_collection}
        resp = requests.post('{}/insert_data'.format(dal_url),json=json_query)
        shutil.rmtree(path)
        return jsonify({'status': 'success','alert_id':alert_id})
    except:
        logger.error("Exception occurred at **** event_app / add_poi_track_function **** \n", exc_info=True)
        # os.remove(video_path) if os.path.exists(video_path) else None
        return jsonify({'status': 'failed','error': 'failed to insert alert'})

@app.route("/get_cam_alert_name/<account_id>/<user_name>",methods=['GET'])
@check_for_token  
def get_cam_alert_name(account_id, user_name):
    try:
        json_query={'db_name':db_name,'collection_table_name': camera_collection,'condition':None, 'field_name':'cam_name'}
        cam_names = requests.post('{}/get_unique_values'.format(dal_url), json=json_query).json()["result"]
        alert_names = list(default_priority.keys())
        
        return jsonify({"status":"success","cam_names":cam_names,"alert_names":alert_names})

    except:
        logger.error("Exception occurred at **** event_app / get_atm_cam_alert_map **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':"unabel to get camera name and alert name"})

@app.route("/get_onvif_camera/<account_id>/<user_name>", methods=['POST'])
@check_for_token
def get_onvif_camera(account_id,user_name):
    try:
        data = request.json
        result = []
        rtsps = []
        tokens = []
        ip = data['ip']
        username = data['username']
        password = data['password']
        try:
            port = data['port']
        except:
            port = 80

        my_cam = ONVIFCamera(ip, port, username, password, wsdl_dir='python-onvif2-zeep/wsdl/')
        media2_service = my_cam.create_media2_service()

        ## get the streamUri
        profiles = media2_service.GetProfiles()
        for profile in profiles:
            o = media2_service.create_type('GetStreamUri')
            o.ProfileToken = profile.token
            o.Protocol = 'RTSP'
            uri = media2_service.GetStreamUri(o)
            dic = {'token': profile.token, 'rtsp': uri}
            rtsps.append(dic['rtsp'])
            tokens.append(dic['token'])
        
        # count = 1
        for idx,rtsp in enumerate(rtsps):
            
            if 'c0' not in rtsp and 's0' in rtsp:
                cam_name = tokens[idx].replace(':', '_').replace('/', '_')
                # cam_name = f"cam_{count}"
                # count += 1
                # rtsp://admin:admin@12345@192.168.10.102:554/unicast/c0/s0/live
                _rtsp = "rtsp://" + username + ':'+password + '@' + ip + ':' + str(554) + rtsp.split(str(554))[1]
                result.append({'cam_name': cam_name, 'rtsp': _rtsp})
            
            elif 'channel' in rtsp and 'subtype=0' in rtsp:
                cam_name = tokens[idx]
                # cam_name = f"cam_{count}"
                # count += 1
                # rtsp://192.168.10.25:554/cam/realmonitor?channel=2&subtype=0&unicast=true&proto=Onvif
                _rtsp = "rtsp://" + username + ':' + password + '@' + ip + ":" + str(554) + rtsp.split(str(554))[1]
                result.append({'cam_name': cam_name, 'rtsp': _rtsp})

    except Exception as e:
        logger.error("Exception occurred at **** event_app / get_onvif_camera **** \n", exc_info=True)
        return jsonify({'status': 'failed','error':str(e)})

    json_query = {'db_name': db_name, 'collection_table_name': location_collection, 'condition': ""}
    loc_data = requests.post('{}/list_data'.format(dal_url), json=json_query).json()['result']

    return jsonify({'status': 'success', 'result': result, 'location': loc_data})


@app.route("/start_onvif_livestream/<account_id>/<user_name>", methods=['POST'])
@check_for_token
def start_onvif_livestream(account_id,user_name):
    data = request.json

    json_query = {'db_name': db_name, 'collection_table_name': location_collection, 'condition': "location='%s'"%(data["location"])}
    loc_data = requests.post('{}/list_data'.format(dal_url), json=json_query).json()['result'][0]

    for i in data['cam_list']:
        try:
            i['pincode'] = loc_data['pincode']
        except:
            i['pincode'] = ""

        try:
            i["city"] = loc_data["city"]
        except:
            i["city"] = ""

        try:
            i["state"] = loc_data["state"]
        except:
            i["state"] = ""

        try:
            i['user_email'] = loc_data['email_ids']
        except:
            i['user_email'] = []

        i["type"] = ""

        i = json.dumps(i)
        to_send = json.loads(i)

        # resp = start_service(account_id, user_name, **i).get_json(force=True)
        resp = requests.post(f'{event_app_url}/start_service/{dummy_account_id}/{dummy_user_name}',json = to_send).json()

        if resp['status'] != 'success':
            return jsonify({'status': 'failed'})
    
    return jsonify({'status': 'success'})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=4440, debug=True)
