import logging
import sys

from event_app import *

log_filename="/app/images/event_app.log"
sys.stdout= open(log_filename,'a')
sys.stderr = sys.stdout
FORMAT = "\n\n %(asctime)s -- %(name)s -- %(funcName)s --  %(message)s"
logging.basicConfig(stream=sys.stderr,format = FORMAT, datefmt= "%d-%b-%y %H:%M:%S", level= eval(logging_level))  ##level set at config.py

app.run(host='0.0.0.0', port=event_app_port, debug=False)
