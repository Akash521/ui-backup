import datetime
import json

from bson import ObjectId


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o,(datetime.date, datetime.datetime)):
            return o.strftime('%Y-%m-%d')
        return json.JSONEncoder.default(self, o)
