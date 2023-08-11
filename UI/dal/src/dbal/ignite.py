import logging

import pyignite

logger= logging.getLogger(__name__)


class IgniteDB:
    def __init__(self, config):
        self.ignite_url = config['ignite_url']
        self.user_name = config['user_name']
        self.password = config['password']
        self.client = None
        self.port = config['port']

    def connect(self):
        try:
            self.client = pyignite.Client()
            self.client.connect(self.ignite_url, self.port)
            print('********** Connected to DB Ignite. ***********')
        except Exception as e:
            logger.error("Exception occurred at **** dal /  ignite / connect_function **** \n", exc_info=True)

            return {'status': 0}
        return {'status': 1}

    def disconnect(self):
        try:
            self.client.close()
            self.client = None
            return {'status': 1}
        except Exception as e:
            logger.error("Exception occurred at **** dal /  ignite / disconnect_function **** \n", exc_info=True)
            return {'status': 0}

    def insert(self, data, db_name, collection_table_name):
        qmarks = ', '.join('?' * len(data))
        columns = ', '.join(str(x) for x in data.keys())
        print(columns)
        Values = list(data.values())
        qry="Insert Into %s (%s) Values (%s)" % (collection_table_name,columns,qmarks)
        try:
            self.client.sql(qry, query_args=Values)
            return {'status': 1}
        except Exception as e:
            logger.error("Exception occurred at **** dal /  ignite / insert_function **** \n", exc_info=True)
            return {'status': 0}

    def remove(self,db_name, collection_table_name, condition=None):
        if condition:
            qry = "Delete From %s Where %s" % (collection_table_name,condition)
        else:
            qry = "Delete From %s" % (collection_table_name)
        try:
            self.client.sql(qry)
            return {'status': 1}
        except Exception as e:
            logger.error("Exception occurred at **** dal /  ignite / remove_function **** \n", exc_info=True)
            return {'status': 0}

    def update(self, data, db_name, collection_table_name, condition=None):
        set_columns = ', '.join('{}=?'.format(k) for k in data)
        Values = list(data.values())
        if condition:
            qry = "Update %s Set %s Where %s" % (collection_table_name,set_columns,condition)
        else:
            qry = "Update %s Set %s" % (collection_table_name,set_columns)
        try:
            self.client.sql(qry,query_args=Values)
            return {'status': 1}
        except Exception as e:
            logger.error("Exception occurred at **** dal /  ignite / update_function **** \n", exc_info=True)
            return {'status': 0}

    def get(self, db_name, collection_table_name, condition=None):
        if condition:
            qry = "select * From %s Where %s" % (collection_table_name,condition)
        else:
            qry = "select * From %s " % (collection_table_name)
        try:
            res= self.client.sql(qry,include_field_names=True)
            columns_uppercase =  next(res)
            row = next(res)
            columns = [ key.lower() for key in columns_uppercase]
            return {'status': 1, 'result': [dict(zip(columns, row))]}
        except Exception as e:
            logger.error("Exception occurred at **** dal /  ignite / get_function **** \n", exc_info=True)
            return {'status': 0, 'result': []}

    def list(self, db_name, collection_table_name, condition=None):
        if condition:
            qry = "select * From %s Where %s" % (collection_table_name,condition)
        else:
            qry = "select * From %s " % (collection_table_name)
        try:
            res=list(self.client.sql(qry,include_field_names=True))
            columns = []
            for key in res[0]:
                columns.append(key.lower())
            return {'status': 1, 'result': [dict(zip(columns, row)) for row in res[1:]]}
        except Exception as e:
            logger.error("Exception occurred at **** dal /  ignite / list_function **** \n", exc_info=True)
            return {'status': 0, 'result': []}

    def count(self, db_name, collection_table_name, condition=None):
        if condition:
            qry = "select count(*) From %s Where %s" % (collection_table_name,condition)
        else:
            qry = "select count(*) From %s " % (collection_table_name)
        try:
            res=self.client.sql(qry)
            return {'status': 1, 'result': next(res)[0]}
        except Exception as e:
            logger.error("Exception occurred at **** dal /  ignite / count_function **** \n", exc_info=True)
            return {'status': 0, 'result': 0}
