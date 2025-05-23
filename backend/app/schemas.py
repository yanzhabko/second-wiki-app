from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from app.utils.pyobject import PyObjectId 

# ----- User Schemas -----
class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: str = "User"

class UserCreate(UserBase):
    password: str
    role: str = "User"

class UserUpdate(BaseModel):
    name: Optional[str]
    email: Optional[EmailStr]
    reset_password_token: Optional[str] = None
    reset_password_token_expiry: Optional[datetime] = None
    email_verified: Optional[bool] = None
    email_verification_token: Optional[str] = None


class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

class UserResponse(UserBase):
    id: Optional[PyObjectId] = Field(alias="_id")
    hashed_password: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    reset_password_token: Optional[str] = None
    reset_password_token_expiry: Optional[datetime] = None
    email_verified: bool = False
    email_verification_token: Optional[str] = None
    
    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# ----- Transport Schemas -----
class TransportBase(BaseModel):
    type: str
    model: str
    price: Optional[int]
    speed: str
    forecastle: str
    trunk_capacity: str
    description: str
    tag: List[str]

class TransportCreate(TransportBase):
    pass

class TransportResponse(TransportBase):
    id: Optional[PyObjectId] = Field(alias="_id")

    class Config:
        validate_by_name = True
        json_encoders = {ObjectId: str}

# ----- Thing Schemas -----
class ThingBase(BaseModel):
    type: str
    name: Optional[str]
    description: str
    tag: List[str]
    image_id: Optional[str]

class ThingCreate(ThingBase):
    pass

class ThingResponse(ThingBase):
    id: Optional[PyObjectId] = Field(alias="_id")

    class Config:
        validate_by_name = True
        json_encoders = {ObjectId: str}

