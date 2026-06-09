from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config.settings import settings
from utils.database import connect_db
from routers.face import router as face_router
from routers.product import router as product_router

# LIFESPAN — Startup/Shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup — server shuru hone pe
    print("# Startup — server shuru hone pe")
    connect_db()
    print(f"✅ AI Service running on port { settings.PORT}")
    yield
    #shutdown - server band hone pe 
    print("👋 Shutting down AI Service...")

# APP BANAO
app = FastAPI(
    title="Recognisense AI Service",
    decsription="Face and Product Recognition API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================
# ROUTES
# =====================
app.include_router(face_router, prefix="/api/face", tags=["Face Recognition"])
app.include_router(product_router, prefix="/api/product", tags=["Product Recognition"])

@app.get("/health")
async def health_check():
    return{
        "status": "ok",
        "message": "RecogniSense AI Service is running",
        "environment": settings.ENV
    }


