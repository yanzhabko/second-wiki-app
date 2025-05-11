from pymongo import MongoClient

DATABASE_URL = "mongodb://localhost:27017/"
client = MongoClient(DATABASE_URL, serverSelectionTimeoutMS=5000)
db = client["wiki"] 

# 🔌 Колекція користувачів
def get_user_collection():
    return db["users"]
