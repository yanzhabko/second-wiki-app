
from pymongo.mongo_client import MongoClient

client = MongoClient("mongodb+srv://zhabkoyan:NRXv0HSaWdmgD21a@cluster0.svpwyag.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&tls=true") 


db = client.second_wiki_db
