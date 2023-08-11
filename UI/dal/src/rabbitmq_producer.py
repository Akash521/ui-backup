import logging
import shlex
import subprocess
import time
import threading
import pika
from config.config import *

logger = logging.getLogger(__name__)


class RabbitMQ:
    def __init__(self, host, port):
        self.connection = None
        self.channel = None
        self.host = host
        self.port = port

    def create_connection(self):
        # Establish a connection to RabbitMQ
        usr_pwd = pika.PlainCredentials('admin', 'Pivo8Chain@123')
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(host=self.host, port=self.port,
                                                                            credentials=usr_pwd, socket_timeout=50,
                                                                            heartbeat=50))

        return self.connection

    def reconnect(self):
        while True:
            try:
                connection = self.create_connection()
                break
            except:
                # If the connection fails, wait a short period of time before trying again
                #time.sleep(0.40)
                print('-----Trying to reconnect-----')
        return connection

    def connect(self):
        try:
            usr_pwd = pika.PlainCredentials('admin', 'Pivo8Chain@123')
            self.connection = pika.BlockingConnection(pika.ConnectionParameters(host=self.host, port=self.port,
                                                                                credentials=usr_pwd, socket_timeout=50,heartbeat=50))
                                                                        
            self.channel = self.connection.channel()
            self.channel.confirm_delivery()
            print('-----RabbitMQ Connected-----')
        except:
            usr_pwd = pika.PlainCredentials('admin', 'Pivo8Chain@123')
            self.connection = pika.BlockingConnection(pika.ConnectionParameters(host=self.host, port=self.port,
                                                                                credentials=usr_pwd, socket_timeout=50,heartbeat=50))
                                                                        
            self.channel = self.connection.channel()
            self.channel.confirm_delivery()
            print('-----RabbitMQ Connected-----')


    # def publish_to_staff(self, data, user):
    #     try:
    #         if self.channel.is_closed:
    #             self.connection = self.reconnect()
    #             self.channel = self.connection.channel()
    #             self.channel.confirm_delivery()
    #             print('-----RabbitMQ Reconnected-----')
                
    #         for _user in user:
    #             if self.channel.is_closed:
    #                 self.connection = self.reconnect()
    #                 self.channel = self.connection.channel()
    #                 self.channel.confirm_delivery()
    #                 print('-----RabbitMQ Reconnected-----')
    #             self.channel.exchange_declare(exchange=_user, exchange_type='fanout', durable=True)
    #             self.channel.basic_publish(exchange=_user, routing_key='', body=str(data))
    #             print(f'-----Message Published From RabbitMQ Successfully-----\n{str(data)}')
    #     except Exception as e:
    #         logger.error(f"Exception occurred at **** dal / rabbitmq_producer / publish_to_staff **** \n {e}",
    #                      exc_info=True)

    def publish_to_staff(self, data, user):
        try:
            for _user in user:
                try:
                    if self.channel.is_closed:
                        self.connection = self.reconnect()
                        self.channel = self.connection.channel()
                        self.channel.confirm_delivery()
                        print('-----RabbitMQ Reconnected-----')    
                    self.channel.exchange_declare(exchange=_user, exchange_type='fanout', durable=True)
                    self.channel.basic_publish(exchange=_user, routing_key='', body=str(data))
                    print(f'-----Message Published From RabbitMQ Successfully-----\n{str(data)}')
                except:
                    self.connection = self.reconnect()
                    self.channel = self.connection.channel()
                    self.channel.confirm_delivery()
                    self.channel.exchange_declare(exchange=_user, exchange_type='fanout', durable=True)
                    self.channel.basic_publish(exchange=_user, routing_key='', body=str(data))
                    print(f'-----Message Published From RabbitMQ Successfully-----\n{str(data)}')   
        except Exception as e:
            logger.error(f"Exception occurred at **** dal / rabbitmq_producer / publish_to_staff **** \n {e}",
                         exc_info=True)
                                             



    

