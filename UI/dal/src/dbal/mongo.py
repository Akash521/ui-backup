import ast
import logging
import traceback
import urllib.parse
import datetime
import pql
import pymongo
import regex as re

# from config import *
#from pql import group,find

logger= logging.getLogger(__name__)


proj_col = {'_id': 0,"assigned_to":0,"end_frame":0,"frame_diff":0,"person_1_face_link":0,"person_1_mask_flag":0,"person_2_face_link":0,"person_2_mask_flag":0,"start_frame":0,"video_status":0}


class MongoDB:

    def __init__(self, config):
        self.mongo_url = config['mongo_url']
        self.user_name = config['user_name']
        self.password = config['password']
        self.client = None
        self.db={}
        self.collections={}
        self.authenticate_db()

    # @staticmethod
    def authenticate_db(self):
        try:
            self.client = pymongo.MongoClient(self.mongo_url, 
                                            username=self.user_name, 
                                            password=self.password,
                                            authSource='admin', 
                                            authMechanism='SCRAM-SHA-256')

            db = self.client['admin']
            users= db.system.users.find_one({'user':self.user_name})
            print('User already exists')

        except:
            logger.error("Exception occurred at **** dal / mongo / authenticate_function **** \n", exc_info=True)
            self.client = pymongo.MongoClient(self.mongo_url)
            self.client.admin.command(
                            'createUser', self.user_name, 
                            pwd=self.password,
                            roles=[{'role': 'userAdminAnyDatabase', 'db': 'admin'},
                                {'role': 'readWriteAnyDatabase', 'db': 'admin'}]
                                )


    def connect(self):
        try:
            # self.client = pymongo.MongoClient(self.mongo_url)
            self.client = pymongo.MongoClient(self.mongo_url,
                                            replicaset="mongo", 
                                            readPreference="secondaryPreferred", 
                                            username=self.user_name, 
                                            password=self.password,
                                            authSource='admin',
                                            authMechanism='SCRAM-SHA-256')
            print('********** Connected to DB Mongo. ***********')
        except:
            logger.error("Exception occurred at **** dal / mongo / exception_function **** \n", exc_info=True)
            return {'status': 0}
        return {'status': 1}

    def disconnect(self):
        try:
            self.client.close()
        except :
            logger.error("Exception occurred at **** dal / mongo / disconnect_function **** \n", exc_info=True)
            return {'status': 0}
        self.client = None
        return {'status': 1}

    def replace_not(self,query):
        str_query=str(query)
        if 'not' in str_query:
            str_query=str_query.replace(' not ','ne')
            d_query=ast.literal_eval(str_query)
            return d_query
        else:
            return query

    def insert(self, data, db_name, collection_table_name):
        db = self.client[db_name]
        collection_db = db[collection_table_name]
        try:
            if len([data])>1:
                collection_db.insert_many(data)
                return {'status': 1}
            else:
                collection_db.insert_one(data)
                return {'status': 1}
        except :
            logger.error("Exception occurred at **** dal / mongo / insert_function **** \n", exc_info=True)
            return {'status': 0}

    def remove(self, db_name, collection_table_name, condition=None):
        db = self.client[db_name]
        collection_db = db[collection_table_name]
        if condition:
            try:
                mCond=pql.find(condition.replace('=','=='))
                mCond=self.replace_not(mCond)
                ret= collection_db.delete_many(mCond)
            except :
                logger.error("Exception occurred at **** dal / mongo / remove_function **** \n", exc_info=True)
                return {'status': 0}
        else:
            try:
                ret= db.drop_collection(collection_table_name)
            except :
                logger.error("Exception occurred at **** dal / mongo / remove_function **** \n", exc_info=True)
                return 0
        return {'status': 1}

    def update(self, data, db_name, collection_table_name, condition):
        db = self.client[db_name]
        collection_db = db[collection_table_name]
        try:
            mCond=pql.find(condition.replace('=','=='))
            mCond=self.replace_not(mCond)
            ret=collection_db.update_many(mCond,{'$set':data},True)
        except :
            logger.error("Exception occurred at **** dal / mongo / update_function **** \n", exc_info=True)
            return {'status': 0}
        return {'status': 1}

    def get(self, db_name, collection_table_name, condition=None):
        db = self.client[db_name]
        collection_db = db[collection_table_name]
        if condition:
            try:
                mCond=pql.find(condition.replace('=', '=='))
                mCond=self.replace_not(mCond)
                ans=list(collection_db.find(mCond,{"_id":0}))
            except :
                logger.error("Exception occurred at **** dal / mongo / get_function **** \n", exc_info=True)
                return {'status': 0, 'result': []}
        else:
            try:
                ans= list(collection_db.find({},{"_id":0}))
            except :
                logger.error("Exception occurred at **** dal / mongo / get_function **** \n", exc_info=True)
                return {'status': 0, 'result': []}
        return {'status': 1, 'result': ans}

    def list(self, db_name, collection_table_name, condition=None):
        db = self.client[db_name]
        collection_db = db[collection_table_name]
        if condition:
            try:
                if 'date(' in condition:
                    mCond = pql.find(condition)
                    lst_ans = list(collection_db.aggregate(
                        [{"$addFields": {"alert_date": {"$dateFromString": {"dateString": "$alert_date"}}}},
                         {"$match": mCond}]))
                elif 'push_data' in condition:
                    condition=condition.replace('\n','')
                    cond=condition.split("=")
                    cam=re.search('\'(.*)\'',cond[1]).group(1)
                    gp=re.search('\'(.*)\'',cond[2]).group(1)
                    pud=re.search('\'(.*)\'',cond[3]).group(1)
                    mCond=[{'$project':proj_col}, {'$match':{'cam_name':'{}'.format(cam)}}, { "$sort" : { "date" : -1 }},{'$limit':100}, {
                             '$group' : { '_id' : "${}".format(gp), 'priority': { '$push': "{}".format(pud) }}}]
                    lst_ans=list(collection_db.aggregate(mCond,allowDiskUse=True))
                else:
                    mCond=pql.find(condition.replace('=','=='))
                    mCond=self.replace_not(mCond)
                    lst_ans=list(collection_db.find(mCond,{"_id":0}))
            except:
                logger.error("Exception occurred at **** dal / mongo / list_function **** \n", exc_info=True)
                return {'status': 0, 'result': []}
        else:
            try:
                lst_ans= list(collection_db.find({},{"_id":0}))
            except :
                logger.error("Exception occurred at **** dal / mongo / list_function **** \n", exc_info=True)
                return {'status': 0, 'result': []}

        return {'status': 1, 'result': lst_ans}

    def count(self, db_name, collection_table_name, condition=None):
        db = self.client[db_name]
        collection_db = db[collection_table_name]
        if condition:
            try:
                mCond=pql.find(condition.replace('=','=='))
                mCond=self.replace_not(mCond)
                print(mCond)
                cnt=collection_db.count_documents(mCond)
            except :
                logger.error("Exception occurred at **** dal / mongo / count_function **** \n", exc_info=True)
                return {'status': 0, 'result': 0}
        else:
            try:
                cnt=collection_db.count_documents()
            except :
                logger.error("Exception occurred at **** dal / mongo / count_function **** \n", exc_info=True)
                return {'status': 0, 'result': 0}

        return {'status': 1, 'result': cnt}

    def get_unique_values(self, db_name, collection_table_name, field_name, condition=None):
        db = self.client[db_name]
        collection_db = db[collection_table_name]
        if condition:
            try:
                mCond=pql.find(condition.replace('=','=='))
                unique_values = collection_db.find(mCond).distinct(field_name)
            except :
                logger.error("Exception occurred at **** dal / mongo / get_unique_values_function **** \n", exc_info=True)
                return {'status': 0, 'result': 0}
        else:
            try:
                unique_values = collection_db.distinct(field_name)
            except :
                logger.error("Exception occurred at **** dal / mongo / get_unique_values_function **** \n", exc_info=True)
                return {'status': 0, 'result': 0}

        return {'status': 1, 'result': unique_values}
    
    def custom_query(self, db_name=None, collection_table_name=None, condition=None):
        db = self.client[db_name]
        collection_db = db[collection_table_name]

        if 'find' in condition or 'aggregate' in condition:
            try:
                ans = list(eval(condition%(collection_table_name)))

            except:
                logger.error("Exception occurred at **** mongo / custom_query **** \n", exc_info=True)
                return {'status': 0, 'result': []}
        else:  #update_many is evaluate in else part
            try:
                ans= eval(condition%(collection_table_name))
            except:
                logger.error("Exception occurred at **** mongo / custom_query **** \n", exc_info=True)
                return {'status': 0, 'result': []}
        return {'status': 1, 'result': ans}