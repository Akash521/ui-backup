import logging
import os
import time
from datetime import datetime, timedelta

import requests
from config.config import *
from twilio.rest import Client

logger= logging.getLogger(__name__)

def send_whtsapp(alert_dict,whtsapp_dict):
    from_ph_no = whtsapp_dict['from_phone_no']
    to_ph_no = whtsapp_dict['to_phone_no']
    twilio_sid = whtsapp_dict['twilio_sid']
    twilio_auth_token = whtsapp_dict['twilio_auth_id']

    date_time_str=alert_dict['date']
    date_time_obj = datetime.strptime(date_time_str, '%d/%m/%y %H:%M:%S')
    date_of_occurrence = str(date_time_obj.date())
    time_of_occurrence = str(date_time_obj.time())

    # user_name = cam_dict["user_name"]
    cam_id = alert_dict["cam_name"]
    location = alert_dict["location"] + '|' + alert_dict['city']  + '|' + alert_dict['state']
    alert1 = alert_dict["alert_1"]
    alert2 = alert_dict["alert_2"]
    video_link = alert_dict["video"]

    # video_url = 'http://' + domain_name + '/nginx/' + alert_dict['video']
    # image_url = 'http://' + domain_name + '/nginx/' + alert_dict['thumbnail']

    video_url = 'http://137.135.113.229/nginx/twilio/' + alert_dict['video'].split('/')[-1]
    image_url = 'http://137.135.113.229/nginx/twilio/' + alert_dict['thumbnail'].split('/')[-1]

    body = """Hello,

An abnormal activity has been captured by *RAVEN*. Request you to please act upon it immediately.
The details of the alert are given below:
*Camera ID:* {}
*Event occurred:* *{}* 
*Location:* {}    
*Date of occurrence:*  {}
*Time of occurrence:* {}
*Evidence clip url:* {}""".format(cam_id,alert1,location,date_of_occurrence,time_of_occurrence, video_url)

    try:
        whtsapp_client =Client(twilio_sid,twilio_auth_token)
        for num in to_ph_no:
            msg=whtsapp_client.messages.create(body=body,from_="whatsapp:"+from_ph_no,to="whatsapp:"+num, media_url=image_url)
        #print(msg)
        return "success"
    except :
        logger.error("Exception occurred at **** dal / send_whatsapp / send_whatsapp_function **** \n", exc_info=True)
        return 'failed'


def send_sms(cam_dict,alert_dict,sms_dict):
    return "failed"

def send_message(alert_dict, a):
    phone_json_query = {'db_name': 'raven', 'collection_table_name': twilio_collection, 'condition': None}
    resp = requests.post('{}/get_data'.format(dal_url), json=phone_json_query)
    phone_dict = resp.json()['result'][0]
    for _ in range(retry_limit):
        # json_query = {'db_name': 'raven', 'collection_table_name': camera_collection,
        #               'condition': "cam_name='%s'"%alert_dict['cam_name']}
        # resp = requests.post('{}/get_data'.format(dal_url), json=json_query)
        # resp = resp.json()
        # if resp['status'] == 1:
            # print(resp['result'])
            # status = send_whtsapp(cam_dict=resp['result'][0], alert_dict=alert_dict, whtsapp_dict=phone_dict)
        status = send_whtsapp(alert_dict=alert_dict, whtsapp_dict=phone_dict)
        if status == 'success':
            break
        # elif len(resp['result']) == 0:
            # break
        # time.sleep(10)

