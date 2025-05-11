from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.collection import Collection
from bson.objectid import ObjectId
from fastapi.security import OAuth2PasswordRequestForm

from app.database import get_user_collection
from app.schemas import UserCreate, UserResponse
from app.utils.auth_utils import get_password_hash, create_access_token, verify_password

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, users: Collection = Depends(get_user_collection)):
    existing_user = users.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    hashed_pw = get_password_hash(user.password)
    new_user = {
        "username": user.username,
        "hashed_password": hashed_pw,
        "role": "User"
    }
    result = users.insert_one(new_user)
    created_user = users.find_one({"_id": result.inserted_id})

    return {
        "id": str(created_user["_id"]),
        "username": created_user["username"],
        "role": created_user["role"]
    }

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), users: Collection = Depends(get_user_collection)):
    user = users.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

    token = create_access_token({"sub": user["username"], "role": user["role"]})
    return {"access_token": token, "token_type": "bearer", "role": user["role"]}
