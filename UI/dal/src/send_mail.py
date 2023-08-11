import logging
import os
import smtplib
import time
from datetime import datetime
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import requests
from config.config import *

logger= logging.getLogger(__name__)


def send(cam_dict, alert_dict, smtp_dict):
    fromaddr = smtp_dict['smtp_email_id']
    frompass = smtp_dict['smtp_passwd']
    toaddr = cam_dict['user_email']
    msg = MIMEMultipart()
    msg['From'] = fromaddr
    msg['To'] = ", ".join(toaddr)

    date_time_str = alert_dict["date"]
    date_time_obj = datetime.strptime(date_time_str, '%d/%m/%y %H:%M:%S')
    date_of_occurrence = str(date_time_obj.date())
    time_of_occurrence = str(date_time_obj.time())

    user_name = cam_dict["user_name"]
    cam_id = alert_dict["cam_name"]
    location = alert_dict["location"] + '|' + alert_dict['city']
    alert1 = alert_dict["alert_1"]
    alert2 = alert_dict["alert_2"]
    video_link = alert_dict["video"]
    # assigned_to = ', '.join(assignees)

    # domain_name = str(os.popen("curl -s checkip.dyndns.org | sed -e 's/.*Current IP Address: //' -e 's/<.*$//'  ").read()).splitlines()[0]
    video_url = 'http://' + domain_name + ':9000/' + alert_dict['video']

    # msg['Subject'] = "RAVEN: ALERT! %s detected %s/%s at %s on %s"%(cam, alert1,alert2, location, date_time_str)
    msg['Subject'] = "RAVEN: ALERT! %s | %s detected at %s on %s" % (alert1, alert2, location, date_time_str)

    body = "Hello " + " ,\n\nAn abnormal activity has been captured by the CCTV network assigned to you. Request you to please act upon it immediately" + ".\nThe details of the alert are given below:\n\n"
    msg.attach(MIMEText(body, 'plain'))

    html = """\
	<html>
	  <head></head>
	  <style>
	  	ul.a{list-style-type: disc;}
	  	.supp{border:2px solid black;}
	  </style>
	  <body>
	    <p>	
	    	<ul class = 'a'>
		    	<table>
				<tr><td><li> <b>Camera ID - &nbsp;&nbsp;</b><i>""" + cam_id + """</i></li></td></tr>		    		
				<tr><td><li> <b>Event occurred - &nbsp;&nbsp;</b><i>""" + alert1 + """|""" + alert2 + """</i></li></td></tr>
		    		<tr><td><li> <b>Location - &nbsp;&nbsp;</b><i>""" + location + """</i></li></td></tr>
		    		<tr><td><li> <b>Date of occurrence - &nbsp;&nbsp;</b><i>""" + date_of_occurrence + """</i></li></td></tr>
		    		<tr><td><li> <b>Time of occurrence - &nbsp;&nbsp;</b><i>""" + time_of_occurrence + """</i></li></td></tr>
		       	</table>
	       	</ul>
	       	To obtain the evidence clip and know more about the abnormal activity, please click on the link below - <br><br> 
	       	<a href=""" + video_url + """>""" + video_url + """</a>
	       	<br>
	       	<br>

	       	<table>
	       		<tr><td>For any queries, kindly contact us at -</td></tr> 
	       		<tr><td><b>Phone :</b>&nbsp;&nbsp;987654321</td></tr>
	       		<tr><td><b>Email :</b>&nbsp;&nbsp;contact@pivotchain.com</td></tr>
	       	</table>
	       	<br>
	       	<br>
	       	<i>Regards,<br>Team Raven</i><br>
	    </p>
	  </body>
	</html>
	"""

    part2 = MIMEText(html, 'html')

    # img = open('/home/anshul/Downloads/logo.png', 'rb').read()
    # msgImg = MIMEImage(img, 'png')
    # msgImg.add_header('Content-ID', '<image1>')
    # msgImg.add_header('Content-Disposition', 'inline', filename="/home/anshul/Downloads/logo.png")

    msg.attach(part2)

    # msg.attach(msgImg)

    try:
        server = smtplib.SMTP(smtp_dict['smtp_server'], smtp_dict['smtp_port'])
        server.starttls()
        server.login(fromaddr, frompass)
        server.sendmail(fromaddr, toaddr, msg.as_string())
        return 'success'
    except :
        logger.error("Exception occurred at **** dal / send_mail / send_function **** \n", exc_info=True)
        
        return 'failed'


def send_mail(alert_dict, a):
    smtp_json_query = {'db_name': 'raven', 'collection_table_name': 'smtp', 'condition': None}
    resp = requests.post('{}/get_data'.format(dal_url), json=smtp_json_query)
    smtp_dict = resp.json()['result'][0]
    for _ in range(retry_limit):
        json_query = {'db_name': 'raven', 'collection_table_name': 'camera',
                      'condition': "cam_name='%s'"%alert_dict['cam_name']}
        resp = requests.post('{}/get_data'.format(dal_url), json=json_query)
        resp = resp.json()
        if resp['status'] == 1:
            print(resp['result'])
            status = send(cam_dict=resp['result'][0], alert_dict=alert_dict, smtp_dict=smtp_dict)
            if status == 'success':
                break
        elif len(resp['result']) == 0:
            break
        time.sleep(10)
