from fastapi import Depends, HTTPException, status
import jwt
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer


oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login')

secret_key="my_secret"
def generate_new_token(user_data: dict):
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
        
        email : str = payload.get("email")
        
        if email is None:
            raise credentials_exception
    except:
        raise credentials_exception

    return payload
    
def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"})
    
    return validate_token(token, credentials_exception)