import logging
import shlex
import subprocess
import time
from config.config import *
import paho.mqtt.client as paho
import random
from paho.mqtt import client as mqtt_client


logger= logging.getLogger(__name__)

retry_limit_mqtt=3

# broker = '192.168.1.6'
# port = 30004
#topic = "administrator"
client_id = f'python-mqtt-{random.randint(0, 1000)}'

def connect_mqtt():
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            pass
        else:
            print("Failed to connect, return code %d\n", rc)

    client = mqtt_client.Client(client_id)
    client.on_connect = on_connect
    client.connect(broker, port,120)
    return client   




class MQTT:
    def __init__(self, broker_ip, port):
        self.broker_ip = broker_ip
        self.port = port
        self.client = None

     

    def publish_to_staff(self, data, user):
        try:
            for u in user:
                client = connect_mqtt()
                client.loop_start()
                client.reconnect_delay_set(min_delay=1, max_delay=60)
                publish_data=client.publish(u, str(data))
                if publish_data[0]==0:
                    pass
                else:
                    print("mqtt failed --------> retrying now")
                    for i in range(retry_limit_mqtt):
                        client = connect_mqtt()
                        client.loop_start()
                        client.reconnect_delay_set(min_delay=1, max_delay=60)
                        publish_data=client.publish(u, str(data))
                        if publish_data[0]==0:
                            break
                        else:
                            pass    
                    
        except:
            logger.error("Exception occurred at **** dal / mqtt_client / publish_to_staff_function **** \n", exc_info=True)
            return 0








# class MQTT:
#     def __init__(self, broker_ip, port):
#         self.broker_ip = broker_ip
#         self.port = port
#         self.client = None

#     def connect(self):
#         pid = subprocess.Popen(shlex.split('service mosquitto start'))
#         time.sleep(10)
#         self.client = paho.Client("client-socks", transport='websockets')

#         self.client.connect_async(self.broker_ip, self.port,keepalive=300)
#         self.client.loop_start()

#     def publish(self, data):
#         try:
#             self.client.connect_async(self.broker_ip, self.port,keepalive=300)
#             self.client.loop_start()
#             publish_data=self.client.publish(data['cam_name'], str(data))
#             if publish_data[0]==0:
#                 pass
#             else:
#                 print("mqtt failed --------> retrying now")
#                 for i in range(retry_limit_mqtt):
#                     self.client.connect_async(self.broker_ip, self.port,keepalive=300)
#                     self.client.loop_start()
#                     publish_data=self.client.publish(data['cam_name'], str(data))
#                     if publish_data[0]==0:
#                         break
#                     else:
#                         pass    
#                 
            
#         except :
#             logger.error("Exception occurred at **** dal / mqtt_client / publish_function **** \n", exc_info=True)
#             return 0

#     def publish_to_user(self, data):
#         try:
#             self.client.connect_async(self.broker_ip, self.port,keepalive=300)
#             self.client.loop_start()
#             publish_data=self.client.publish('get_alerts',str(data))
#             if publish_data[0]==0:
#                 pass
#             else:
#                 print("mqtt failed --------> retrying now")
#                 for i in range(retry_limit_mqtt):
#                     self.client.connect_async(self.broker_ip, self.port,keepalive=300)
#                     self.client.loop_start()
#                     publish_data=self.client.publish('get_alerts',str(data))
#                     if publish_data[0]==0:
#                         break
#                     else:
#                         pass    
#                 return 1
#         except:
#             logger.error("Exception occurred at **** dal / mqtt_client / publish_to_user_function **** \n", exc_info=True)
#             return 0

#     def publish_to_staff(self, data, user):
#         try:
#             for u in user:
#                 self.client.connect_async(self.broker_ip, self.port,keepalive=300)
#                 self.client.loop_start()
#                 publish_data=self.client.publish(u, str(data))
#                 if publish_data[0]==0:
#                     pass
#                 else:
#                     print("mqtt failed --------> retrying now")
#                     for i in range(retry_limit_mqtt):
#                         self.client.connect_async(self.broker_ip, self.port,keepalive=300)
#                         self.client.loop_start()
#                         publish_data=self.client.publish(u, str(data))
#                         if publish_data[0]==0:
#                             break
#                         else:
#                             pass    
#                     
#         except:
#             logger.error("Exception occurred at **** dal / mqtt_client / publish_to_staff_function **** \n", exc_info=True)
#             return 0