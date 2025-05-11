from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.collection import Collection
from app.database import get_user_collection
from app.schemas import UserCreate, UserResponse
from app.utils.auth_utils import get_password_hash, create_access_token
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, users: Collection = Depends(get_user_collection)):
    existing_user = users.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    hashed_password = get_password_hash(user.password)
    new_user = {
        "username": user.username,
        "hashed_password": hashed_password,
        "role": "User",
        "bookings": []
    }
    insert_result = users.insert_one(new_user)
    new_user["_id"] = insert_result.inserted_id
    return UserResponse(**new_user)

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), users: Collection = Depends(get_user_collection)):
    user = authenticate_user(users, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    token = create_access_token({"sub": user["username"]}, user)
    return {"access_token": token, "token_type": "bearer", "role": user["role"]}
