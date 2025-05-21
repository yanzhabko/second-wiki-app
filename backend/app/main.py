from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.auth import router as auth_router
from app.routers.transports import router as transports_router
from app.routers.things import router as things_router
from app.routers.accessories import router as accessories_router
from app.routers.profile import router as profile_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(transports_router)
app.include_router(things_router)
app.include_router(accessories_router)
app.include_router(profile_router)


@app.get("/")
def server():
    return 'server run!'