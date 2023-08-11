import base64
import binascii
import hashlib
import secrets
import logging
import os
import traceback
from datetime import datetime, timedelta
import re
import cv2
import requests
from config.config import *
from pytz import timezone
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon

logger= logging.getLogger(__name__)


tz = timezone(time_zone)


def decode_key(cipher_key, k1, k2, key3, key4, key):
    import base64

    from cryptography.fernet import Fernet
    from secretpy import Caesar

    L = dict(zip("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", range(52)))
    I = dict(zip(range(52), "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"))
    key1 = 32
    try:
        if cipher_key[0] != 'a' and cipher_key[-1] != 'a':
            return 0
        cipher_key = cipher_key[1:-1]
        base64_bytes = cipher_key.encode('ascii')
        decoded_key_bytes = base64.b64decode(base64_bytes)
        cipher = Fernet(k1)
        plaintext = cipher.decrypt(decoded_key_bytes)
        cipher = Fernet(k2)
        plaintext = cipher.decrypt(plaintext)
        plaintext = plaintext.decode('ascii')

        for key in key3:
            base64_bytes = plaintext.encode('ascii')
            decoded_key_bytes = base64.b64decode(base64_bytes)
            decoded_key = decoded_key_bytes.decode('ascii')
            ciphertext = decoded_key[-1 * int(len(decoded_key) / 2):] + decoded_key[:-1 * int(len(decoded_key) / 2)]
            plaintext = ""
            for c in ciphertext:
                if c.isalpha():
                    plaintext += I[(L[c] - key) % 52]
                else:
                    plaintext += c
            base64_bytes = plaintext.encode('ascii')
            decoded_key_bytes = base64.b64decode(base64_bytes)
            decoded_key = decoded_key_bytes.decode('ascii')
            plaintext = decoded_key

        for key in key4:
            plaintext = ""
            for c in decoded_key:
                if c.isalpha():
                    plaintext += I[(L[c] - key) % 52]
                else:
                    plaintext += c
            decoded_key = plaintext

        try:
            num_cameras = int(decoded_key.split('_')[-1])
        except:
            logger.error("Exception occurred at **** event_app / utils / decode_key_function **** \n", exc_info=True)
            num_cameras = 0
    except:
        logger.error("Exception occurred at **** event_app / utils / decode_key_function **** \n", exc_info=True)
        return 0

    return num_cameras

def decode(cipher_key, k1, k2, key3, key4, key):
    import base64

    from cryptography.fernet import Fernet
    from secretpy import Caesar

    L = dict(zip("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", range(52)))
    I = dict(zip(range(52), "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"))
    key1 = 32
    try:
        if cipher_key[0] != 'a' and cipher_key[-1] != 'a':
            return 0
        cipher_key = cipher_key[1:-1]
        base64_bytes = cipher_key.encode('ascii')
        decoded_key_bytes = base64.b64decode(base64_bytes)
        cipher = Fernet(k1)
        plaintext = cipher.decrypt(decoded_key_bytes)
        cipher = Fernet(k2)
        plaintext = cipher.decrypt(plaintext)
        plaintext = plaintext.decode('ascii')

        for key in key4:
            base64_bytes = plaintext.encode('ascii')
            decoded_key_bytes = base64.b64decode(base64_bytes)
            decoded_key = decoded_key_bytes.decode('ascii')
            ciphertext = decoded_key[-1 * int(len(decoded_key) / 2):] + decoded_key[:-1 * int(len(decoded_key) / 2)]
            plaintext = ""
            for c in ciphertext:
                if c.isalpha():
                    plaintext += I[(L[c] - key) % 52]
                else:
                    plaintext += c
            base64_bytes = plaintext.encode('ascii')
            decoded_key_bytes = base64.b64decode(base64_bytes)
            decoded_key = decoded_key_bytes.decode('ascii')
            plaintext = decoded_key

        for key in key3:
            plaintext = ""
            for c in decoded_key:
                if c.isalpha():
                    plaintext += I[(L[c] - key) % 52]
                else:
                    plaintext += c
            decoded_key = plaintext

        try:
            num_cameras = int(decoded_key.split('_')[-1])
        except:
            logger.error("Exception occurred at **** event_app / utils / decode_function **** \n", exc_info=True)
            num_cameras = 0
    except:
        logger.error("Exception occurred at **** event_app / utils / decode_function **** \n", exc_info=True)
        return 0

    return num_cameras

def license_key_verify():
    try:
        json_query={'db_name':db_name,'collection_table_name': camera_collection,'condition':"cam_status='%s'"%'live'}
        no_live_cams=requests.post('{}/count_data'.format(dal_url),json=json_query).json()['result']
        #no_live_cams = request.json['live_cams']
        
        json_query = {'db_name':db_name,'collection_table_name': license_collection,'condition':None}
        license = requests.post('{}/list_data'.format(dal_url),json=json_query)
        
        try:
            license_key = license.json()['result'][0]['license_key']
        except:
            logger.error("Exception occurred at **** event_app / license_key_verify_function **** \n", exc_info=True)
            return 0 , "license not added"
        
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
        if no_live_cams >= num_acc_cam:
            return 0 ,"camera limit exceed"
        return 1, "success"
    except:
        logger.error("Exception occurred at **** event_app / license_key_verify_function **** \n", exc_info=True)
        return 0 ,"failed to verify license"

def validate_license_key(license_key):
    try:
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
        if num_acc_cam==0:
            return 0
        return 1
    except:
        logger.error("Exception occurred at **** event_app / validate_license_key_function **** \n", exc_info=True)
        return 1


        


def get_base_center(bbox):
    return int((int(bbox[0]) + int(bbox[2])) / 2), int((int(bbox[3]) + int(bbox[3])) / 2)


def base_in_roi(boundary, base):
    count = 0
    (x1, y1), (x2, y2) = boundary
    (x, y), (a, b) = base
    if x1 < x < x2 and y1 < y < y2:
        count += 1
    if x1 < a < x2 and y1 < b < y2:
        count += 1
    if count == 2:
        return True


def base_center_in_roi(boundary, base_center):
    point = Point(base_center)
    for cords in boundary:
        try:     
            curr_region = eval(boundary[cords])
        except:
            logger.error("Exception occurred at **** event_app / utils / base_center_in_roi_function **** \n", exc_info=True)
            curr_region = boundary[cords]
        polygon = Polygon(curr_region)
        result = polygon.contains(point)
        if result:
            return True


def get_centroid(bbox):
    x1, y1, x2, y2 = bbox
    center = (x1 + x2) / 2, (y1 + y2) / 2
    return center

"""
def generate_alert_dict(airport_name, terminal, stand_type, aircraft_stand, cam_name,alert_id,\
                       alert,flight_id='',alert_url='', alert_status='completed', flight_status='',\
                       start_frame=0, end_frame=0, frame_diff=0, thumbnail=''):
    alert_dict = dict()
    alert_dict["flight_id"] = flight_id
    alert_dict["alert_id"] = alert_id
    alert_dict["alert_name"] = alert
    alert_dict["alert_url"] = alert_url
    alert_dict["alert_time"] = (datetime.now(tz)).strftime('%A %d %B %Y %X')
    alert_dict["cam_name"] = cam_name
    alert_dict["stand_type"] = stand_type
    alert_dict["airport"] = airport_name
    alert_dict["aircraft_stand"] = aircraft_stand
    alert_dict["terminal"] = terminal
    alert_dict["alert_status"] = alert_status
    alert_dict["flight_status"] = flight_status
    alert_dict["start_frame"] = start_frame
    alert_dict["end_frame"] = end_frame
    alert_dict["frame_diff"] = frame_diff
    alert_dict["thumbnail"] = thumbnail
    alert_dict['notif_sent'] = 'N'
    return alert_dict
"""

def generate_alert_dict(frame, state, city_name, location, cam_name,
                        alert_id, alert_url,
                        start_frame, thumbnail, alert_status, alert_1='', alert_2=''):
    try:
        cv2.imwrite(PATH_TO_SAVE + '/' + thumbnail, frame)
    except :
        logger.error("Exception occurred at **** event_app / utils / generate_alert_dict_function **** \n", exc_info=True)
        pass
    alert_dict = dict()
    alert_dict['cam_name'] = cam_name
    alert_dict['state'] = state
    alert_dict['city'] = city_name
    alert_dict['location'] = location
    # alert_dict['area'] = area
    alert_dict['alert_id'] = alert_id
    alert_dict['start_frame'] = start_frame
    alert_dict['end_frame'] = start_frame
    frame_diff = abs(alert_dict['end_frame'] - alert_dict['start_frame'])
    alert_dict['frame_diff'] = frame_diff
    alert_dict['alert_1'] = alert_1
    alert_dict['alert_2'] = alert_2
    alert_dict['thumbnail'] = thumbnail
    alert_dict['video'] = alert_url
    alert_dict['verified'] = 'unverified'
    alert_dict['alert_date'] = (datetime.now(tz)).strftime('%Y-%m-%d')
    alert_dict['date'] = date = (datetime.now(tz)).strftime('%d/%m/%y %H:%M:%S')
    alert_dict['alert_status'] = alert_status
    alert_dict['assigned_to'] = ''
    json_query={'db_name':db_name,'collection_table_name': priority_collection,'condition':"alert_name='%s'"%(alert_1)}
    priority = requests.post('{}/list_data'.format(dal_url),json=json_query).json()
    if len(priority['result']) != 0:
        alert_dict['priority'] = priority['result'][0]['priority']
    else:
        alert_dict['priority'] = default_priority_list[0]
    alert_dict['video_status'] = ''
    alert_dict['mqtt_notif_sent'] = 'N'
    alert_dict['send_notif_flag'] = prod_flag
    alert_dict['read_flag'] = 'N'
    return alert_dict

def generate_cam_dict(account_id,user_name,atm_id,cam_name,cam_url,state,city,location,pincode,email, cam_type):
    cam_info_dict = dict()
    cam_info_dict['account_id'] = account_id
    cam_info_dict['user_name'] = user_name
    #cam_info_dict['atm_id'] = atm_id
    cam_info_dict['user_email'] = email
    cam_info_dict['cam_name'] = cam_name
    cam_info_dict['cam_url'] = cam_url.replace(' ', '')
    cam_info_dict['state'] = state
    cam_info_dict['city'] = city
    cam_info_dict['location'] = location.replace('{','').replace('}','')
    cam_info_dict['pincode'] = pincode
    cam_info_dict['cam_add_time'] = date = (datetime.now(tz)).strftime('%d/%m/%y %H:%M:%S')
    cam_info_dict['cam_delete_time'] = ''
    cam_info_dict['cam_status'] = 'live'
    cam_info_dict['stream_status'] = 'connecting'
    cam_info_dict['cam_input_url'] = cam_info_dict['cam_url']
    cam_info_dict['type'] = cam_type
    # cam_info_dict['breach_image'] = data['breach_image']

    cam_info_dict['cam_output_url'] = 'http://'+ domain_name +'/nginx/hls/'+cam_info_dict['cam_name'] + '/manifest.m3u8' 
    cam_info_dict['alert_array'] = []

    try:
        cap = cv2.VideoCapture(cam_url)
        _, frame = cap.read()
        frame = cv2.resize(frame, (352, 288))
        path = PATH_TO_SAVE + '/' + 'atm_cam_thumb'
        atm_thumb_name = atm_id + '_'  + cam_name +'.jpg'
        if not os.path.exists(path):
            os.makedirs(path) 
        thumbnail_file = path + '/'+ atm_thumb_name
        try:
            cv2.imwrite(thumbnail_file, frame)
            with open(thumbnail_file, "rb") as f:
                thu_bytes = f.read()        
            thu_b64 = base64.b64encode(thu_bytes).decode("utf8")

            json_query = {'db_name':db_name, 'collection_table_name': user_collection, 'condition': None}
            userdata = requests.post('{}/list_data'.format(dal_url),json=json_query)
            userdata = userdata.json()['result'][0]
            #token = get_global_token(userdata['username'], userdata['password'])
            
            cam_info_dict['atm_cam_thumb'] = 'atm_cam_thumb/' + atm_thumb_name
            json_query={'thumbnail':thu_b64, 'thumbnail_name': atm_thumb_name}
            #resp=requests.post('{}/upload_thumbnail?token={}'.format(global_app_url, token),json=json_query)
        except:
            logger.error("Exception occurred at **** event_app / utils / generate_cam_dict_function **** \n", exc_info=True)
    except :
        logger.error("Exception occurred at **** event_app / utils / generate_cam_dict_function **** \n", exc_info=True)
        cam_info_dict['atm_cam_thumb'] = ''
    return cam_info_dict

def modify_cam_dict(cam_name,pincode, cam_input_url,alert_arr,intrusion_breach_coordinates,loitering_breach_coordinates,
                    authorised_vehicle_breach_coordinates,stevedore_breach_coordinates,intrusion_from_time,intrusion_to_time, dist_ref_coordinates, dist_ref, speed_limit, drone_breach_coordinates,
                    crowd_breach_coordinates, unattended_station_breach_coordinates,unattended_station_from_time, unattended_station_to_time,wall_jump_breach_coordinates,wall_jump_from_time,wall_jump_to_time, crawling_breach_coordinates, loitering_duration, unattended_station_duration, overcrowd_person_count):
    cam_info_dict = dict()
    cam_info_dict['cam_name'] = cam_name
    cam_info_dict['pincode'] = pincode
    cam_info_dict['cam_input_url'] = cam_input_url
    cam_info_dict['alert_array'] = alert_arr.copy()
    for i in range(len(alert_arr)):
        if 'detection' not in alert_arr[i].lower() and 'violation' not in alert_arr[i].lower():
            alert_arr[i] = alert_arr[i].lower() + ' detection'
    for i in alert_array:
        if i.lower() in alert_arr:
            cam_info_dict[i.lower().replace(' ','_') + '_flag'] = 1
        else:
            cam_info_dict[i.lower().replace(' ','_') + '_flag'] = 0
    cam_info_dict['intrusion_breach_coordinates'] = intrusion_breach_coordinates
    cam_info_dict['crawling_breach_coordinates'] = crawling_breach_coordinates
    cam_info_dict['loitering_breach_coordinates'] = loitering_breach_coordinates
    cam_info_dict['wall_jump_breach_coordinates'] = wall_jump_breach_coordinates
    #cam_info_dict['p_o_i_breach_coordinates'] = authorised_entry_breach_coordinates
    cam_info_dict['authorised_vehicle_breach_coordinates'] = authorised_vehicle_breach_coordinates
    #cam_info_dict['n_o_n_p_o_i_breach_coordinates'] = unauthorised_entry_breach_coordinates
    cam_info_dict['stevedore_breach_coordinates'] = stevedore_breach_coordinates
    cam_info_dict['intrusion_from_time'] = intrusion_from_time
    cam_info_dict['intrusion_to_time'] = intrusion_to_time
    cam_info_dict['wall_jump_from_time'] = wall_jump_from_time
    cam_info_dict['wall_jump_to_time'] = wall_jump_to_time
    cam_info_dict['drone_breach_coordinates'] = drone_breach_coordinates
    cam_info_dict['crowd_breach_coordinates'] = crowd_breach_coordinates
    cam_info_dict['unattended_station_breach_coordinates'] = unattended_station_breach_coordinates
    cam_info_dict['unattended_station_from_time'] = unattended_station_from_time
    cam_info_dict['unattended_station_to_time'] = unattended_station_to_time
    cam_info_dict["loitering_duration"] = loitering_duration
    cam_info_dict["unattended_station_duration"] = unattended_station_duration
    cam_info_dict["overcrowd_person_count"] = overcrowd_person_count
    
    if dist_ref_coordinates:
        cam_info_dict['dist_ref_coordinates'] = dist_ref_coordinates
        cam_info_dict['dist_ref'] = dist_ref
        cam_info_dict['speed_limit'] = speed_limit
    
    return cam_info_dict  

def parking_location_clear(frame, detections, class_ids, peri_cords):
    centers = []
    clear_flag = []
    for ind, (det, class_id) in enumerate(zip(detections, class_ids)):
        bbox = det
        center = get_centroid(list(bbox))
        centers.append(center)
        base_center = get_base_center(bbox)
        breach = base_center_in_roi(peri_cords, base_center)
        if breach == True:
            clear_flag.append(0)
        else:
            clear_flag.append(1)
    try:
        return min(clear_flag)
    except:
        logger.error("Exception occurred at **** event_app / utils / parking_location_clear_function **** \n", exc_info=True)
        return 1


def searchTextinDB(p,date,value,start,length,verified,user_name):
    # if user_status!='administrator':
    '''
    The function matches the search queries in the DB and returns the entries
    Parameters:
        p: alert priority
        date: current date in "YYYY-MM-DD"
        value: search string
        start: page number as received from frontend
        length: number of fetched entries. 
        qrt_frontend status: {"$ne":"resolved"} / "resolved"
        user_name: staff user email 
    
    returns:
        Mongo queries of userbased alerts and count
    '''
    MatchPipe = {"verified":verified,
                 "priority": p,
                 "alert_date":date,
                 "assigned_to":user_name,    
                "$or": [
                {"alert_1": {"$regex": value, "$options": "i"}},
                {"alert_2": {"$regex": value, "$options": "i"}},
                {"alert_id": {"$regex": value, "$options": "i"}},
                {"state": {"$regex": value, "$options": "i"}},
                {"city": {"$regex": value, "$options": "i"}},
                {"location": {"$regex": value, "$options": "i"}},
                {"atm_id": {"$regex": value, "$options": "i"}},
                {"cam_name": {"$regex": value, "$options": "i"}},
                {"verified": {"$regex": value, "$options": "i"}},
                            ]
                        }

    AddPipe= { "fullyear": 
                    {"$concat":[
                            {"$arrayElemAt": [{"$split":["$date","/"]},0]},"/",
                            {"$arrayElemAt": [{"$split":["$date","/"]},1]},"/",
                            "20",{"$arrayElemAt": [{"$split":["$date","/"]},2]}]
                        }
                }
    ProjectPipe =  {"fulldate": {"$dateFromString": {"dateString": "$fullyear","format":"%%d/%%m/%%Y %%H:%%M:%%S"}
                                    },"poi_details":1,"voi_details" :1,"number_plate":1,"state":1,"alert_1":1, "alert_2":1, "verified":1, "qrt_frontend_status":1, "alert_id":1, "helpdesk_resolved_status":1, "qrt_flag":1, "verified":1, "ticket_raised_flag":1, "comment":1, "qrt_flag_time":1, "qrt_details":1, "qrt_name":1, "qrt_email":1, "read_flag":1, "atm_id":1, "cam_name":1, "location":1, "date":1,"alert_date":1, "city":1, "priority":1, "video":1,"assigned_to":1,"_id":0,"rounder_details":1
                        }
                    
    LookupPipe1 = {
         "from": "atm_details",
         "localField": "atm_id",   
         "foreignField": "atm_id",
         "as": "rounder_details"
      }
    
    LookupPipe2 = {
         "from": "atm_details",
         "localField": "atm_id",   
         "foreignField": "atm_id",
         "as": "vendor"
      }

    LookupPipe3 = {
            "from": "qrt", 
            "localField": "qrt_email", 
            "foreignField": "user_email", 
            "as": "qrt_number"
        }

    LookupPipe4 = {
        "from": "qrt", 
        "localField": "atm_id", 
        "foreignField": "atm_id", 
        "as": "qrt_default_name"
    }
    
    LookupPipe5 = {
            "from": "qrt", 
            "localField": "atm_id", 
            "foreignField": "atm_id", 
            "as": "qrt_default_number"
        }
    # RootPipe = { "newRoot": { "$mergeObjects": [ { "$arrayElemAt": [ "$fromItems", 0 ] }, "$$ROOT" ] } }

    SearchPipe = [
            { "$match": MatchPipe },
            { "$addFields":AddPipe },
            { "$project": ProjectPipe },
            { "$sort" : { "fulldate" : -1 } },
            { "$skip": start },
            { "$limit": length },
            { "$lookup": LookupPipe1 }, { "$set": {"rounder_details": { "$arrayElemAt": ["$rounder_details.rounder_details", 0]}} },
            { "$lookup": LookupPipe2 }, { "$set": {"vendor": { "$arrayElemAt": ["$vendor.vendor", 0]}} },
            { "$lookup": LookupPipe3 }, { "$set": {"qrt_number": { "$arrayElemAt": ["$qrt_number.mobile_number", 0]}} },
            { "$lookup": LookupPipe4 }, { "$set": {"qrt_default_name": { "$arrayElemAt": ["$qrt_default_name.name", 0]}} },
            { "$lookup": LookupPipe5 }, { "$set": {"qrt_default_number": { "$arrayElemAt": ["$qrt_default_number.mobile_number", 0]}} }
        ]
    
    Countcond = "db['%s'].count_documents({})".format(MatchPipe)
    Matchcond = "db['%s'].aggregate({},allowDiskUse=True)".format(SearchPipe)

    return Countcond,Matchcond

def getHelpdeskAlertQuery(qrtFrontendStatus,priority,member,start=0,length=realtimeAlertLimit,date={"$ne":"nullDate"}):
    # qrtFrontendStatus={"$ne":"resolved"}
    # qrtFrontendStatus = "pending"

    # member={"$ne":"nullUser"}
    # member = "<user>"

    '''
    The function matches the search queries in the DB and returns the entries
    Parameters:
        priority: alert priority
        start: page number as received from frontend
        length: number of fetched entries. 
        qrt_frontend status: {"$ne":"resolved"} / "resolved"
        member: staff user email 
    
    returns:
        Mongo queries of userbased alerts and count
    '''
    #search over the alerts of last 10 days
    if date=={"$ne":"nullDate"}:
        date_arr = [(datetime.now()-timedelta(days=i)).strftime('%Y-%m-%d') for i in range(2)]
        MatchPipe = {"verified":qrtFrontendStatus,"priority":priority,"alert_date":{"$in":date_arr},"assigned_to":member}
    else:
        MatchPipe = {"verified":qrtFrontendStatus,"priority":priority,"alert_date":date,"assigned_to":member}

    AddPipe = { "fullyear": 
                    {"$concat":[
                            {"$arrayElemAt": [{"$split":["$date","/"]},0]},"/",
                            {"$arrayElemAt": [{"$split":["$date","/"]},1]},"/",
                            "20",{"$arrayElemAt": [{"$split":["$date","/"]},2]}]
                        }
            }
    ProjectPipe = {"fulldate": {"$dateFromString": {"dateString": "$date","format":"%%d/%%m/%%Y %%H:%%M:%%S"}
                                    },"poi_details":1,"voi_details" :1,"number_plate":1,"state":1,"alert_1":1, "alert_2":1, "verified":1, "qrt_frontend_status":1, "alert_id":1, "helpdesk_resolved_status":1, "qrt_flag":1, "verified":1, "ticket_raised_flag":1, "comment":1, "qrt_flag_time":1, "qrt_details":1, "qrt_name":1, "qrt_email":1, "read_flag":1, "atm_id":1, "cam_name":1, "location":1, "date":1,"alert_date":1, "city":1, "priority":1, "video":1,"assigned_to":1,"_id":0
                        }
    
    

    aggPipe = [
        { "$match": MatchPipe },
        #{ "$addFields": AddPipe },
        { "$project": ProjectPipe },  
        { "$sort" : { "fulldate" : -1 } },
        { "$skip": start },
        { "$limit" : length }
        ]
    cond = "db['%s'].aggregate({},allowDiskUse=True)".format(aggPipe)

    return cond


def priorityCountQuery(verified,member,date={"$ne":"nullDate"}):
    """
    group by priority and return the priority count
    """
    if date=={"$ne":"nullDate"}:
        date_arr = [(datetime.now()-timedelta(days=i)).strftime('%Y-%m-%d') for i in range(2)]
        aggPipe = [
                { "$match": { "verified":verified,"alert_date":{"$in":date_arr},"assigned_to": member} },
                { "$group": { "_id": "$priority", "count": {"$sum": 1}} },
                { "$sort": { "_id": 1} }
                        ]

    else:
        aggPipe = [
            { "$match": { "verified":verified, "alert_date": date, "assigned_to": member} },
            { "$group": { "_id": "$priority", "count": {"$sum": 1}} },
            { "$sort": { "_id": 1} }
                    ]                    
    cond = "db['%s'].aggregate({}, allowDiskUse=True)".format(aggPipe)
    return cond


def getAlerts(alert_status,user_name,date,p,start,length,user_status,value=None):
    '''
    The function returns the userwise alert list
    Parameters:
        user_status: administrator/support
        p: alert priority
        date: current date in "YYYY-MM-DD"
        start: page number as received from frontend
        length: number of fetched entries. 
        qrt_frontend status: {"$ne":"resolved"} / "resolved"
        user_name: staff user email 
        value: search string
    
    returns:
        user_date_wise_alerts, alert count , user_data, prioritywise_alert_count
    '''
    # if user_status != 'administrator':
    #     if alert_status == 'pending':
        
    #         if value and not value.isspace():
    #             Countcond,Matchcond = searchTextinDB(p,date,value,start,length,{"$ne":"resolved"},user_name)
    #         else:
    #             date_wise_alerts = getHelpdeskAlertQuery({"$ne":"resolved"},p,user_name,start=start,length=length,date=date)
    #         cond = priorityCountQuery({"$ne": "resolved"},user_name,date)

    #     else:# elif data['alert_status']=='resolved':
                    
    #         if value and not value.isspace():
    #             Countcond,Matchcond = searchTextinDB(p,date,value,start,length,'resolved',user_name)
    #         else:
    #             date_wise_alerts = getHelpdeskAlertQuery("resolved",p,user_name,start=start,length=length,date=date)
    #         cond = priorityCountQuery("resolved",user_name,date)
    # else:
    if alert_status == 'pending':
        if value and not value.isspace():
            Countcond,Matchcond = searchTextinDB(p,date,value,start,length,{"$eq": "unverified"},{"$ne":"nullUser"})
        else:
            date_wise_alerts = getHelpdeskAlertQuery({"$eq": "unverified"},p,{"$ne":"nullUser"},start=start,length=length,date=date)
        cond = priorityCountQuery({"$eq": "unverified"},{"$ne":"nullUser"},date) 
    elif alert_status =='resolved':
        if value and not value.isspace():
            if user_status in ["administrator","support","security"]:
                Countcond,Matchcond = searchTextinDB(p,date,value,start,length,{"$ne": "false"},{"$ne":"nullUser"})
            else:
                Countcond,Matchcond = searchTextinDB(p,date,value,start,length,{"$ne": "unverified"},{"$ne":"nullUser"})
        else:
            if user_status in ["administrator","support","security"]:
                date_wise_alerts = getHelpdeskAlertQuery({"$ne":"false"},p,{"$ne":"nullUser"},start=start,length=length,date=date)
            else:
                date_wise_alerts = getHelpdeskAlertQuery({"$ne":"unverified"},p,{"$ne":"nullUser"},start=start,length=length,date=date)
        
        if user_status in ["administrator","support","security"]:
            cond = priorityCountQuery({"$ne": "false"},{"$ne":"nullUser"},date)
        else:
            cond = priorityCountQuery({"$ne": "unverified"},{"$ne":"nullUser"},date)

    # user_date_wise_alerts.reverse()
    if value and not value.isspace():
        json_query_search={'db_name':db_name,'collection_table_name': alert_collection,'condition':Matchcond}
        user_date_wise_alerts = requests.post('{}/custom_query'.format(dal_url),json=json_query_search).json()['result']
        json_query_count={'db_name':db_name,'collection_table_name': alert_collection,'condition':Countcond}
        resp_count = requests.post('{}/custom_query'.format(dal_url),json=json_query_count).json()['result']
    else:
        json_query_user = {'db_name':db_name,'collection_table_name': alert_collection,'condition':date_wise_alerts}
        user_date_wise_alerts=requests.post('{}/custom_query'.format(dal_url),json=json_query_user).json()['result']
        resp_count = len(user_date_wise_alerts)

    prioritywise_alert_count = {p:0 for i, p in enumerate(default_priority_list)} 

    json_query_priority={'db_name':db_name,'collection_table_name': alert_collection,'condition':cond}
    prioity_count = requests.post('{}/custom_query'.format(dal_url),json=json_query_priority).json()['result']

    for p in prioity_count:
        prioritywise_alert_count[p['_id']] = p['count']

    json_query_user={'db_name':db_name,'collection_table_name': user_collection,'condition':"username='%s'"%(user_name)}
    user_data=requests.post('{}/list_data'.format(dal_url),json=json_query_user).json()['result'][0]
    return user_date_wise_alerts,resp_count, user_data, prioritywise_alert_count


def check_special_characters(cam_name):
    special_char = re.compile('[@_!#$%^&*()<>?/\|}{~:]')
    if(special_char.search(cam_name) == None):
        pass
    else:
        chars=special_char.findall(cam_name)
        replace_special_chars = re.subn(f"{chars}",'-',cam_name)
        cam_name=replace_special_chars[0]

    return cam_name

############################Password Hashing###############################
def check_passhash(password, cajun, passhash):
    '''
    Checks if password provided associates with the passhash in db.
    Arguments:
        password: String provided paswword
        cajun: bytes base64 encoded salt
        passhash: String hex digest of encrypted password
    Returns:
        bool: True if (password is correct) else false
    '''
    salt = base64.b64decode(bytes(cajun, 'utf-8')).decode('utf-8')
    input_passhash = hashlib.sha256((password + salt).encode()).hexdigest()
    return input_passhash == passhash

def generate_cajun(password):
    '''
    Generates salt and passhash for given password
    Arguments:
        password: String user provided password
    Returns:
        cajun: bytes base64 encoded salt
        passhash:  String hex digest of encrypted password
    '''

    salt = binascii.b2a_uu(secrets.token_bytes(8))[:-2]
    cajun = (base64.b64encode(salt)).decode('utf-8')
    passhash = hashlib.sha256((password + salt.decode('utf-8')).encode()).hexdigest()

    return cajun, passhash