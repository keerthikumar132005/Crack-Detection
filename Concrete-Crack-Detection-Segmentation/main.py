
from typing import Union
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from util.inference_utils import inference, create_model
from typing import List, Optional
from fastapi.responses import FileResponse
from pydantic import BaseModel
from fastapi import UploadFile, File
from io import BytesIO
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


def image_to_base64(img: Image.Image) -> str:
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")

@app.post("/predict/{dim}/{unit}")
async def predict(dim: str, unit: str, file: UploadFile = File(...)):
    bytesImg = await file.read()
    width, height = [float(x) for x in dim.split('-')]    

    parameters = Parameters()
    model = create_model(parameters)

    result_img, visuals, metrics = inference(model, bytesImg, (width, height), unit)

    # Convert result image to base64
    result_b64 = image_to_base64(Image.fromarray(result_img))

    # Convert all visual maps to base64
    visuals_b64 = {}
    for k in ['fused', 'side1', 'side2', 'side3', 'side4', 'side5']:
        visuals_b64[k] = image_to_base64(Image.fromarray(visuals[k]))

    # Combine response
    response = {
        "result_image": result_b64,
        "visuals": visuals_b64,
        "metrics": {
            "length_mm": round(metrics["length"], 1),
            "width_mm": round(metrics["width"], 1),
            "angle_deg": round(metrics["angle"], 1),
            "category": metrics["category"],
            "crack_percentage": round(metrics["crack_percentage"] * 100, 2)
        }
    }

    return JSONResponse(content=response)



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