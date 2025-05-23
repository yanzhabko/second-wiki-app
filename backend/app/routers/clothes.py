from fastapi import APIRouter, HTTPException, Depends, status, UploadFile, File, Form
from typing import List
from app.database import db
from app.routers.auth import get_current_admin
from app.utils.utils import get_clothes_list
from app.schemas import ClothesResponse
from bson import ObjectId
import gridfs
from fastapi.responses import StreamingResponse


router = APIRouter(prefix="/clothes", tags=["clothes"])

fs = gridfs.GridFS(db)

@router.post("/", response_model=ClothesResponse, status_code=status.HTTP_201_CREATED)
async def create_clothes(
    type: str = Form(...),
    name: str = Form(...),
    description: str = Form(...),
    tag: List[str] = Form(...),
    image: UploadFile = File(...),
    current: dict = Depends(get_current_admin)
):
    try:
        image_bytes = await image.read()
        image_id = fs.put(image_bytes, filename=image.filename, content_type=image.content_type)
        clothes_data = {
            "type": type,
            "name": name,
            "description": description,
            "tag": tag,
            "image_id": image_id
        }

        insert_result = db.clothes.insert_one(clothes_data)
        created = db.clothes.find_one({"_id": insert_result.inserted_id})
        if not created:
            raise HTTPException(status_code=404, detail="Not found after insert")
        
        created["id"] = str(created["_id"])
        created["image_id"] = str(created["image_id"])
        return created
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/", response_model=List[ClothesResponse], status_code=status.HTTP_200_OK)
async def list_clothes():
    try:
        items = get_clothes_list(db.clothes.find())
        return items
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    

@router.get("/image/{image_id}")
async def get_image(image_id: str):
    try:
        file_id = ObjectId(image_id)
        grid_out = fs.get(file_id)
        return StreamingResponse(grid_out, media_type=grid_out.content_type)
    except Exception:
        raise HTTPException(status_code=404, detail="Image not found")
