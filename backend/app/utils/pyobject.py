from bson import ObjectId
from pydantic_core import core_schema
from typing import Any

class PyObjectId(ObjectId):

    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type, _handler):
        return core_schema.with_info_plain_validator_function(cls.validate)

    @classmethod
    def validate(cls, value: Any, info=None):
        if isinstance(value, ObjectId):
            return value
        if isinstance(value, str):
            try:
                return ObjectId(value)
            except Exception:
                raise ValueError("Недійсний ObjectId")
        raise TypeError("ObjectId повинен бути рядком або ObjectId")

    @classmethod
    def __get_pydantic_json_schema__(cls, _schema, _handler):
        return {"type": "string"}