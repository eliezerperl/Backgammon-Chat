from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import JSONResponse
from utils.validate import get_current_user, generate_new_token
from utils.database import get_all_users_registered, change_user_to_online, change_user_to_offline


router = APIRouter()

#HOMEPAGE DETAILS
#GET ALL EXISTING USERS
@router.get('/home/allusers', tags=['Get Users'])
async def get_all():
    #GET ALL USERS TO SHOW
    all_users = get_all_users_registered()
    return all_users



#CONNECT ACTION
@router.post('/getonline', tags=['Actions'])
async def get_online(get_current_user: dict = Depends(get_current_user)):
    change_user_to_online(get_current_user["id"])
    return generate_new_token({
        "id": get_current_user["id"],
        'name': get_current_user['name'],
        'email': get_current_user['email']
    })
    
#DISCONNECT ACTION 
@router.post('/getoffline', tags=['Actions'])
async def get_offline(get_current_user: dict = Depends(get_current_user)):
    change_user_to_offline(get_current_user["id"])
