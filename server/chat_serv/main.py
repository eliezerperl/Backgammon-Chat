from typing import Dict, List
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

connected_clients: Dict[str, WebSocket] = {}

@app.websocket('/message/{recv_id}')
async def websocket_endpoint(websocket: WebSocket, recv_id: str):
    await websocket.accept()

    # Store the WebSocket connection with its recv_id
    connected_clients[recv_id] = websocket

    try:
        while True:
            data = await websocket.receive_json()

            # Check if a specific recipient is specified in the message
            recipient_id = data.get("recipient_id")
            if recipient_id and recipient_id in connected_clients:
                recipient_websocket = connected_clients[recipient_id]
                await recipient_websocket.send_json(data)
                print(f"Sent a private message from {recv_id} to {recipient_id}: {data}")
            else:
                # Broadcast the message to all connected clients
                for client in connected_clients.values():
                    await client.send_json(data)
                    print(f"Sent a broadcast message from {recv_id}: {data}")

    except WebSocketDisconnect:
        # Remove the disconnected client from the dictionary
        del connected_clients[recv_id]

if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, reload=True, access_log=False)