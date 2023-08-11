import cv2
import numpy as np
# from keras.models import load_model
import tensorflow.compat.v1 as tf
from scipy.spatial.distance import cosine
from tensorflow.python.platform import gfile
from config.config import *


tf.disable_v2_behavior()

#import dlib
#from imutils import face_utils

#shape_predictor = dlib.shape_predictor('./models/shape_predictor_5_face_landmarks.dat')
#fa = face_utils.facealigner.FaceAligner(shape_predictor, desiredFaceWidth=112)

class FaceRecognition:
    def __init__(self):
        MODEL_PATH = face_recognition_model_path
        print('Model filename: %s' % MODEL_PATH)
        with tf.gfile.FastGFile(MODEL_PATH, 'rb') as f:
            graph_def = tf.GraphDef()
            graph_def.ParseFromString(f.read())
            tf.import_graph_def(graph_def, name='')
        self.inputs_placeholder = tf.get_default_graph().get_tensor_by_name("input:0")
        self.embeddings = tf.get_default_graph().get_tensor_by_name("embeddings:0")
        self.sess = tf.Session()

    def get_embeddings(self, frame,bbox):
        #gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        #face = fa.align(frame, gray, dlib.rectangle(left = int(bbox[0]), top=int(bbox[1]), right=int(bbox[2]), bottom=int(bbox[3])))
        face = frame[int(bbox[1]):int(bbox[3]), int(bbox[0]):int(bbox[2])]
        face = face - 127.5
        face = face * 0.0078125

        face = cv2.resize(face, (112,112), cv2.INTER_CUBIC)
        image= face.reshape((1, 112,112,3))
        feed_dict = {self.inputs_placeholder: image}
        embd = self.sess.run(self.embeddings, feed_dict=feed_dict)
        return embd


