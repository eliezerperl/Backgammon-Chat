from typing import Dict, List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
# from routes.user_routes import router
import uvicorn


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins='http://localhost:5173',
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(router)

# connected_clients: List[WebSocket] = []

# @app.websocket('/message/{recv_id}')
# async def websocket_endpoint(websocket: WebSocket):
#     await websocket.accept()
#     connected_clients.append(websocket)

#     try:
#         while True:
#             data = await websocket.receive_json()

#             # Broadcast the received data to all connected clients
#             for client in connected_clients:
#                 await client.send_json(data)
#                 print('sent: ', data)
#     except WebSocketDisconnect:
#         # Remove the disconnected client from the list
#         connected_clients.remove(websocket)

connected_clients: Dict[str, WebSocket] = {}

@app.websocket('/play/{player_id}')
async def websocket_endpoint(websocket: WebSocket, player_id: str):
    await websocket.accept()
    # # Store the WebSocket connection with its who_to_play_id
    connected_clients[player_id] = websocket

    print(connected_clients)
    
    

    try:
        while True:
            data = await websocket.receive_json()

            # Check if a specific recipient is specified in the message
            who_to_play_id = data.get("user_to_play_id")
            if who_to_play_id in connected_clients:
                recipient_websocket = connected_clients[who_to_play_id]
                await recipient_websocket.send_json(data)
                print(f"Sent a play req from {player_id} to {who_to_play_id}: {data}")
            else:
                # Broadcast the message to all connected clients
                for client in connected_clients.values():
                    await client.send_json(data)
                    print(f"Sent a broadcast message from {player_id}: {who_to_play_id}")

    except WebSocketDisconnect:
        # Remove the disconnected client from the dictionary
        del connected_clients[who_to_play_id]

if __name__ == "__main__":
    uvicorn.run("main:app", port=9000, reload=True, access_log=False)