
from typing import Union
from fastapi import FastAPI, File, UploadFile, HTTPException,Query,Body
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
import requests

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
async def predict_cracks(
    file: UploadFile = File(...),
    pixel_mm: float = Query(0.2, description="Physical size of one image pixel in millimeters (default = 0.2)")
):
    try:
        # Read and decode the image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        h_px, w_px = img.shape[:2]

        # Convert overall image size to mm
        image_width_mm = round(w_px * pixel_mm, 2)
        image_height_mm = round(h_px * pixel_mm, 2)

        # Run YOLO inference
        results = model(img)[0]
        result_img = results.plot()  # annotated image

        # 1) Compute union area by rasterizing boxes
        box_mask = np.zeros((h_px, w_px), dtype=np.uint8)
        for box in results.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
            cv2.rectangle(box_mask, (x1, y1), (x2, y2), color=1, thickness=-1)
        union_area_px = int(box_mask.sum())

        # 2) Prefer segmentation masks if available
        if results.masks is not None:
            masks = results.masks.data.cpu().numpy()  # (N, H, W)
            combined = np.clip(masks.sum(axis=0), 0, 1).astype(np.uint8)
            union_area_px = int(combined.sum())

        # Calculate crack coverage percentage
        crack_percentage = round((union_area_px / (h_px * w_px)) * 100, 2)

        # Convert union area to mm^2
        union_area_mm2 = round(union_area_px * (pixel_mm ** 2), 2)

        # Build detailed predictions
        predictions = []
        for box in results.boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            bx_w_px = x2 - x1
            bx_h_px = y2 - y1
            area_px = int(bx_w_px * bx_h_px)

            # Convert to mm
            bx_w_mm = round(bx_w_px * pixel_mm, 2)
            bx_h_mm = round(bx_h_px * pixel_mm, 2)
            area_mm2 = round(area_px * (pixel_mm ** 2), 2)

            cls_idx = int(box.cls.item())
            label = class_labels[cls_idx] if cls_idx < len(class_labels) else "unknown"

            predictions.append({
                "class": label,
                "confidence": round(float(box.conf), 2),
                "bounding_box_px": {
                    "x_min": int(x1),
                    "y_min": int(y1),
                    "x_max": int(x2),
                    "y_max": int(y2)
                },
                "bounding_box_mm": {
                    "width": bx_w_mm,
                    "height": bx_h_mm
                },
                "area_mm2": area_mm2
            })

        # Encode annotated image back to base64
        _, img_encoded = cv2.imencode('.jpg', result_img)
        base64_image = base64.b64encode(img_encoded).decode('utf-8')

        # Return JSON response
        return {
            "image": base64_image,
            "image_width_mm": image_width_mm,
            "image_height_mm": image_height_mm,
            "crack_percentage": crack_percentage,
            "total_crack_area_mm2": union_area_mm2,
            "predictions": predictions
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from recommendations import recommend_healing_agent, generate_synthetic_data

synthetic_df = generate_synthetic_data(num_samples_per_technique=100)

# Your OpenWeatherMap API key (replace with your actual key)
OPENWEATHER_API_KEY = "cd00e7788b0875d723c6def73b8c16e7"

def get_weather(lat, lon):
    """
    Fetch current temperature (°C) and humidity (%) using OpenWeather API.
    """
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
    response = requests.get(url)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch weather data.")
    
    data = response.json()
    temperature = data["main"]["temp"]
    humidity = data["main"]["humidity"]
    return temperature, humidity


@app.post("/recommendation")
async def get_recommendation_post(payload: dict = Body(...)):
    try:
        crack_width = payload.get("crack_width")
        lat = payload.get("latitude")
        lon = payload.get("longitude")
        if crack_width is None or lat is None or lon is None:
            raise HTTPException(status_code=400, detail="Missing required fields: crack_width, latitude, longitude.")

        # Step 1: Get real-time weather
        temperature, humidity = get_weather(lat, lon)

        # Step 2: Generate recommendations
        recommended_methods = recommend_healing_agent(crack_width, temperature, humidity, synthetic_df)

        # Step 3: Return full response
        return {
            "crack_width_mm": crack_width,
            "location": {
                "latitude": lat,
                "longitude": lon
            },
            "weather": {
                "temperature_C": temperature,
                "humidity_%": humidity
            },
            "recommended_methods": recommended_methods
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
