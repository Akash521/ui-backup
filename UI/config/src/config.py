domain_name ="10.13.10.6"
volume_target = "/app/images"
volume_src = "/mnt/ravenfs/pivotchain"
PATH_TO_SAVE = volume_target
skip_frame_voi = 3
################# POI parameters######################
min_sec_to_next_alert = 25
min_frame_verfiy_face = 4
time_to_replace_emb = 1500
skip_frame_FR = 3
read_stream_counter = 3000
partial_video_frame_diff_poi=12
input_res = (640, 480) #(320, 240)
onnx_model_path = './models/FR_Detector.onnx' #'./models/ultra_light_320.onnx'
recg_path = './models/FR_model_online_dataset_60_epoch.pth'
onnx_w, onnx_h = 640, 480 #320, 240
poi_thresh = 0.3
nonpoi_thresh = 0.3
#NON-POI parameters
min_frame_verfiy_unknown_face = 6

# Detector FR
detect_fr_port=8081
api_detection_fr_url = 'http://detectapi-fr:8081/detect_object_bbox'

######################################################detectapi

## classes
# classNames = dict(zip(range(1,5), ['person', 'head', 'animal', 'vehicle','number_plate']))# {1:'person', 2:'head', 3:'weapon', 4:'atm_screen_open', 5:'Arson', 6:'Explosion', 7:'sleeping', 8:'Fighting', 9:'sitting', 10:'Vandalism',11:'atm_cabinet_open',12:'Robbery'}
classNames = dict(zip(range(1,3), ['person', 'animal', 'vehicle']))

# classNames_yolo = dict(zip(range(0,5), ['person', 'head', 'animal', 'vehicle', 'number_plate']))
classNames_yolo = dict(zip(range(0,3), ['person', 'animal', 'vehicle']))



#classNames = {1: 'person',2:'head',3:'Arson',4:'Explosion'}
detect_api_url='http://detectapi:8080/detect_object_bbox'
detect_api_drone_url='http://detectapi-drone:8082/detect_drone_bbox'
detectapi_voi_url='http://detectapi-voi:8083'
#classNames = {0:'person', 1:'head', 2:'Fighting', 3:'Robbery', 4:'Vandalism', 5:'sitting', 6:'skimming', 7:'sleeping', 8:'Arson', 9:'Explosion'}
#classNames = {1:'person', 2:'head', 3:'weapon', 4:'atm_screen_open', 5:'Arson', 6:'Explosion', 7:'sleeping', 8:'Fighting', 9:'sitting', 10:'Vandalism',11:'atm_cabinet_open',12:'Robbery'}



#classNames_yolo = {0:'Arson', 1:'person', 2:'Explosion', 3:'head', 4:'sitting', 5:'sleeping',6:'weapon', 7:'Robbery', 8:'Fighting', 9:'Vandalism', 10:'atm_screen_open',11:'atm_cabinet_open',12:'box',13:'keyboard'}
cube_config_path = '/app/k8s/kubeconfig'
face_detector_model_path = './models/ultra_light_320.onnx'
face_recognition_model_path = './models/MobileFaceNet_9925_9680.pb'
facenet_model_path = './models/tf_facenet.pb'
predictor_path = './models/shape_predictor_5_face_landmarks.dat'



MODEL_PATH = 'models/frozen_inference_graph_63k.pb'
MODEL_PATH_ONNX = 'models/drdobsf_7th_jan.onnx'
MODEL_PATH_TORCH = 'models/model.pt'
CHECKER_MODEL_PATH = 'models/checker6.h5'
helmet_detector_model_path = 'models/helmet_model_11jan.h5'
mask_detector_model_path = 'models/mask_classification_model_7feb.h5'
mask_detector_model_path_vit = 'models/vit_mask_model' 


conf_thresh=0.50
iou_thresh=0.45
detect_api_port=8080

#########################################################                    

logging_level = "logging.ERROR"

################# Backend parameters######################
# backend_events = ['raven-homeland', 'raven-vandalism', 'raven-person', 'raven-fighting', 'raven-weapon', 'raven-unattended', 'raven-walljump', 'raven-crawling','raven-crowd', 'raven-arson']

# backend_events_coord = {'raven-homeland' : [91, 64, 251, 287], 'raven-vandalism' : [188,58,302,293], 'raven-person':[43, 90, 256, 258],  'raven-fighting':[76,18,268,232], 'raven-weapon':[137, 148, 323, 279], 'raven-walljump':[0,0, 94,211],'raven-unattended':[276,81, 349,285], 'raven-crawling':[1, 1, 123, 247],'raven-crowd':[1,1,352,288], 'raven-arson': [133,178,200,272]}

# backend_events_color = {'raven-homeland' : (0, 0, 255), 'raven-vandalism' : (0, 0, 255), 'raven-person': (0, 255, 0), 'raven-fighting': (0, 0, 255), 'raven-weapon':(0,0,255), 'raven-walljump' : (0, 0, 255), 'raven-unattended': (0,0,255), 'raven-crawling': (0,255,0),'raven-crowd':(0,0,255), 'raven-arson':(0,0,255)}

# backend_with_det=['raven-fr']

#input_res_back = (416, 320)
input_res_back = (352,288)
######################################################


null = None
time_zone = "Asia/Calcutta"
db_name = 'raven'
camera_collection = 'camera'
alert_collection = 'alert'
user_collection = 'userdetails'
smtp_collection = 'smtp'
license_collection = 'license'
twilio_collection = 'twilio'
priority_collection = 'priority'
param_collection = 'parameters'
# pincode_collection = 'pincode'
location_collection = 'location'
download_collection = 'download'
voi_collection = 'voi_collection'
voi_track_collection = 'voi_track_collection'
poi_collection = 'poi_collection'
poi_track_collection = 'poi_track_collection'
db_type = 'Mongodb'
mongo_url = "mongodb://mongo:27017"
event_app_url = 'http://event-app:4440'
dal_url = 'http://dal:4445'
mqtt_broker_ip = "0.0.0.0"
mqtt_port = 9001
broker = 'CLIENT_IP'
port = 30004

debug = False #dal
prod_flag = 'Y'
save_raw_video = False

duration_period = 60 #analytics_app

max_frames_to_det_veh = 2

token_secret = 'token-secret'
skip_frame = 4
skip_frame_homeland = 1
# skip_frame_unattended = 1
# background_update = 1800
fps = 10
buffer_len = 90
retry_limit = 5
retry_limit_mqtt=3
# partial_video_frame_diff = 30
partial_video_frame_diff = 30
loitering_limit = 1200
MAX_LOITER_LEN=15
twoway_threshold = 50
absent_start_counter_min_ = 100
present_start_counter_min_ = 100
##For analytics app to display the pie chart and graph
alert_name = ["Perimeter Breach", 
              "Loitering Detection",
              #"Fighting",#"Robbery","Weapon", "Unattended Station", "Overcrowding Detected", "Crawling", "Wall Jumped"
               "POI", "VOI", "Camera Tampering",
              "Drone Detected", "Unauthorised Entry"]#Person Running Away", "Person Running Towards"]
              #"Stevedore", #"Arson","Explosion",
              #"Road Accident",#"Riot","Weapon Detected",
              #"Unattended Baggage", "POI","NONPOI", "Mask","Falling","Shutter","VOI"]#,
              #,"Garbage Detected","Social Distancing Violation"]

##For creating flags in event-app
alert_array = ["Intrusion detection",
                "Crawling detection",
                "Wall Jump detection",
                "Loitering detection",#"Animal Detection",
                #"Person Away Detection", "Person Towards Detection",
                "Arson detection",#"Explosion detection",
                "Overcrowd Detection",#"Fighting Detection",
                "Vandalism Detection","Weapon Detection","Authorised Entry Detection","Unauthorised Entry Detection","Drone Detection", "Unattended Station Detection", "Camera Tampering Detection", "Authorised Vehicle Detection", "In/Out Detection"]

##For checkbox in the frontend
perimeter_with_time = ["Intrusion", "Unattended Station","Wall Jump"] #"Stevedore"]
perimeter_without_time = ["Drone", "Overcrowd", "Loitering", "VOI"] #["VOI"]#["Loitering"]#,"Unattended Baggage", "Garbage Detection"]
non_perimeter_with_time = []
non_perimeter_without_time = ["Vandalism", "Weapon", "POI", "NONPOI", "Arson", "Camera Tampering", "In/Out"]#,"Mask","Unattended Baggage","Helmet","Robbery","POI","NONPOI","Arson","Explosion","Riot","Weapon","Social Distancing Violation"]


services = [
            {'name':'Drone', 'data':{'perimeter_with_time':[],'perimeter_without_time':['Drone'], 'non_perimeter_with_time':[], 'non_perimeter_without_time':[]}},
            {'name':'Vehicle of Interest', 'data':{'perimeter_with_time':[],'perimeter_without_time':["Authorised Vehicle"], 'non_perimeter_with_time':[], 'non_perimeter_without_time':[]}},
            {'name':'Person of Interest', 'data':{'perimeter_with_time':[],'perimeter_without_time':[], 'non_perimeter_with_time':[], 'non_perimeter_without_time':["Authorised Entry","Unauthorised Entry"]}},
            {'name':'Homeland', 'data':{'perimeter_with_time':["Intrusion", "Unattended Station","Wall Jump"],'perimeter_without_time':["Overcrowd", "Loitering", "Crawling"], 'non_perimeter_with_time':[], 'non_perimeter_without_time':["Weapon","Arson", "Camera Tampering"]}}
            ]
            
##For homeland only
homeland_events = ["Vandalism",'Arson','Overcrowd', 'Loitering', 'Weapon','Intrusion','Crawling','Unattended Station', "Camera Tampering","Wall Jump", "In/Out"]
#alert_detection_arr =  ['Arson','Explosion','Fighting','Road Accident','Robbery','Shooting','Vandalism','Snatching','Protest','Riot']

#perimeter_types = ["Intrusion"]
default_priority_list = ["P1", "P2", "P3", "P4"]
realtimeAlertLimit = 500
show_default_priority = [{"alert_name": "Perimeter Breach", "priority":"P1"},
                         {"alert_name":"Crawling Detected", "priority":"P1"},
                         {"alert_name":"Wall Jumped", "priority": "P1"},
                         {"alert_name":"Unattended Station", "priority":"P1"},
                         {"alert_name":"Overcrowding Detected", "priority": "P1"},
                         {"alert_name":"Drone Perimeter Breach", "priority": "P1"},
                         {"alert_name":"Camera Tampering", "priority":"P1"},
                         {"alert_name":"Loitering Detection", "priority":"P2"},
                         {"alert_name":"Arson", "priority":"P1"},
                         {"alert_name":"Fighting", "priority":"P1"},
                         {"alert_name":"Vandalism", "priority":"P1"},
                         {"alert_name":"Animal Detected", "priority":"P2"},
                         {"alert_name":"Weapon Detected", "priority":"P1"},
                         {"alert_name":"CCTV Active", "priority":"P1"},
                         {"alert_name":"CCTV Inactive", "priority":"P1"},
                         {"alert_name":"VOI", "priority":"P1"},
                         {"alert_name":"POI", "priority":"P1"},
                         {"alert_name":"Camera Obsolete", "priority":"P1"}]

default_priority={"Perimeter Breach":"P1",
                  "Crawling Detected":"P1",
                  "Wall Jumped": "P1",
                  "Unattended Station":"P1",
                  "Overcrowding Detected": "P1",
                  "Drone Perimeter Breach": "P1",
                  "Camera Tampering":"P1",
                  "Loitering Detection":"P2",
                  "Arson":"P1",
                  "Fighting":"P1",
                  "Vandalism":"P1",
                  "Animal Detected":"P2",
                  "Weapon Detected":"P1",
                  "CCTV Active":"P1",
                  "CCTV Inactive":"P1",
                  "POI":"P1",
                  "VOI":"P1",
                  "Camera Obsolete":"P1"}


#default_priority = [{"alert_name": "Person Perimeter Breach", "priority": "P1"},
#                    {"alert_name": "Liotering", "priority": "P1"},
#                    {"alert_name": "One Atm One Person", "priority": "P1"},
#                    {"alert_name": "Sleeping", "priority": "P1"},
#                    {"alert_name": "Explosion", "priority": "P1"},
#                    {"alert_name": "Arson", "priority": "P1"},
#                    {"alert_name": "Fighting", "priority": "P1"},
#                    {"alert_name": "Robbery", "priority": "P1"},
#                    {"alert_name": "Vandalism", "priority": "P1"},
#                   ]
#classNames = {2: 'Mask', 1: 'Non-Mask', 0: 'Cant Say'}
#classNames = {0: "Cant Say", 1: "Mask", 2: "Non-Mask"}
###############

offset = 5
breach_start_counter_min = 23
wall_jump_start_counter_min = 3
alert_close_counter = 40

no_frames_to_confirm_helmet = 20
no_frames_to_confirm_mask = 7
helmet_det_thres = 0.3
helmetClass = {1: 'Non-Helmet', 0: 'Helmet'}
maskClass= {2: 'Non-Mask', 1: 'Mask',0:'Other'}

face_det_thresh = 0.3
person_det_thresh = 0.3
sleep_det_thresh = 0.3
sit_det_thresh = 0.3

set_s_threshold = 5
normal_threshold = 0.9
abnormal_threshold = 0.1

side_face_measure_thrshold = 0.25

p_threshold = {'Fighting': 0.6, 'Road Accident': 0.7, 'Robbery': 0.5, 'Arson': 0.9, 'Explosion': 0.7, 'Snatch': 0.3,
                       'Shooting': 0.3, 'Breaking': 0.3, 'Vandalism': 0.3}
s_threshold = {'Fighting': 0.5, 'Road Accident': 0.5, 'Robbery': 0.3, 'Arson': 0.5, 'Explosion': 0.7, 'Snatch': 0.3,
                       'Shooting': 0.3, 'Breaking': 0.3, 'Vandalism': 0.3}
duration = {'Fighting': 20,'Robbery': 20, 'Arson': 50, 'Explosion': 30, 'Vandalism': 30,'Change in Camera Angle': 0, 'Bad Video Quality': 0}

##colors for bounding box
person_bbox_color = (0,255,0)
wall_bbox_color = (255,0,0)
mask_bbox_color = (255,140,0) # purple
helmet_bbox_color=(210,60,200) 

perimeter_bbox_color = (0,0,255)
weapon_bbox_color=(120,255,120)
obj_bbox_color=(0,255,255)


#CAMERA VARIABLES

param_data={
'camera_tampering_video_status':0,
'one_atm_one_person_flag':0,
'one_atm_one_person_video_status':0
}

atm_cabinet_open_start_counter_limit=2
atm_screen_open_start_counter_limit=2
camera_tampering_counter_limit = 0

alert_max_frame_diff = 100
loiter_alert_close_counter=100
loiter_start_counter_min=300
loiter_ignore_limit = 120
pune_lobby_person_patch=[50,182,135,276]
pune_lobby_face_patch=[230,45,284,96]
mum_lobby_face_patch = [328,256,348,281]
mumbai_face_area={'mum_face_area': '[[8,57],[173,57],[208,236],[16,263]]'}

#*****************STEVEDORE*******************************
event_collection = 'event'
truck_collection = 'truck_ops'

#fps = 25
#skip_frame = 1
#retry_limit = 5
#*********************LOAD UNLOAD**************************
labels={'normal':0, 'loading':1}
num_label={0:'Idle', 1:'Unloading Activity'}

# labels={'normal':0, 'background':0, 'unload':1, 'load':2}
# num_label={0:'Idle', 1:'Unloading Activity', 2:'Loading Activity'}

stream_check_count=150

#face_det_thresh = 0.3
#person_det_thresh = 0.3

classNamesStevedore = {1:"person", 
                        2:"boxes", 
                        3:"bags", 
                        4:"trolley", 
                        5:"truck_door_open", 
                        6:"truck_door_closed",
                        7:"loading_jack",}
#**********************************************************

#**********************VOI*********************
voi_strictly_approaching = True
voi_frame_counter = 50
#**********************VOI*********************

#**********************OBJECT DETECTION*********************
#partial_video_frame_diff = 6 #adjust this
full_video_frame_diff = 50  #adjust this

NUM_CLASSES = 10
INTESECTION_THRESH=0.15

thres=0.3
output_resize_shape = (580,340)
confidence_thres = 0.5
prob_thres = 0.3
process_every=4
process_frame_normal = 25 # Run every {process_frame_normal} frame
process_frame_breach = 15 # Run every {process_frame_breach} frame while in breach
use_model = 'ssdlite' #yolo
num_frames_kill_event = 3*process_frame_normal


MODEL_PATH_STEVEDORE = './models/frozen_inference_graph_95k.pb'
CLUSTER_PATH = './models/tf_clusters_300clusters_19jan.p'
SVM_PATH = './models/svm_C1_c300_19jan.p'

#**********************DRONE DETECTION*********************
drone_conf_thresh = 0.45 
drone_iou_thresh = 0.45
drone_conf_threshold = 0.55
MODEL_PATH_ONNX_DRONE = './models/640x640_nano_drone_best.onnx'
classNamesDrone = {0: "drone"}
frame_resize_dimension = (640,640)
max_frame_diff=20
stream_connect_threshold=100
stream_disconnect_threshold=100
last_cctv_inactive_time_threshold=300
time_intrusion_detection = 30
miss_counter_limit=500000
drone_bbox_color = (0,255,0)

crawl_breach_start_counter_min=50
time_camera_tampering = 20
###qrt
qrt_details={"status_1":"Accept","status_2":"Reach","status_3":"Resolve","action_1":"true","action_2":"false","action_3":"false",
             "lat_1":" ","lat_2":" ","lat_3":" ","long_1":" ","long_2":" ","long_3":" ","accepted_time":" ","reached_time":" ",
             "resolved_time":" ","qrt_image":" ","qrt_msg":" "}

#**********************OVERCROWD DETECTION*********************
overcrowd_start_counter_min = 30
overcrowd_threshold = 5

detectapi_drone_port=8082

analytics_app_port = 4441
dal_port = 4445
event_app_port = 4440


########################alert remove###########################
alert_delete_days_threshold=5
keep_alert_number_of_days=120
alert_remove_session_threshold=10


dummy_account_id = "dummy"
dummy_user_name = "shrenik@gmail.com"
