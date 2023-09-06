
import json
from fastapi import APIRouter, Depends, HTTPException, Request, status
from utils.validate import get_current_user



router = APIRouter()



#CHAT ACTION
@router.get('/chat/{id}', tags=['Actions'])
async def chat(id: str, get_current_user: dict = Depends(get_current_user)):
    print(id)
    print(get_current_user)


#SEND ACTION
@router.post('/send/{id}', tags=['Actions'])
async def send_msg(id: str, request: Request, get_current_user: dict = Depends(get_current_user)):
    print('id from send ', id)
    body = await request.body()
    
    try:
        data = json.loads(body.decode('utf-8'))
        print('Data from request body:', data)
    except json.JSONDecodeError as e:
        return {"error": "Invalid JSON in request body"}
