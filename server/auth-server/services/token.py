import jwt
from datetime import datetime, timedelta
from fastapi import Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login')

secret_key="my_secret"
def generate_token(user_data: dict):
    payload = user_data.copy()
    
    payload.update({"exp": datetime.utcnow() + timedelta(hours=1)})
    return jwt.encode(
        payload=payload,
        key=secret_key,
    )
    

def validate_token(token: str, credentials_exception):
    try:    
        payload = jwt.decode(
            token,
            key=secret_key,
            algorithms=['HS256']
        )
        
        id : str = payload.get("id")
        
        if id is None:
            raise credentials_exception
    except jwt.DecodeError:
        raise credentials_exception
    
    print("payload :" , payload)
    return payload
    
    
def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"})
    
    return validate_token(token, credentials_exception)