from pymongo.mongo_client import MongoClient

uri = "mongodb+srv://eliezerrules:irock2009@elidev.cznyzr3.mongodb.net/?retryWrites=true&w=majority"

client = MongoClient(uri)

db = client.profiles_db

user_collection = db["profile_collection"]

def add_profile_to_db(user_data: dict):
    data ={
        "id": user_data["id"],
        "name": user_data["name"],
        "email": user_data["email"],
        "is_online": False
    }
    user_collection.insert_one(data)

def get_all_users_registered():
    all_users = []
    cursor = user_collection.find({}, {"_id": 0, "id": 1, "name": 1, "email": 1, "is_online": 1})
    
    for user in cursor:
        all_users.append(user)
    return all_users

def change_user_to_online(user_id: str):
    user_to_switch =  user_collection.update_one(
        {"id": user_id},  # Filter to find the user
        {"$set": {"is_online": True}}
    )

def change_user_to_offline(user_id: str):
    user_to_switch =  user_collection.update_one(
        {"id": user_id},  # Filter to find the user
        {"$set": {"is_online": False}}
    )