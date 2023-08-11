#hello
import copy
import logging
import os
import subprocess
#from multiprocessing import Process
import multiprocessing
import threading
#from config import *
from config.config import *
from flask import Flask, jsonify, request
from flask_cors import CORS

from dbal.dbal import RavenDB
from json_encoder import JSONEncoder
from mqtt_client import *
from user_assign import *
from rabbitmq_producer import *
# from send_mail import *
# from send_whatsapp import *

logger= logging.getLogger(__name__)


app = Flask(__name__)
CORS(app)

raven_db = RavenDB(db_type)
raven_db.connect()

# mqtt = MQTT(mqtt_broker_ip, mqtt_port)
# mqtt.connect()

rabbitmq = RabbitMQ(host=broker, port='31006')
rabbitmq.connect()


@app.route("/ping", methods=['GET'])
def ping():
    return jsonify({'ping': 'pong'})


@app.route("/insert_data", methods=['POST'])
def insert():
    try:
        data = request.json
        data_mqtt = copy.deepcopy(data)
        response = raven_db.insert(data=data['data'], db_name=data['db_name'],
                                   collection_table_name=data['collection_table_name'])
        status = response['status']
        try:
            if data['data']['send_notif_flag'] =='Y':
                send_notif = 1
            else:
                send_notif = 0
        except:
            logger.error("Exception occurred at **** dal / insert_function **** \n", exc_info=True)
            send_notif = 0
        if status == 1:
            try:
                if send_notif == 1:
                    data_mqtt['data']['mqtt_flag'] = 2
                    # data_pub = eval(JSONEncoder().encode(data_mqtt['data']))
                    # mqtt.publish(data=data_pub)
                    # mqtt.publish_to_user(data=data_pub)
                
                elif 'cam_name' in data_mqtt['data']:
                    data_mqtt['data']['mqtt_flag'] = 0

                user = get_staff_status()
                data_pub = eval(JSONEncoder().encode(data_mqtt['data']))
                if user:
                    if data_mqtt["data"]["alert_category"] == "VOI" or data_mqtt["data"]["alert_category"] == "NONPOI" or data_mqtt["data"]["alert_category"] == "POI":
                        #mqtt.publish_to_staff(data=data_pub, user=user)
                        rabbitmq.publish_to_staff(data=data_pub, user=user)
                        # thread = threading.Thread(target=rabbitmq.publish_to_staff, args=(data_pub,user))
                        # thread.start() 
                        # thread.join()
                        print('published to staff', user)
                    else:                
                        rabbitmq.publish_to_staff(data=data_pub, user=user)
                        # thread = threading.Thread(target=rabbitmq.publish_to_staff, args=(data_pub,user))
                        # thread.start() 
                        # thread.join()
                        print('published to staff', user)
                # send_mail_ = Process(target=send_mail, args=(data['data'], 1))
                # send_mail_.start()
                # send_whatsapp_ = Process(target=send_message, args=(data['data'], 1))
                # send_whatsapp_.start()
                #print("Data Published")
            except :
                logger.error("Exception occurred at **** dal / insert_function **** \n", exc_info=True)
                return jsonify({'status': 0})

            return jsonify({'status': 1})
        else:
            return jsonify({'status': 1})

        # if ==1:
        #     try:
        #         data_pub = eval(JSONEncoder().encode(data_mqtt['data']))
        #         mqtt.publish_to_user(data=data_pub)
        #     except:
        #         logger.error("Exception occurred at **** dal / insert_function **** \n", exc_info=True)
        #         return jsonify({'status': 0})
        #     return jsonify({'status': 1})

    except :
        logger.error("Exception occurred at **** dal / insert_function **** \n", exc_info=True)
        return jsonify({'status': 0})


@app.route("/remove_data", methods=['POST'])
def remove():
    try:
        data = request.json
        data_mqtt = copy.deepcopy(data)
        response = raven_db.remove(db_name=data['db_name'], collection_table_name=data['collection_table_name'],
                                   condition=data['condition'])
        status = response['status']
        try:
            if data['data']['send_notif_flag'] == 'Y':
                send_notif = 1
            else:
                send_notif = 0
        except:
            logger.error("Exception occurred at **** dal / remove_function **** \n", exc_info=True)
            send_notif = 0

        if status == 1:
            try:
                if 'cam_name' in data_mqtt['condition']:
                    d = data_mqtt['condition'].split("=")
                    a = {str(d[0]) : d[1].replace("'", "")}
                    a['mqtt_flag'] = 1
                    data_pub = eval(JSONEncoder().encode(a))

                else:
                    data_pub = eval(JSONEncoder().encode(data_mqtt['data'])) 

                # mqtt.publish(data=data_pub)
                user = get_staff_status()
                if user:
                    #mqtt.publish_to_staff(data=data_pub, user=user)
                    rabbitmq.publish_to_staff(data=data_pub, user=user)
                    print('published to staff', user)

                # send_mail_ = Process(target=send_mail, args=(data['data'], 1))
                # send_mail_.start()
                # send_whatsapp_ = Process(target=send_message, args=(data['data'], 1))
                # send_whatsapp_.start()
            except:
                logger.error("Exception occurred at **** dal / remove_function **** \n", exc_info=True)
                return jsonify({'status': 0})

            return jsonify({'status': 1})
        else:
            return jsonify({'status': 1})
    except :
        logger.error("Exception occurred at **** dal / remove_function **** \n", exc_info=True)
        return jsonify({'status': 0})


# @app.route("/update_data", methods=['POST'])
# def update():
#     try:
#         data = request.json
#         data_mqtt = copy.deepcopy(data)
#         response = raven_db.update(data=data['data'], db_name=data['db_name'],
#                                    collection_table_name=data['collection_table_name'], condition=data['condition'])
#         status = response['status']
#         try:
#             if data['data']['send_notif_flag'] =='Y':
#                 send_notif = 1
#             else:
#                 send_notif = 0
#         except:
#             send_notif = 0
#             logger.error("Exception occurred at **** dal / update_function **** \n", exc_info=True)
#         if status == 1 and send_notif:
#             try:
#                 data_pub = eval(JSONEncoder().encode(data_mqtt['data']))
#                 mqtt.publish(data=data_pub)
#                 #send_mail_ = Process(target=send_mail, args=(data['data'], 1))
#                 #send_mail_.start()
#                 # send_whatsapp_ = Process(target=send_message, args=(data['data'], 1))
#                 # send_whatsapp_.start()
#                 print("Data Published")
#             except :
#                 logger.error("Exception occurred at **** dal / update_function **** \n", exc_info=True)
#                 return jsonify({'status': 0})

#             return jsonify({'status': 1})
#         else:
#             return jsonify({'status': status})
#     except :
#         logger.error("Exception occurred at **** dal / update_function **** \n", exc_info=True)
#         return jsonify({'status': 0})


@app.route("/update_data", methods=['POST'])
def update():
    try:
        data = request.json
        data_mqtt = copy.deepcopy(data)
        #try:
        #    if data["data"]["verification_key"] == "true":
        #            data["data"]= {'verified': "true"}
        #except:
        #    pass

        response = raven_db.update(data=data['data'], db_name=data['db_name'], collection_table_name=data['collection_table_name'], condition=data['condition'])
        status = response['status']
        if status == 1:
            try:
                # if 'mqtt_data' in data:
                #     data_pub=data["mqtt_data"]
                #     mqtt.publish(data=data_pub)
                if 'mqtt_download_data_' in data:
                    data_pub=data["mqtt_download_data_"]
                    data_pub["mqtt_flag"]=4
                    user = get_staff_status()
                    if user:
                        #mqtt.publish_to_staff(data=data_pub, user=user)
                        rabbitmq.publish_to_staff(data=data_pub, user=user)
                        print('published to staff', user)
                    #mqtt.publish(data=data_pub)
                try:
                    user = get_staff_status()
                    if data_mqtt["data"]["verification_key"] == "true" and "cust_server" in user:
                        user = ["cust_server"]
                        data_mqtt["data"]["alert_data"]["mqtt_flag"] = 2
                        data_mqtt["data"]['alert_data']["thumbnail"] = data_mqtt["data"]['alert_data']["video"][:-4]+".jpg"
                        
                        data_pub = eval(JSONEncoder().encode(data_mqtt["data"]['alert_data'])) 
                        #mqtt.publish_to_staff(data=data_pub, user=user)
                        rabbitmq.publish_to_staff(data=data_pub, user=user)
                except:
                    pass

            except:
                logger.error("Exception occurred at **** dal / update_data **** \n", exc_info=True)
                pass        
            return jsonify({'status': 1})
        else:
            return jsonify({'status': 0})
    except:
        logger.error("Exception occurred at **** dal / update_data **** \n", exc_info=True)
        return jsonify({'status': 0})


@app.route("/get_data", methods=['POST'])
def get_data():
    try:
        data = request.json
        response = raven_db.get(db_name=data['db_name'], collection_table_name=data['collection_table_name'],
                                condition=data['condition'])
        status = response['status']
        result = response['result']
        result = eval(JSONEncoder().encode(result))
        if status == 1:
            return jsonify({'status': 1, 'result': result})
        else:
            return jsonify({'status': 0, 'result': result})
    except :
        logger.error("Exception occurred at **** dal / get_data_function **** \n", exc_info=True)
        return jsonify({'status': 0})


@app.route("/list_data", methods=['POST'])
def list_data():
    try:
        data = request.json
        response = raven_db.list(db_name=data['db_name'], collection_table_name=data['collection_table_name'],
                                 condition=data['condition'])
        status = response['status']
        result = response['result']
        result = eval(JSONEncoder().encode(result))
        if status == 1:
            return jsonify({'status': 1, 'result': result})
        else:
            return jsonify({'status': 0, 'result': result})
    except :
        logger.error("Exception occurred at **** dal / list_data_function **** \n", exc_info=True)
        return jsonify({'status': 0})


@app.route("/count_data", methods=['POST'])
def count_data():
    try:
        data = request.json
        response = raven_db.count(db_name=data['db_name'], collection_table_name=data['collection_table_name'],
                                  condition=data['condition'])
        status = response['status']
        result = response['result']
        result = eval(JSONEncoder().encode(result))
        if status == 1:
            return jsonify({'status': 1, 'result': result})
        else:
            return jsonify({'status': 0, 'result': result})
    except :
        logger.error("Exception occurred at **** dal / count_function **** \n", exc_info=True)
        return jsonify({'status': 0})


@app.route("/compose_video", methods=['POST'])
def compose_video():
    try:
        data = request.json['data']
        start_frame = max(1, data['start_frame'])
        frame_diff = max(data['frame_diff'],alert_max_frame_diff)
        frame_path = '/'.join(data['video'].split('/')[:-1])

        cmd = ['ffmpeg', '-y', '-loglevel', 'quiet', '-framerate', str(fps), '-start_number',
               str(start_frame - buffer_len), '-i',
               PATH_TO_SAVE+'/'+frame_path + '/image_%09d.jpg',
               '-vframes', str(frame_diff + buffer_len), '-c:v', 'libx264', PATH_TO_SAVE+'/'+data['video']]
        try:
            os.remove(PATH_TO_SAVE+'/'+data['video'])
        except :
            pass
        subprocess.run(cmd)

        if save_raw_video:
            raw_vid_path = data['video'].split('.')[0]+'_raw.mp4'
            cmd = ['ffmpeg', '-y', '-loglevel', 'quiet', '-framerate', str(fps), '-start_number',
               str(start_frame - buffer_len), '-i', PATH_TO_SAVE+'/'+frame_path + '/image_%09d_raw.jpg',
               '-vframes', str(frame_diff + buffer_len), '-c:v', 'libx264', PATH_TO_SAVE+'/'+raw_vid_path]
            try:
                os.remove(PATH_TO_SAVE+'/'+raw_vid_path)
            except :
                pass
            
            subprocess.run(cmd)
            if not os.path.getsize(PATH_TO_SAVE+'/'+raw_vid_path):
                try:
                    os.remove(PATH_TO_SAVE+'/'+raw_vid_path)
                except :
                    pass

        # cmd = ['scp', '-oStrictHostKeyChecking=no',  '-i', 'vm-key.pem', PATH_TO_SAVE+'/'+data['thumbnail'], PATH_TO_SAVE+'/'+data['video'], 'azureuser@137.135.113.229:/mnt/ravenfs/pivotchain/twilio']
        # subprocess.run(cmd)
        # send_whatsapp_ = Process(target=send_message, args=(data, 1))
        # send_whatsapp_.start()

        return jsonify({'status': 1})
    except :
        logger.error("Exception occurred at **** dal / dal / compose_vedio_function **** \n", exc_info=True)
        return jsonify({'status': 0})

@app.route("/get_unique_values", methods=['POST'])
def get_unique_values():
    try:
        data = request.json
        response = raven_db.get_unique_values(db_name=data['db_name'], collection_table_name=data['collection_table_name'],
                                  condition=data['condition'], field_name=data['field_name'])
        status = response['status']
        result = response['result']
        result = eval(JSONEncoder().encode(result))
        if status == 1:
            return jsonify({'status': 1, 'result': result})
        else:
            return jsonify({'status': 0, 'result': result})
    except :
        logger.error("Exception occurred at **** dal / dal / get_unique_values_function **** \n", exc_info=True)
        return jsonify({'status': 0})

@app.route("/get_person_count",methods=["POST"])
def get_person_count():
    try:
        data=request.json
        data['data']['mqtt_flag'] = 3
        data_pub = eval(JSONEncoder().encode(data['data']))
        #mqtt.publish(data=data_pub)
        user = get_staff_status()
        if user:
            #mqtt.publish_to_staff(data=data_pub, user=user)
            rabbitmq.publish_to_staff(data=data_pub, user=user)
            print('published to staff', user)
        return jsonify ({'status': 1})  
    except:
        logger.error("Exception occurred at **** dal / dal / get_person_count_function **** \n", exc_info=True)
        return jsonify ({'status': 0})

@app.route("/custom_query", methods=['POST'])
def custom_query():
    try:
        data = request.json
        
        response = raven_db.custom_query(db_name=data['db_name'], collection_table_name=data['collection_table_name'],
                                 condition=data['condition'])
        status = response['status']
        result = response['result']
        # result = eval(JSONEncoder().encode(result))
        if status == 1:
            return jsonify({'status': 1, 'result': result})
        else:
            return jsonify({'status': 0, 'result': result})
    except:
        logger.error("Exception occurred at **** dal / custom_query **** \n", exc_info=True)
        return jsonify({'status': 0})


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=4445, debug=debug)
