from typing import List
from app.schemas import TransportResponse, ThingResponse

def get_transport_list(cursor) -> List[TransportResponse]:
    results = []
    for doc in cursor:
        results.append({
            "_id": str(doc["_id"]),
            "type": doc.get("type"),
            "model": doc.get("model"),
            "price": doc.get("price"),
            "speed": doc.get("speed"),
            "forecastle": doc.get("forecastle"),
            "trunk_capacity": doc.get("trunk_capacity"),
            "description": doc.get("description"),
            "tag": doc.get("tag", []),
            "image_id": str(doc.get("image_id")) if "image_id" in doc else None 
        })
    return results



def get_things_list(cursor) -> List[ThingResponse]:
    results = []
    for doc in cursor:
        results.append({
            "_id": str(doc["_id"]),
            "type": doc.get("type"),
            "name": doc.get("name"),
            "description": doc.get("description"),
            "tag": doc.get("tag", []),
            "image_id": str(doc.get("image_id")) if doc.get("image_id") else None
        })
    return results

