from datetime import datetime
import requests
from pytz import timezone

from config.config import *
import logging

logger= logging.getLogger(__name__)

tz = timezone(time_zone)


def get_staff_status():
    '''
    Get staff status of user from user collection.
    '''
    try:
        json_query = {'db_name':db_name,'collection_table_name': user_collection,'condition':""}
        resp = requests.post('{}/list_data'.format(dal_url),json=json_query)
        resp = resp.json()['result']

        user_status = [user['staff_status'] for user in resp if user.get('staff_status') is not None]
        user_status = list(set(user_status))
    except:
        logger.error("Exception occurred at **** dal / user_assign / get_staff_status_function **** \n", exc_info=True)
        user_status = []
    
    return user_status