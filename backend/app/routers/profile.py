from fastapi import APIRouter, Depends, HTTPException, status
from app.database import db
from app.schemas import ChangePasswordRequest
from app.routers.auth import get_current_user, verify_password, get_password_hash
from datetime import datetime

router = APIRouter(prefix="/profile", tags=["profile"])

@router.put("/change-password", status_code=status.HTTP_200_OK)
def change_password(
    data: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user)
):
    user = db.users.find_one({"email": current_user["email"]})
    if not user:
        raise HTTPException(status_code=404, detail="Користувача не знайдено")

    if not verify_password(data.old_password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Старий пароль невірний")

    new_hashed_password = get_password_hash(data.new_password)

    result = db.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "hashed_password": new_hashed_password,
                "updated_at": datetime.utcnow()
            }
        }
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Не вдалося оновити пароль")

    return {"message": "Пароль успішно змінено"}
