from fastapi import APIRouter, HTTPException, status
from typing import List
from app.database import db
from app.schemas import TransportCreate, TransportResponse
from app.utils.utils import get_transport_list

router = APIRouter(prefix="/transports", tags=["transports"])

@router.post("/", response_model=TransportResponse, status_code=status.HTTP_201_CREATED)
async def create_transport(data: TransportCreate):
    try:
        result = db.transports.insert_one(data.dict())
        item = db.transports.find_one({"_id": result.inserted_id})
        return item
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/", response_model=List[TransportResponse])
async def list_transports():
    try:
        items = get_transport_list(db.transports.find())
        return items
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
