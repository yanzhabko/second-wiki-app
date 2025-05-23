from typing import List
from app.schemas import TransportResponse, ThingResponse

def get_transport_list(cursor) -> List[TransportResponse]:
    return [TransportResponse(**doc) for doc in cursor]

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

