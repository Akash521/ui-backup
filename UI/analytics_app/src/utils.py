import os
from datetime import date
import datetime
import requests
from config.config import *


def time_from_datetime(time):
    t = ""
    if time :
        time = datetime.datetime.strptime(time, "%d/%m/%y %H:%M:%S")
        t = datetime.datetime.strftime(time, "%I:%M %p")

    return t

def searchTextinDB(query, to_date, from_date, text_query, start, length):#, user_status):
    orCond = []
    MatchPipe = {}
    to_alert_date = to_date.split(" ")[0]
    from_alert_date = from_date.split(" ")[0]
    to_alert_date = '2'+to_alert_date[1:]
    from_alert_date = '2'+from_alert_date[1:]

    prefilter = {'$and':[{'alert_date': {'$lte': to_alert_date}},
                        {'alert_date': {'$gte': from_alert_date}},
                        {'verified': 'true'}]}

    for key,value in  query.items():
        if value:
            prefilter[key]= value
        else:
            orCond.append({key: {"$regex": text_query, "$options": "i"}})

    andCond = [{'date': {'$lte': to_date}},
                {'date': {'$gte': from_date}},]
    #if user_status == "cust_server":
        #atm_list = get_active_atm_list()
        # andCond = andCond + [
        #     {'atm_id':  {'$in': atm_list}},
        #     {'alert_1':  {'$nin': hidden_alerts}},
        #     {'alert_2':  {'$nin': hidden_alerts}}
        # ]

    orCond = orCond+[
        {"alert_1": {"$regex": text_query, "$options": "i"}},
        {"alert_2": {"$regex": text_query, "$options": "i"}},
        {"alert_id": {"$regex": text_query, "$options": "i"}},
        {"cam_name": {"$regex": text_query, "$options": "i"}},
    ]

    if text_query and text_query!=" ":
        MatchPipe ['$or']= orCond
    MatchPipe ['$and']= andCond 

    addDatefield = {"date": { 
                            '$dateToString': {
                                'date': {
                                    "$dateFromString": {
                                        "dateString": "$date",
                                        "format": "%%d/%%m/%%Y %%H:%%M:%%S"}},
                            'format':'%%Y-%%m-%%d %%H:%%M:%%S'}
                            }
                        }

    countPipe = [
                {"$match": prefilter},
                {"$addFields": addDatefield},
                {"$match": MatchPipe},
                { "$project": {'_id':0}},
                {"$count": "doc_count"},
                ]
    SearchPipe = [
                {"$match": prefilter},
                {"$addFields": addDatefield},
                {"$match": MatchPipe},
                { "$skip": start },
                { "$limit": length },
                { "$project": {'_id':0}},
                {"$sort":{"date":-1}},
                ]
    Countcond = "db['%s'].aggregate({},allowDiskUse=True)".format(countPipe)
    Matchcond = "db['%s'].aggregate({},allowDiskUse=True)".format(SearchPipe)

    MatchPipe.pop('$or', None)
    unfilteredCountPipe = [
                    {"$match": prefilter},
                    {"$addFields": addDatefield},
                    {"$match":MatchPipe},
                    {"$project": {'_id':0}},
                    {"$count": "doc_count"}]
    unfilteredCountcond = "db['%s'].aggregate({},allowDiskUse=True)".format(unfilteredCountPipe)

    return Countcond, Matchcond, unfilteredCountcond



def get_pql_query(state, city, location, to_alert_date, from_alert_date, priority, cam_name):
    state_count = 0
    city_count = 0 
    condition=''
    atm_condition=''
    if state == '' and city == '' and location =='':
        condition = ""
        atm_condition = ""
        table_var = 'state'
        
    
    if state != '' and city == '' and location =='':
        condition = "(state=='%s')" % (state)
        atm_condition = "(state='%s')" % (state)
        state_count=1
        table_var = 'city'
    
    if state != '' and city != '' and location =='':
        condition = "(state=='%s' and city=='%s')" % (state,city)
        atm_condition = "(state='%s' and city='%s')" % (state,city)
        state_count=1
        city_count=1
        table_var = 'location'
    
    if state != '' and city != '' and location !='':
        condition = "(state=='%s' and city=='%s' and location=='%s')" % (state,city,location)
        atm_condition = "(state='%s' and city='%s' and location='%s')" % (state,city,location)
        state_count=1
        city_count=1
        table_var = 'cam_name'

    if condition and cam_name: 
        condition += "and cam_name=='%s'"%(cam_name)
    
    if condition:
        condition += " and (alert_date <= date('%s') and alert_date >= date('%s')) and verified=='true'" % (to_alert_date ,from_alert_date)
    else:
        condition = "(alert_date <= date('%s') and alert_date >= date('%s')) and verified=='true'" % (to_alert_date ,from_alert_date)

    # if atm_condition :
    #     atm_condition += "and atm_id_status='occupied'"
    # else:
    #     atm_condition = "atm_id_status='occupied'"

    if priority != '' and priority in default_priority_list:
        condition += " and priority=='%s'" % (priority)

    # if user_status == "cust_server":
    #     atm_list = get_active_atm_list()
    #     condition += " and atm_id in {}  and ( alert_1 not in {} and alert_2 not in {})".format(atm_list, hidden_alerts, hidden_alerts)
    #     atm_condition +=  " and cust_view='true'"
    
    return condition, atm_condition, table_var , state_count, city_count

def get_date_array(_start_date,_end_date):
    __start_year=(_start_date.split(" ")[0]).split("-")[0]
    __start_month=(_start_date.split(" ")[0]).split("-")[1]
    __start_date=(_start_date.split(" ")[0]).split("-")[-1]
    __end_year=(_end_date.split(" ")[0]).split("-")[0]
    __end_month=(_end_date.split(" ")[0]).split("-")[1]
    __end_date=(_end_date.split(" ")[0]).split("-")[-1]
    start_date = date(int(__start_year),int(__start_month),int(__start_date))
    end_date = date(int(__end_year),int(__end_month),int(__end_date))
    delta = end_date - start_date
    days=[]
    for i in range(delta.days + 1):
        day = start_date + datetime.timedelta(days=i)
        days.append(day.strftime('%Y-%m-%d'))
     
    return days   
