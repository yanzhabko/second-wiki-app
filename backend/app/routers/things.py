from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from app.database import db
from app.schemas import ThingCreate, ThingResponse
from app.routers.auth import get_current_admin
from app.utils.utils import get_things_list

router = APIRouter(prefix="/things", tags=["things"])

@router.post("/", response_model=ThingResponse, status_code=status.HTTP_201_CREATED)
async def create_thing(data: ThingCreate, current: dict = Depends(get_current_admin)):
    try:
        result = db.things.insert_one(data.dict())
        item = db.things.find_one({"_id": result.inserted_id})
        return item
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    
@router.get("/", response_model=List[ThingResponse])
async def list_things():
    try:
        items =  get_things_list(db.things.find())
        return items
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))