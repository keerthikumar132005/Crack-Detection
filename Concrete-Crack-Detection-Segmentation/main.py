
from typing import Union
from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
from util.inference_utils import inference, create_model
from typing import List, Optional
from fastapi.responses import FileResponse
from pydantic import BaseModel
from fastapi import UploadFile, File
import io
from starlette.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2
from PIL import Image
from ultralytics import YOLO
import base64
class Parameters(BaseModel):
    input_nc: int = 3
    output_nc: int = 3
    ngf: int = 64
    ndf: int = 64
    netG:str = 'resnet_9blocks'
    norm: str = 'instance'
    init_type: str = 'xavier'
    init_gain: float = 0.02
    display_sides: int = 1
    num_classes: int = 1
    gpu_ids: List[int] = []
    isTrain: bool = False


app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

def from_image_to_bytes(img):
    """
    pillow image to bytes
    """
    imgByteArr = io.BytesIO()
    img.save(imgByteArr, format='png')
    imgByteArr = imgByteArr.getvalue()

    encoded = base64.b64encode(imgByteArr)
    decoded = encoded.decode('ascii')
    return decoded

#python-multipart
@app.post("/predict/{dim}/{unit}")
async def predict(dim:str, unit:str, file: UploadFile = File(...)):
    bytesImg = await file.read()
    width, height = [float(x) for x in dim.split('-')]    
    parameters = Parameters()
    model = create_model(parameters)
    predicted_cntr, visuals = inference(model, bytesImg, (width, height), unit) # Outputs Predicted Masks

    cntr_converted = from_image_to_bytes(Image.fromarray(predicted_cntr))
    
    img_list = [cntr_converted]
    
    for k in ['fused', 'side1', 'side2', 'side3', 'side4', 'side5']:
        map_ = from_image_to_bytes(Image.fromarray(visuals[k]))
        img_list.append(map_)
    return img_list


model = YOLO("best.pt")
class_labels = [
    'alligator_crack_high', 'alligator_crack_low', 'alligator_crack_medium',
    'long_transverse_crack_high', 'long_transverse_crack_low', 'long_transverse_crack_medium'
]

@app.post("/yolo-predict")
async def predict_cracks(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        results = model(img)
        result_img = results[0].plot()

        _, img_encoded = cv2.imencode('.jpg', result_img)
        base64_image = base64.b64encode(img_encoded).decode('utf-8')

        return {
            "image": base64_image,
            "predictions": [
                {
                    "class": class_labels[int(box.cls.item())],
                    "confidence": box.conf.item()
                }
                for box in results[0].boxes
            ]
        }
    except Exception as e:
        import traceback
        raise HTTPException(status_code=500, detail=f"{e}\n{traceback.format_exc()}")