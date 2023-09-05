from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.user_routes import router
import uvicorn

app = FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origins='http://localhost:5173',
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

if __name__ == "__main__":
    uvicorn.run("main:app", port=5000, reload=True, access_log=False)