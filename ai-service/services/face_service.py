import numpy as np
from deepface import DeepFace
from datetime import datetime
from utils.database import get_db
from utils.cloudinary_helper import upload_image
import cv2

# =====================
# CONSTANTS
# =====================
COLLECTION_NAME = "face_embeddings"
MODEL_NAME = "Facenet"       # DeepFace ka model
THRESHOLD = 10               # Distance threshold
                              # Isse kam = match
                              # Isse zyada = no match

def get_embedding(image_array: np.ndarray) -> list:
    """
    Image se face embedding nikalo
    128 numbers ka array return karo
    """
    try:
        # DeepFace se embedding nikalo
        result = DeepFace.represent(
            img_path=image_array,
            model_name=MODEL_NAME,
            enforce_detection=True,  # Face nahi mila to error
            detector_backend="opencv"
        )

        # Pehla face ka embedding lo
        embedding = result[0]["embedding"]
        return embedding

    except Exception as e:
        raise Exception(f"Face not detected: {str(e)}")


def register_face(
    employee_id: str,
    employee_name: str,
    image_bytes: bytes
) -> dict:
    """
    Employee ka face register karo
    """
    db = get_db()
    collection = db[COLLECTION_NAME]

    # Bytes → NumPy array convert karo
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if image is None:
        raise Exception("Invalid image")

    # Face embedding nikalo
    embedding = get_embedding(image)

    # Cloudinary pe image upload karo
    image_url = upload_image(image_bytes, folder="recognisense/faces")

    # MongoDB mein check karo — employee already registered?
    existing = collection.find_one({"employee_id": employee_id})

    if existing:
        # Already registered hai — naya embedding add karo
        # Zyada embeddings = better recognition
        collection.update_one(
            {"employee_id": employee_id},
            {
                "$push": {
                    "embeddings": embedding,
                    "image_urls": image_url
                },
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        message = f"Face added for {employee_name}"
    else:
        # Pehli baar register ho raha hai
        collection.insert_one({
            "employee_id": employee_id,
            "employee_name": employee_name,
            "embeddings": [embedding],   # Array — multiple photos
            "image_urls": [image_url],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        })
        message = f"Face registered for {employee_name}"

    return {
        "success": True,
        "employee_id": employee_id,
        "employee_name": employee_name,
        "image_url": image_url,
        "message": message
    }


def recognize_face(image_bytes: bytes) -> dict:
    """
    Image mein face identify karo
    """
    db = get_db()
    collection = db[COLLECTION_NAME]

    # Bytes → NumPy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if image is None:
        raise Exception("Invalid image")

    # Query image ka embedding nikalo
    try:
        query_embedding = get_embedding(image)
    except Exception:
        return {
            "recognized": False,
            "confidence": 0.0,
            "message": "No face detected in image"
        }

    # Database ke saare employees ke embeddings lo
    all_faces = list(collection.find({}))

    if not all_faces:
        return {
            "recognized": False,
            "confidence": 0.0,
            "message": "No faces registered yet"
        }

    # Sabse close match dhundo
    best_match = None
    best_distance = float('inf')  # Shuru mein infinity

    query_array = np.array(query_embedding)

    for face_record in all_faces:
        # Is employee ke saare embeddings se compare karo
        for stored_embedding in face_record["embeddings"]:
            stored_array = np.array(stored_embedding)

            # Euclidean distance calculate karo
            # Distance = kitne alag hain dono faces
            # 0 = exactly same
            # Zyada = zyada alag
            distance = np.linalg.norm(query_array - stored_array)

            if distance < best_distance:
                best_distance = distance
                best_match = face_record

    # Threshold check karo
    if best_distance <= THRESHOLD:
        # Confidence calculate karo — 0 to 1
        confidence = round(1 - (best_distance / THRESHOLD), 2)
        confidence = max(0.0, min(1.0, confidence))  # 0-1 ke beech rakho

        return {
            "recognized": True,
            "employee_id": best_match["employee_id"],
            "employee_name": best_match["employee_name"],
            "confidence": confidence,
            "message": f"Recognized as {best_match['employee_name']}"
        }
    else:
        return {
            "recognized": False,
            "confidence": 0.0,
            "message": "Face not recognized"
        }


def get_registered_faces() -> list:
    """
    Saare registered faces ki list
    """
    db = get_db()
    collection = db[COLLECTION_NAME]

    faces = list(collection.find(
        {},
        # Embeddings mat bhejo — bahut bada data hai
        {"embeddings": 0, "_id": 0}
    ))

    return faces


def delete_face(employee_id: str) -> dict:
    """
    Employee ka face data delete karo
    """
    db = get_db()
    collection = db[COLLECTION_NAME]

    result = collection.delete_one({"employee_id": employee_id})

    if result.deleted_count == 0:
        raise Exception(f"No face found for employee {employee_id}")

    return {
        "success": True,
        "message": f"Face data deleted for employee {employee_id}"
    }