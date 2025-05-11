from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def server():
    return 'server run!'

# Підключаємо авторизаційний роутер
app.include_router(auth.router, prefix="/auth", tags=["Auth"])

