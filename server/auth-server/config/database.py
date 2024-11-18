from pymongo.mongo_client import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

uri = os.getenv("DB_URI")

client = MongoClient(uri)

db = client.user_db

collection_name = db["user_collection"]

def insert_new_user(user):
    collection_name.insert_one(dict(user))
    
def get_user_by_email(email: str):
    user = collection_name.find_one({"email": email})
    return user

def get_all_users_registered():
    all_users = []
    cursor = collection_name.find()
    
    for user in cursor:
        all_users.append(user)
    return all_users