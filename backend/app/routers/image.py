import gridfs
from fastapi import APIRouter, HTTPException
from app.database import db
from bson import ObjectId
from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/image", tags=["image"])

fs = gridfs.GridFS(db)

@router.get("/{image_id}")
async def get_image(image_id: str):
    try:
        file_id = ObjectId(image_id)
        grid_out = fs.get(file_id)
        return StreamingResponse(grid_out, media_type=grid_out.content_type)
    except Exception:
        raise HTTPException(status_code=404, detail="Image not found")
