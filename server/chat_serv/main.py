from fastapi import FastAPI, WebSocket
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

@app.websocket('/message/{recv_id}')
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    data = await websocket.receive_json()
    await websocket.send_json(data) #client side socket.onmessage is not responding to this @ChatBox.tsx
    print('sent: ', data)

if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, reload=True, access_log=False)