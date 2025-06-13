import torch
import cv2
import numpy as np
import torch.nn as nn
from ultralytics import YOLO

class DetectNet(nn.Module):
    def __init__(self, model, save_name):
        super().__init__()
        self.model = model
        self.save_name = save_name

    def forward(self, img):
        # Prediction
        prediction = self.model(img)
        detect_img = prediction[0].plot()

        # Save detected image
        cv2.imwrite(self.save_name, detect_img)

        # Take out area and prediction score
        boxes = 0
        for predict in prediction:
            boxes = predict.boxes.numpy()

        return self.result(boxes)

    def result(self, boxes):
        out = []
        for box in boxes:
            x_min, y_min, x_max, y_max, score, _ = [item for i in box.data for item in i]
            area = (x_max - x_min) * (y_max - y_min)
            out.append([np.round(area, 2), np.round(score * 100, 2)])
        return out
