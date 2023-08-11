#from .sql import *
import logging

#from .ignite import *
from .config import *
from .mongo import *

logger= logging.getLogger(__name__)


class RavenDB:

    def __init__(self, db_type):
        self.raven_db = None
        if db_type == 'Mongodb':
            self.raven_db = MongoDB(config)
        elif db_type == 'MySqldb':
            self.raven_db = SqlDB(config)
        elif db_type == 'Ignitedb':
            self.raven_db = IgniteDB(config)

    def connect(self):
        try:
            self.raven_db.connect()
            return {'status': 1}
        except Exception as e:
            logger.error("Exception occurred at **** dal / dbal / connect_function **** \n", exc_info=True)
            return {'status': 0}

    def disconnect(self):
        try:
            self.raven_db.disconnect()
            return {'status': 1}
        except :
             logger.error("Exception occurred at **** dal / dbal / disconnect_function **** \n", exc_info=True)
             return {'status': 0}

    def insert(self, data, db_name, collection_table_name):
        try:
            self.raven_db.insert(data=data, db_name=db_name, collection_table_name=collection_table_name)
            return {'status': 1}
        except :
            logger.error("Exception occurred at **** dal / dbal / insert_function **** \n", exc_info=True)
            return {'status': 0}

    def remove(self, db_name, collection_table_name, condition=None):
        try:
            self.raven_db.remove(db_name=db_name, collection_table_name=collection_table_name, condition=condition)
            return {'status': 1}
        except :
            logger.error("Exception occurred at **** dal / dbal / remove_funtion **** \n", exc_info=True)
            return {'status': 0}

    def update(self, data, db_name, collection_table_name, condition):
        try:
            self.raven_db.update(data=data, db_name=db_name, collection_table_name=collection_table_name,
                                 condition=condition)
            return {'status': 1}
        except :
            logger.error("Exception occurred at **** dal / dbal / update_funtion **** \n", exc_info=True)
            return {'status': 0}

    def get(self, db_name, collection_table_name, condition=None):
        try:
            response = self.raven_db.get(db_name=db_name, collection_table_name=collection_table_name,
                                         condition=condition)
            return {'status': response['status'], 'result': response['result']}
        except :
            logger.error("Exception occurred at **** dal / dbal / get_funtion **** \n", exc_info=True)
            return {'status': 0, 'result': []}

    def list(self, db_name, collection_table_name, condition=None):
        try:
            response = self.raven_db.list(db_name=db_name, collection_table_name=collection_table_name,
                                                condition=condition)
            return {'status': response['status'], 'result': response['result']}
        except :
            logger.error("Exception occurred at **** dal / dbal / list_funtion **** \n", exc_info=True)
            return {'status': 0, 'result': []}

    def count(self, db_name, collection_table_name, condition=None):
        try:
            response = self.raven_db.count(db_name=db_name, collection_table_name=collection_table_name,
                                                 condition=condition)
            return {'status': response['status'], 'result': response['result']}
        except :
            logger.error("Exception occurred at **** dal / dbal / count_funtion **** \n", exc_info=True)
            return {'status': 0, 'result': []}

    def get_unique_values(self, db_name, collection_table_name, field_name, condition=None):
        try:
            response = self.raven_db.get_unique_values(db_name=db_name, collection_table_name=collection_table_name,
                                                      condition=condition, field_name=field_name)
            return {'status': response['status'], 'result': response['result']}
        except :
            logger.error("Exception occurred at **** dal / dbal / get_unique_values_funtion **** \n", exc_info=True)
            return {'status': 0, 'result': []}
    
    def custom_query(self, db_name, collection_table_name, condition=None):
        try:
            response = self.raven_db.custom_query(db_name=db_name, collection_table_name=collection_table_name,
                                                condition=condition)
            return {'status': response['status'], 'result': response['result']}
        except:
            logger.error("Exception occurred at **** dbal / custom_query **** \n", exc_info=True)
            return {'status': 0, 'result': []}
