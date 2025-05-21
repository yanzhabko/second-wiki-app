from fastapi import APIRouter, Depends, HTTPException, status
from app.database import db
from app.schemas import ChangePasswordRequest, UserResponse
from passlib.context import CryptContext
from datetime import datetime


router = APIRouter(prefix="/profile", tags=["profile"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

@router.put("/change-password", status_code=status.HTTP_200_OK)
def change_password(
    data: ChangePasswordRequest,
    current_user: UserResponse = Depends(),
):
    user = db.user.find_one({"_id": current_user.id})
    if not user:
        raise HTTPException(status_code=404, detail="Користувача не знайдено")

    if not verify_password(data.old_password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Старий пароль невірний")

    new_hashed_password = get_password_hash(data.new_password)

    result = db.user.update_one(
        {"_id": current_user.id},
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
