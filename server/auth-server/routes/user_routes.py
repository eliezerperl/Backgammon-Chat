import json
import uuid
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import JSONResponse
import websockets

from models.user_model import User
from config.database import insert_new_user, get_user_by_email, get_all_users_registered
from services.encrypt import encrpt_pass, check_pass
from services.token import generate_token, get_current_user


router = APIRouter()

#TEST
@router.get('/', tags=["Test"])
async def greet():
    return {'Hello': 'World!'}

#REGISTER
@router.post('/register', tags=["Auth"])
async def Register(user: User):
    encoded_pass = user.password.encode('utf-8')
    encryped_pass = encrpt_pass(encoded_pass)
    user.password = encryped_pass.decode('utf-8')
    user.id = str(uuid.uuid4())
    insert_new_user(user)
    # Serialize the user object to JSON
    user_json = json.dumps(user.model_dump())  # Assuming User is a Pydantic model

    async with websockets.connect("ws://contact-backgammon-chat.vercel.app/updatenewuser") as websocket:
        await websocket.send(user_json)
    return JSONResponse(status_code=status.HTTP_201_CREATED, content="User was created.")


#LOGIN
@router.post('/login', tags=["Auth"])
async def Login(user_data: dict):
    email = user_data.get("email")
    password = user_data.get("password")
    if not email or not password:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Email and password are required")
    
    unauthed_user = get_user_by_email(email)
    if unauthed_user is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User not found")
    print(unauthed_user)
    is_pass_valid = check_pass(password.encode('utf-8'), unauthed_user.get("password").encode('utf-8'))
    if not is_pass_valid:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Password incorrect")

    token = generate_token({
        "id": unauthed_user['id'],
        'name': unauthed_user['name'],
        'email': unauthed_user['email'],
    })
    
    authed_user = {
        "id": unauthed_user['id'],
        "name": unauthed_user['name'],
        "email": unauthed_user['email'],
        "token": token
    }
    return JSONResponse(status_code=status.HTTP_202_ACCEPTED, content=authed_user)


@router.get('/home', tags=["Auth"])
async def RouteAuthedUser(req : Request, get_current_user: dict = Depends(get_current_user)):
    return get_current_user
