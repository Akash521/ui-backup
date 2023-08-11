# import cv2
import numpy as np

# import PIL.Image
import dlib
# import numpy as np
# from PIL import ImageFile
from config.config import *

class FaceRecognition:
    def __init__(self):
        model_path = 'models/dlib_face_recognition_resnet_model_v1.dat'
        face_points_path = 'models/shape_predictor_5_face_landmarks.dat'
        self.face_encoder = dlib.face_recognition_model_v1(model_path)
        self.pose_predictor = dlib.shape_predictor(face_points_path)

    def get_embeddings(self, img,det):
        raw_landmark = self.pose_predictor(img, dlib.rectangle(det[0], det[1], det[2], det[3]))
        features = np.array([self.face_encoder.compute_face_descriptor(img, raw_landmark, num_jitters=1)]).astype('float32') 
        return features
