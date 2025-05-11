from pydantic import BaseModel, Field
from typing import List, Optional
from bson import ObjectId

# Спеціальний тип для ObjectId
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

# Pydantic модель користувача
class User(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id")
    username: str
    hashed_password: str
    role: str = "User"
    bookings: List[PyObjectId] = []

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
