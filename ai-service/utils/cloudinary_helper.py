import cloudinary 
import cloudinary.uploader 
from config.settings import settings
import base64
import numpy as np
import cv2

# Cloudinary configure karo 
cloudinary.config(
    cloud_name = settings.CLOUDINARY_CLOUD_NAME,
    api_key = settings.CLOUDINARY_API_KEY,
    api_secret = settings.CLOUDINARY_API_SECRET,
)

def upload_image(image_bytes: bytes, folder: str = "recognisense") -> str:
    """
        Image bytes Cloudinary pe upload karo
        URL return karo
    """  
    try: 
        result = cloudinary.uploader.upload(
            image_bytes,
            folder = folder,
            resource_type = "image"
        )  
        return result['secure_url']
    except Exception as e:
        print(f"❌ Cloudinary upload failed: {e}")
        raise e


def upload_numpy_image(
    image_array: np.ndarray,
    folder: str = "recognisense"  
) -> str:
    """
    NumPy array (OpenCV image) Cloudinary pe upload karo
    """
    # Numpy array -> bytes convert karo 
    _, buffer =  cv2.imencode('.jpg', image_array)
    image_bytes = buffer.tobytes()
    return upload_image(image_bytes, folder)
    
