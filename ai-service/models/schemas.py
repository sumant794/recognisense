from pydantic import BaseModel
from typing import Optional, List

# FACE SCHEMAS

class FaceRegisterRequest(BaseModel):
    """Face register karne ke liye"""
    employee_id: str
    employee_name: str

class FaceRecognitionResponse(BaseModel):
    """Face recognition ka result"""
    recognized: bool
    employee_id: Optional[str] = None
    employee_name: Optional[str] = None
    confidence: float = 0.0
    message: str

# =====================
# PRODUCT SCHEMAS
# =====================

class ProductTrainRequest(BaseModel):
    """Product train karne ke liye"""
    product_id: str
    product_name: str
    sku: str

class ProductRecognitionResponse(BaseModel):
    """Product recognition ka result"""
    recognized: bool
    product_id: Optional[str] = None
    product_name: Optional[str] = None
    sku: Optional[str] = None
    confidence: float = 0.0
    message: str

# GENERAL

class HealthResponse(BaseModel):
    status: str
    message: str
    environment: str