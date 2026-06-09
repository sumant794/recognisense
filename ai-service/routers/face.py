from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.face_service import (
    register_face,
    recognize_face,
    get_registered_faces,
    delete_face
)

router = APIRouter()

# =====================
# REGISTER FACE
# POST /api/face/register
# =====================
@router.post("/register")
async def register_face_endpoint(
    employee_id: str = Form(...),       # Form data
    employee_name: str = Form(...),     # Form data
    image: UploadFile = File(...)       # Image file
):
    """
    Employee ka face register karo
    Multiple photos upload kar sakte ho better accuracy ke liye
    """
    try:
        # File ko bytes mein convert karo
        image_bytes = await image.read()

        # Validate — image hai?
        if not image.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400,
                detail="Only image files allowed"
            )

        result = register_face(employee_id, employee_name, image_bytes)

        return {
            "status": "success",
            "data": result
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =====================
# RECOGNIZE FACE
# POST /api/face/recognize
# =====================
@router.post("/recognize")
async def recognize_face_endpoint(
    image: UploadFile = File(...)
):
    """
    Image mein face recognize karo
    """
    try:
        image_bytes = await image.read()

        if not image.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400,
                detail="Only image files allowed"
            )

        result = recognize_face(image_bytes)

        return {
            "status": "success",
            "data": result
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =====================
# GET ALL REGISTERED FACES
# GET /api/face/list
# =====================
@router.get("/list")
async def list_faces():
    """
    Saare registered faces ki list
    """
    try:
        faces = get_registered_faces()
        return {
            "status": "success",
            "count": len(faces),
            "data": faces
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =====================
# DELETE FACE
# DELETE /api/face/{employee_id}
# =====================
@router.delete("/{employee_id}")
async def delete_face_endpoint(employee_id: str):
    """
    Employee ka face data delete karo
    """
    try:
        result = delete_face(employee_id)
        return {
            "status": "success",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))