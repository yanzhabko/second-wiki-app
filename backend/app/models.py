from pydantic import BaseModel, EmailStr
from typing import Optional, List

class User(BaseModel):
    email: EmailStr
    username: str
    hashed_password: str
    role: "User"

class Transport:
    type: str
    model: str
    price: Optional[int]
    speed: str
    forecastle: str
    trunk_capacity: str
    description: str
    tag: List[str]

class Clothes: 
    type: str
    name: str
    description: str
    tag: List[str]

class Accesories:
    type: str
    name: str
    description: str
    tag: List[str]