from typing import List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
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

connected_clients: List[WebSocket] = []

@app.websocket('/message/{recv_id}')
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)

    try:
        while True:
            data = await websocket.receive_json()

            # Broadcast the received data to all connected clients
            for client in connected_clients:
                await client.send_json(data)
                print('sent: ', data)
    except WebSocketDisconnect:
        # Remove the disconnected client from the list
        connected_clients.remove(websocket)

if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, reload=True, access_log=False)