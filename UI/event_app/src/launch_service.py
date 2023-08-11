import logging
import socket
import traceback

import numpy as np
import requests
import yaml
import re
#from config import *
from config.config import *
from utils import *
from kubernetes import client, config
import subprocess


logger= logging.getLogger(__name__)

def is_port_in_use(port):
	with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
		return s.connect_ex((domain_name.split(":")[0], port)) == 0

def is_port_free(port):
    try:
        result = subprocess.run(['netstat', '-tuln'], capture_output=True, text=True, check=True)
        output_lines = result.stdout.splitlines()
        for line in output_lines:
            if f':{port}' in line:
                return False
	    
        return True
    
    except:
        logger.error("Exception occurred at **** event_app / is_port_in_use **** \n", exc_info=True)
        return False

def launch_service(ffmpeg_image_flag=None, service_name=None, data=None,random_port=None):
	config.load_kube_config(config_file=cube_config_path)
	k8s_apps_v1 = client.AppsV1Api()
	k8s_apps_ser = client.CoreV1Api()
	
	cam_name=check_special_characters(data['cam_name'])
	#special character handling in camera name for successfull deployment
	# special_char = re.compile('[@_!#$%^&*()<>?/\|}{~:]')
	# if(special_char.search(data['cam_name']) == None):
	# 	pass
	# else:
	# 	chars=special_char.findall(data['cam_name'])
	# 	replace_special_chars = re.subn(f"{chars}",'-',data['cam_name'])
	# 	cam_name=replace_special_chars[0]
	
	if not ffmpeg_image_flag:
		if 'voi' in service_name:
			f = open('/app/voi-cam/voi-camera.yaml')
			pod_name = 'ravenvoi-'+str(cam_name.lower())
		elif 'nonpoi' in service_name:
			f = open('/app/nonpoi-cam/nonpoi-camera.yaml')
			pod_name = 'ravennonpoi-'+str(cam_name.lower())
		elif 'poi' in service_name:
			f = open('/app/poi-cam/poi-camera.yaml')
			pod_name = 'ravenpoi-'+str(cam_name.lower())
		# elif 'homeland' in service_name:
		# 	f = open('/app/raven-homeland/raven-homeland.yaml')
		# 	pod_name = 'ravenhomeland-'+str(cam_name.lower())
		elif 'stevedore' in service_name:
			f = open('/app/stevedore-cam/stevedore-camera.yaml')
			pod_name = 'ravenstevedore-'+str(cam_name.lower())
		elif 'drone' in service_name:
			f = open('/app/drone-cam/drone-camera.yaml')
			pod_name = 'ravendrone-'+str(cam_name.lower())
		else: 
			pass
		try:
			f = open('/app/raven-homeland/raven-homeland.yaml')
			pod_name = 'ravenhomeland-'+str(cam_name.lower())
		
		
			dep = yaml.safe_load(f)
			
			dep['metadata']['name']= pod_name
			dep['spec']['template']['spec']['containers'][0]['env'][0]['value'] = data['pincode']
			dep['spec']['template']['spec']['containers'][0]['env'][1]['value'] = data['cam_name']
			dep['spec']['template']['spec']['containers'][0]['env'][2]['value'] = data['cam_input_url']
			resp = k8s_apps_v1.create_namespaced_deployment(body=dep, namespace="default")
		except:
			pass

		#try:
		f = open('/app/raven-cam/raven-camera.yaml')
		pod_name = 'ravenbackend-'+str(cam_name)
		#except:
		    #pass
		
		dep = yaml.safe_load(f)
		dep['metadata']['name']= pod_name
		dep['spec']['template']['spec']['containers'][0]['env'][0]['value'] = data['pincode']
		dep['spec']['template']['spec']['containers'][0]['env'][1]['value'] = data['cam_name']
		dep['spec']['template']['spec']['containers'][0]['env'][2]['value'] = data['cam_input_url']

	if ffmpeg_image_flag:

		f_dep= open('/app/livestream-cam/livestream-dep.yaml')
		dep = yaml.safe_load(f_dep)
		dep['metadata']['name']= 'livestream-'+str(cam_name.lower())
		dep['spec']['selector']['matchLabels']['app']= 'livestream-'+str(cam_name.lower())
		dep['spec']['template']['metadata']['labels']['app'] = 'livestream-'+str(cam_name.lower())
		dep['spec']['template']['spec']['containers'][0]['env'][0]['value'] = data['cam_url']
		dep['spec']['template']['spec']['containers'][0]['env'][1]['value'] = data['cam_name'].lower()

		f_ser = open('/app/livestream-ser/livestream-ser.yaml')
		ser = yaml.safe_load(f_ser)
		
		ser['metadata']['name']= 'livestream-'+str(cam_name.lower())
		ser['spec']['selector']['app']='livestream-'+str(cam_name.lower())
		ser['spec']['ports'][0]['name']='livestream-'+str(cam_name.lower())
		ser['spec']['ports'][0]['port'] =  8082
		ser['spec']['ports'][0]['nodePort'] = random_port#int(data['cam_url_details'][cam_name]['node_port'])

		# f"ws://{domain_name}:{int(random_port)}"

		try:
			resp = k8s_apps_ser.create_namespaced_service(body=ser, namespace="default")
			success=1
		except:
			success=0
			logger.error("Exception occurred at **** event_app / launch_service **** \n", exc_info=True)

	resp = k8s_apps_v1.create_namespaced_deployment(body=dep, namespace="default")
