from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

class UserCreate(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id")
    username: str
    role: str

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}
