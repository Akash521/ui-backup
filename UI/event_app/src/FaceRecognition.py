import cv2
import numpy as np
# from keras.models import load_model
import tensorflow.compat.v1 as tf
from scipy.spatial.distance import cosine
from tensorflow.python.platform import gfile
from config.config import *

tf.disable_v2_behavior()

class FaceRecognition:
    def __init__(self):
        facenet_model = facenet_model_path

        ##Reading the pb file
        self.f = gfile.FastGFile(facenet_model, 'rb')
        self.graph_def = tf.GraphDef()
        # Parses a serialized binary message into the current message.
        self.graph_def.ParseFromString(self.f.read())
        self.f.close()
        self.sess = tf.Session()
        self.sess.graph.as_default()
        # Import a serialized TensorFlow `GraphDef` protocol buffer
        # and place into the current default `Graph`.
        tf.import_graph_def(self.graph_def)

    def get_embeddings(self, frame,bbox):
        face = frame[int(bbox[1]):int(bbox[3]), int(bbox[0]):int(bbox[2])]
        face = face - 127.5
        face = face * 0.0078125
        face = cv2.resize(face, (160,160), cv2.INTER_CUBIC)
        face_norm = np.expand_dims((face - face.mean())/(face.std()),axis=0)
        output_tensor1 = self.sess.graph.get_tensor_by_name('import/Bottleneck_BatchNorm/batchnorm_1/add_1:0')
        embd = self.sess.run(output_tensor1, {'import/input_1:0': face_norm})
        return embd

