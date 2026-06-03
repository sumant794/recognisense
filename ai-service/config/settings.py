from dotenv import load_dotenv
import os

# .env file load karo
load_dotenv()

class Settings:
    # Server
    PORT: int = int(os.getenv("PORT", "8000"))
    ENV: str = os.getenv("NODE_ENV", "development")

    # MongoDB
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")

    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    CLOUDINARY_API_KEY: str = os.getenv("CLOUDINARY_API_KEY", "")
    CLOUDINARY_API_SECRET: str = os.getenv("CLOUDINARY_API_SECRET", "")

    # Backend
    BACKEND_URL: str = os.getenv("BACKEND_URL", "http://localhost:5000")

# Ek instance banao — poori app mein yahan se import karenge
settings = Settings()