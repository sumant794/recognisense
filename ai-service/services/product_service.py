import numpy as np
from ultralytics import YOLO
from datetime import datetime
from utils.database import get_db
from utils.cloudinary_helper import upload_image
import cv2
import os

COLLECTION_NAME = "product_embeddings"
MODEL_PATH = "yolov8n.pt"

def get_or_load_model():
    return YOLO(MODEL_PATH)

def register_product(
    product_id: str,
    product_name: str,
    sku: str,
    image_bytes: bytes
) -> dict:
    db = get_db()
    collection = db[COLLECTION_NAME]

    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if image is None:
        raise Exception("Invalid image")

    image_url = upload_image(image_bytes, folder="recognisense/products")

    existing = collection.find_one({"product_id": product_id})

    if existing:
        collection.update_one(
            {"product_id": product_id},
            {
                "$push": {"image_urls": image_url},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        message = f"Image added for {product_name}"
    else:
        collection.insert_one({
            "product_id": product_id,
            "product_name": product_name,
            "sku": sku,
            "image_urls": [image_url],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        })
        message = f"Product registered: {product_name}"

    return {
        "success": True,
        "product_id": product_id,
        "product_name": product_name,
        "sku": sku,
        "image_url": image_url,
        "message": message
    }


def recognize_product(image_bytes: bytes) -> dict:
    db = get_db()
    collection = db[COLLECTION_NAME]

    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if image is None:
        raise Exception("Invalid image")

    all_products = list(collection.find({}))

    if not all_products:
        return {
            "recognized": False,
            "confidence": 0.0,
            "message": "No products registered yet"
        }

    model = get_or_load_model()
    results = model(image)

    best_confidence = 0.0
    detected = False

    for result in results:
        boxes = result.boxes
        if boxes is not None and len(boxes) > 0:
            for box in boxes:
                conf = float(box.conf[0])
                if conf > best_confidence:
                    best_confidence = conf
                    detected = True

    if not detected or best_confidence < 0.3:
        return {
            "recognized": False,
            "confidence": 0.0,
            "message": "No product detected in image"
        }

    matched_product = all_products[0]

    return {
        "recognized": True,
        "product_id": matched_product["product_id"],
        "product_name": matched_product["product_name"],
        "sku": matched_product["sku"],
        "confidence": round(best_confidence, 2),
        "message": f"Detected: {matched_product['product_name']}"
    }


def get_registered_products() -> list:
    db = get_db()
    collection = db[COLLECTION_NAME]
    products = list(collection.find({}, {"_id": 0}))
    return products