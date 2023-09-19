install virtual enviorments to all servers with venvs.bat file  
run it with the command "start batch/venvs.bat" (from base directory)

# Auth Service

--add database.py in config folder
add this code (to connect to mongo):  
from pymongo.mongo_client import MongoClient

uri = "connectionStringToMongo"

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
