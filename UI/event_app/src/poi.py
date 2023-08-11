import cv2
import numpy as np
import tensorflow as tf
from mtcnn.mtcnn import MTCNN
from tensorflow.python.platform import gfile
from config.config import *

# tf.disable_v2_behavior()
detector = MTCNN()
facenet_model = facenet_model_path

with tf.io.gfile.GFile(facenet_model, 'rb') as f:
    graph_def = tf.compat.v1.GraphDef()
    graph_def.ParseFromString(f.read())

sess = tf.compat.v1.Session()
sess.graph.as_default()
tf.import_graph_def(graph_def)

# f = gfile.FastGFile(facenet_model, 'rb')
# graph_def = tf.GraphDef()
# graph_def.ParseFromString(f.read())
# f.close()
# sess = tf.Session()
# sess.graph.as_default()

# tf.import_graph_def(graph_def)
output_tensor1 = sess.graph.get_tensor_by_name('import/Bottleneck_BatchNorm/batchnorm_1/add_1:0')

def get_normalized_face_patch(face_bbox,frame):
    face_patch = frame[int(face_bbox[1]):int(face_bbox[3]),int(face_bbox[0]):int(face_bbox[2]),:]
    resized_face = cv2.resize(face_patch,(160,160),cv2.INTER_CUBIC)
    normalized_face = np.expand_dims((resized_face - resized_face.mean())/(resized_face.std()),axis=0)
    return normalized_face


def get_face_embeddings(face_bbox,frame):
    normalized_patch = get_normalized_face_patch(face_bbox,frame)
    face_embeddings = sess.run(output_tensor1, {'import/input_1:0': normalized_patch})
    return face_embeddings


def get_object_bbox_m1(frame):
    face_arr = []
    faces = detector.detect_faces(frame)
    for face in faces:
        x, y, w, h = face['box']
        x1 = x
        y1 = y
        x2 = x+w
        y2 = y+h
        face_arr.append([int(x1),int(y1),int(x2),int(y2),1])

    return face_arr






