import json
import logging

import mysql.connector
import pandas as pd

logger= logging.getLogger(__name__)


class SqlDB:

    def __init__(self, config):
        self.url = config['mysql_url']
        self.username = config['user_name']
        self.passwd = config['password']
        self.client = None
        self.cursor = None
        # self.db_name='raven'
        # self.collection_table_name=collection_table_name
        # self.data=data
        # self.collection2='camera'

    def connect(self):
        self.client = mysql.connector.connect(host=self.url, user=self.username, passwd=self.passwd, database='raven')
        try:
            if self.client.is_connected():
                print('********** Connected to DB SQL. **********')
                self.cursor = self.client.cursor(buffered=True)
                return {'status': 1}
        except :
            logger.error("Exception occurred at **** dal /  sql / connect_function **** \n", exc_info=True)
            return {'status': 0}

    def disconnect(self):
        if self.client.is_connected():
            self.cursor.close()
            self.client.close()
            self.client = None
            self.cursor = None
            print('********** Disconnected from DB SQL. **********')
            return {'status': 1}
        else:
            return {'status': 0}

    def convert2json(self, lst, cols_collection):
        info = {}
        for i, key in enumerate(cols_collection):
            info[key] = lst[i]
        return info

    def create_db(self, db_name):
        try:
            self.cursor.execute("CREATE DATABASE {}".format(db_name))
        except :
            logger.error("Exception occurred at **** dal /  sql / create_db_function **** \n", exc_info=True)

    def use_db(self, db_name):
        try:
            self.cursor.execute(f'use {db_name}')
        except :
            logger.error("Exception occurred at **** dal /  sql / use_db_function **** \n", exc_info=True)

    def create_collection(self, db_name, collection_table_name):
        try:
            self.use_db(db_name)
            query = "CREATE TABLE {} (Sno INT(10) NOT NULL AUTO_INCREMENT, PRIMARY KEY (Sno))".format(
                collection_table_name)
            self.cursor.execute(query)
        except :
            logger.error("Exception occurred at **** dal /  sql / create_collection_function **** \n", exc_info=True)

    def insert(self, data, db_name, collection_table_name, condition=None):

        try:
            self.use_db(db_name)
            self.cursor.execute("show tables like '%s'" % (collection_table_name))
            numtab = self.cursor.fetchall()
            if len(numtab) == 1:
                pass
            else:
                self.create_collection(db_name, collection_table_name)

            self.cursor.execute(f"show columns from {collection_table_name}")
            cols_collection = self.cursor.fetchall()
            cols_collection = [i[0] for i in cols_collection]
            new_cols = set(data.keys()).difference(set(cols_collection))

            for key in new_cols:
                add_table = f'ALTER TABLE  {collection_table_name} ADD %s VARCHAR(255)' % (key)
                self.cursor.execute(add_table)
            df = pd.DataFrame([data])
            cols = "`,`".join([str(i) for i in df.columns.tolist()])
            for i, row in df.iterrows():
                # check this line*********************************
                query = f"INSERT INTO {collection_table_name} (`" + cols + "`) VALUES (" + "%s," * (
                            len(row) - 1) + "%s)"
                self.cursor.execute(query, tuple(row))
            self.client.commit()
            return {'status': 1}
        except :
            logger.error("Exception occurred at **** dal /  sql / insert_function **** \n", exc_info=True)
            return {'status': 0}

    def get(self, db_name, collection_table_name, condition=None):
        try:
            self.use_db(db_name)
            self.cursor.execute(f"show columns from {collection_table_name}")
            cols_collection = self.cursor.fetchall()
            cols_collection = [i[0] for i in cols_collection]

            if condition is None:
                query = "SELECT * from {}".format(collection_table_name)
                self.cursor.execute(query)
                lst = self.cursor.fetchone()
                info = self.convert2json(lst, cols_collection)
                return {'status': 1, 'result': info}
            else:
                query = "SELECT * from {} WHERE {}".format(collection_table_name, condition)
                self.cursor.execute(query)
                lst = self.cursor.fetchone()
                info = self.convert2json(lst, cols_collection)
                return {'status': 1, 'result': info}
        except :
            logger.error("Exception occurred at **** dal /  sql / get_function **** \n", exc_info=True)
            return {'status': 0, 'result': []}

    def list(self, db_name, collection_table_name, condition=None):
        try:
            self.use_db(db_name)
            self.cursor.execute(f"show columns from {collection_table_name}")
            cols_collection = self.cursor.fetchall()
            cols_collection = [i[0] for i in cols_collection]

            if condition is None:
                query = "SELECT * from {}".format(collection_table_name)
                self.cursor.execute(query)
                lst = self.cursor.fetchall()

                info = list(map(lambda x: self.convert2json(x, cols_collection), lst))
                # for i,key in enumerate(cols_collection):
                #     info[key] = lst[i]
                return {'status': 1, 'result': info}
            else:
                query = "SELECT * from {} WHERE {}".format(collection_table_name, condition)
                self.cursor.execute(query)
                lst = self.cursor.fetchall()

                info = list(map(lambda x: self.convert2json(x, cols_collection), lst))
                # for i,key in enumerate(cols_collection):
                #     info[key] = lst[i]
                return {'status': 1, 'result': info}
        except :
            logger.error("Exception occurred at **** dal /  sql / list_function **** \n", exc_info=True)
            return {'status': 0, 'result': []}

    def update(self, data, db_name, collection_table_name, condition=None):
        try:
            self.use_db(db_name)
            if condition is None:
                cols = list(data.keys())
                d = ', '.join([f"{key}='{data[key]}'" for key in data.keys()])
                query = "UPDATE {} SET {}".format(collection_table_name, d)
                self.cursor.execute(query)
            else:
                cols = list(data.keys())
                d = ', '.join([f"{key}='{data[key]}'" for key in data.keys()])
                query = "UPDATE {} SET {} WHERE {}".format(collection_table_name, d, condition)
                self.cursor.execute(query)
            self.client.commit()
            return {'status': 1}
        except :
            logger.error("Exception occurred at **** dal /  sql / update_function **** \n", exc_info=True)
            return {'status': 0}

    def remove(self, db_name, collection_table_name, condition=None):
        try:
            self.use_db(db_name)

            if condition == None:
                query = 'TRUNCATE {}'.format(collection_table_name)
                self.cursor.execute(query)
            else:
                query = 'DELETE FROM {} where {}'.format(collection_table_name, condition)
                self.cursor.execute(query)

            self.client.commit()
            return {'status': 1}
        except :
            logger.error("Exception occurred at **** dal /  sql / remove_function **** \n", exc_info=True)
            return {'status': 0}

    def count(self, db_name, collection_table_name, condition=None):
        try:
            self.use_db(db_name)

            if condition is None:
                query = 'SELECT * FROM {}'.format(collection_table_name)
                self.cursor.execute(query)
                d = self.cursor.fetchall()
                return {'status': 1, 'result': len(d)}
            else:
                query = 'SELECT * FROM {} where {}'.format(collection_table_name, condition)
                self.cursor.execute(query)
                d = self.cursor.fetchall()
                return {'status': 1, 'result': len(d)}

        except :
            logger.error("Exception occurred at **** dal /  sql / count_function **** \n", exc_info=True)
            return {'status': 0, 'result': []}

    def delete_table(self, db_name, collection_table_name):
        try:
            self.use_db(db_name)
            query = 'DROP TABLE {}'.format(collection_table_name)
            self.cursor.execute(query)
            self.client.commit()
        except :
            logger.error("Exception occurred at **** dal /  sql / delete_table_function **** \n", exc_info=True)

    def delete_database(self, db_name):
        try:
            query = 'DROP DATABASE {}'.format(db_name)
            self.cursor.execute(query)
            self.client.commit()
        except :
            logger.error("Exception occurred at **** dal /  sql / delete_database_function **** \n", exc_info=True)