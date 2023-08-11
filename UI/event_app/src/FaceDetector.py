import torch
import numpy as np
# import onnx
import onnxruntime

from utils_torch.general import check_img_size, non_max_suppression, scale_coords
from config.config import *


class FaceDetector:
    def __init__(self):
        self.ort_session = onnxruntime.InferenceSession("models/FR_Detector.onnx")
        self.device = torch.device('cpu')

        # names=['front_face', 'side_face', 'covered_face']

    def get_face_bbox(self, frame):
        try:
            h, w, _ = frame.shape
            img = frame[:, :, ::-1].transpose(2, 0, 1)  # BGR to RGB, to 3x416x416

            img = np.ascontiguousarray(img)
            img = torch.from_numpy(img).to(self.device)
            img = img.float()  # uint8 to fp16/32
            img /= 255.0  # 0 - 255 to 0.0 - 1.0
            if img.ndimension() == 3:
                img = img.unsqueeze(0)

            # Inference
            ort_inputs = {self.ort_session.get_inputs()[0].name: np.array(img)}
            ort_outs = self.ort_session.run(None, ort_inputs)
            pred = torch.from_numpy(ort_outs[0])

            # Apply NMS
            pred = non_max_suppression(pred, 0.20, 0.35, None, agnostic=False)[0]
            pred = pred.tolist()
            return pred[0][:4]
        except:
            # logger.error("Exception occurred at **** detect_object_m1_onnx_fastapi / detect_object_bbox **** \n", exc_info=True)
            return []
# if __name__ == "__main__":
#     uvicorn.run("detect_object_m1_onnx_fastapi:app",host='0.0.0.0', port=8080, reload=True)
