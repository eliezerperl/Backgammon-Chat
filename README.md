# Auth Service

--install dependencies that are in the requirments.txt with command:  
pip install -r requirements.txt

--add db.py in config folder
add this code (to connect to mongo):  
from pymongo.mongo_client import MongoClient

uri = "connectionStringToMongo"

client = MongoClient(uri)

db = client.user_db

collection_name = db["user_collection"]
