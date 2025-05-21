from typing import List
from app.schemas import TransportResponse, ThingResponse, AccessoryResponse


def get_transport_list(cursor) -> List[TransportResponse]:
    return [TransportResponse(**doc) for doc in cursor]

def get_accessories_list(cursor) -> List[AccessoryResponse]:
    return [AccessoryResponse(**doc) for doc in cursor]

def get_things_list(cursor) -> List[ThingResponse]:
    return [ThingResponse(**doc) for doc in cursor]