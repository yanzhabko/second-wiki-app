from fastapi import APIRouter, HTTPException, Depends, status, UploadFile, File, Form
from typing import List
from app.database import db
from app.routers.auth import get_current_admin
from app.schemas import ThingResponse
from app.utils.utils import get_things_list
import gridfs

router = APIRouter(prefix="/accessories", tags=["accessories"])

fs = gridfs.GridFS(db)

@router.post("/", response_model=ThingResponse, status_code=status.HTTP_201_CREATED)
async def create_accessory(
    type: str = Form(...),
    name: str = Form(...),
    description: str = Form(...),
    tag: List[str] = Form(...),
    image: UploadFile = File(None),
    current: dict = Depends(get_current_admin)
):
    try:
        image_id = None
        if image is not None:
            image_bytes = await image.read()
            image_id = fs.put(image_bytes, filename=image.filename, content_type=image.content_type)
        
        accessory_data = {
            "type": type,
            "name": name,
            "description": description,
            "tag": tag,
            "image_id": image_id
        }

        insert_result = db.accessories.insert_one(accessory_data)
        created = db.accessories.find_one({"_id": insert_result.inserted_id})
        if not created:
            raise HTTPException(status_code=404, detail="Not found after insert")
        
        created["id"] = str(created["_id"])
        if created["image_id"]:
            created["image_id"] = str(created["image_id"])
        return created
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/", response_model=List[ThingResponse], status_code=status.HTTP_200_OK)
async def list_accessories():
    try:
        items = get_things_list(db.accessories.find())
        return items
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
