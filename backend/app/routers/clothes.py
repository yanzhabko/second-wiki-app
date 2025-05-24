from bson import ObjectId
import gridfs
from fastapi import APIRouter, HTTPException, Depends, status, UploadFile, File, Form
from typing import List
from app.database import db
from app.routers.auth import get_current_admin
from app.utils.utils import get_things_list
from app.schemas import ThingResponse


router = APIRouter(prefix="/clothes", tags=["clothes"])

fs = gridfs.GridFS(db)

@router.post("/", response_model=ThingResponse, status_code=status.HTTP_201_CREATED)
async def create_clothes(
    type: str = Form(...),
    name: str = Form(None),
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


@router.get("/", response_model=List[ThingResponse], status_code=status.HTTP_200_OK)
async def list_clothes():
    try:
        items = get_things_list(db.clothes.find())
        return items
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    

@router.put("/{item_id}", response_model=ThingResponse, status_code=status.HTTP_200_OK)
async def update_clothes(
    item_id: str,
    type: str = Form(...),
    name: str = Form(None),
    description: str = Form(...),
    tag: List[str] = Form(...),
    image: UploadFile = File(None),
    current: dict = Depends(get_current_admin)
):
    try:
        existing_item = db.clothes.find_one({"_id": ObjectId(item_id)})
        if not existing_item:
            raise HTTPException(status_code=404, detail="Item not found")

        update_data = {
            "type": type,
            "name": name,
            "description": description,
            "tag": tag,
        }

        if image:
            # Видаляємо старе зображення, якщо є
            if "image_id" in existing_item and existing_item["image_id"]:
                fs.delete(existing_item["image_id"])

            image_bytes = await image.read()
            new_image_id = fs.put(image_bytes, filename=image.filename, content_type=image.content_type)
            update_data["image_id"] = new_image_id
        else:
            # Якщо не оновлюємо зображення, зберігаємо старе
            if "image_id" in existing_item:
                update_data["image_id"] = existing_item["image_id"]

        db.clothes.update_one({"_id": ObjectId(item_id)}, {"$set": update_data})

        updated_item = db.clothes.find_one({"_id": ObjectId(item_id)})
        updated_item["id"] = str(updated_item["_id"])
        updated_item["image_id"] = str(updated_item.get("image_id")) if updated_item.get("image_id") else None

        return updated_item

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_clothes(item_id: str, current: dict = Depends(get_current_admin)):
    try:
        existing_item = db.clothes.find_one({"_id": ObjectId(item_id)})
        if not existing_item:
            raise HTTPException(status_code=404, detail="Item not found")

        # Видалення зображення, якщо воно є
        if "image_id" in existing_item and existing_item["image_id"]:
            fs.delete(existing_item["image_id"])

        # Видалення самого елемента
        db.clothes.delete_one({"_id": ObjectId(item_id)})

        return {"message": "Одяг успішно видалено"}
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
