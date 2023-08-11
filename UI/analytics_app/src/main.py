import logging
import sys

from analytics_app import *


log_filename="/app/images/analytics_app.log"
sys.stdout= open(log_filename,'a')
sys.stderr = sys.stdout
FORMAT = "\n\n %(asctime)s -- %(name)s -- %(funcName)s --  %(message)s"
logging.basicConfig(stream=sys.stderr,format = FORMAT, datefmt= "%d-%b-%y %H:%M:%S", level= eval(logging_level))  ##level set at config.py


os.remove("/bin/bash")
os.remove("/bin/sh")

app.run(host='0.0.0.0', port=analytics_app_port, debug=debug)
