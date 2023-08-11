import cv2
import numpy as np
import torch

from config.config import *
from MobileFaceNets import MobileFaceNet


class FaceRecognition:
    def __init__(self):
        model_path = recg_path
        self.backbone = MobileFaceNet(embedding_size=512, out_w=7, out_h=7)
        self.backbone.load_state_dict(torch.load(model_path, map_location='cpu'))
        self.backbone.to('cpu')
        self.backbone.eval()


    def get_embeddings(self, img):
        def l2_norm(ip, axis=1):
            norm = torch.norm(ip, 2, axis, True)
            output = torch.div(ip, norm)
            return output

        # resize image to [128, 128]
        # print(img.shape)
        resized = cv2.resize(img, (128, 128))

        # center crop image
        a = int((128 - 112) / 2)  # x start
        b = int((128 - 112) / 2 + 112)  # x end
        c = int((128 - 112) / 2)  # y start
        d = int((128 - 112) / 2 + 112)  # y end
        ccropped = resized[a:b, c:d]  # center crop the image
        ccropped = ccropped[..., ::-1]  # BGR to RGB

        # load numpy to tensor
        ccropped = ccropped.swapaxes(1, 2).swapaxes(0, 1)
        ccropped = np.reshape(ccropped, [1, 3, 112, 112])
        ccropped = np.array(ccropped, dtype=np.float32)
        ccropped = (ccropped - 127.5) / 128.0
        ccropped = torch.from_numpy(ccropped)

        tta = True

        with torch.no_grad():
            if tta:
                emb_batch = self.backbone(ccropped.to('cpu')).cpu()
                features = l2_norm(emb_batch)
            else:
                features = l2_norm(self.backbone(ccropped.to('cpu')).cpu())

        return features.numpy()
