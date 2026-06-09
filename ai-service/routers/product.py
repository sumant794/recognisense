from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.product_service import (
    register_product,
    recognize_product,
    get_registered_products
)

router = APIRouter()

@router.post("/register")
async def register_product_endpoint(
    product_id: str = Form(...),
    product_name: str = Form(...),
    sku: str = Form(...),
    image: UploadFile = File(...)
):
    try:
        image_bytes = await image.read()

        if not image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Only image files allowed")

        result = register_product(product_id, product_name, sku, image_bytes)

        return {"status": "success", "data": result}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/recognize")
async def recognize_product_endpoint(
    image: UploadFile = File(...)
):
    try:
        image_bytes = await image.read()

        if not image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Only image files allowed")

        result = recognize_product(image_bytes)

        return {"status": "success", "data": result}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/list")
async def list_products():
    try:
        products = get_registered_products()
        return {
            "status": "success",
            "count": len(products),
            "data": products
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))