from typing import Dict, List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

# from routes.user_routes import router
import uvicorn


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins="http://localhost:5173",
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


# FOR PLAY REQUESTS
connected_clients: Dict[str, WebSocket] = {}


@app.websocket("/play/{player_id}")
async def websocket_endpoint(websocket: WebSocket, player_id: str):
    await websocket.accept()
    # # Store the WebSocket connection with its who_to_play_id
    connected_clients[player_id] = websocket

    print("play clients", connected_clients)

    try:
        while True:
            data = await websocket.receive_json()

            action = data.get("action")
            if action is None:
                # Check if a specific recipient is specified in the message
                who_to_play_id = data.get("user_to_play_id")
                if who_to_play_id in connected_clients:
                    recipient_websocket = connected_clients[who_to_play_id]
                    await recipient_websocket.send_json(data)
                    print(
                        f"Sent a play req from {player_id} to {who_to_play_id}: {data}"
                    )
                else:
                    # Broadcast the message to all connected clients
                    for client in connected_clients.values():
                        await client.send_json(data)
                        print(
                            f"Sent a broadcast message from {player_id}: {who_to_play_id}"
                        )
            else:
                if action == "decline":
                    print(action)

                    await connected_clients[data.get("challengerId")].send_json(
                        {
                            "decline": "offer was declined",
                            "decliner_name": data.get("challengerName"),
                        }
                    )
                else:
                    print("Accepted")
                    # ACCEPTED GAME
                    await connected_clients[data.get("challengerId")].send_json(
                        {
                            "accept": "offer was accepted",
                            "accepter_name": data.get("challengerName"),
                        }
                    )

    except WebSocketDisconnect:
        # Remove the disconnected client from the dictionary
        del connected_clients[who_to_play_id]


# FOR REJECTIONS
# rej_connected_clients: Dict[str, WebSocket] = {}


# @app.websocket("/play/reject/{user_rejected_id}")
# async def rejection_websocket_endpoint(websocket: WebSocket, user_rejected_id: str):
#     await websocket.accept()
#     rej_connected_clients[user_rejected_id] = websocket
#     print("Rejection clients: ", rej_connected_clients)

#     try:
#         while True:
#             data = await websocket.receive_json()

#             # Check if a specific recipient is specified in the message
#             rejectee_id = data.get("rejectee_id")
#             rejector_id = data.get("rejector_id")

#             # for client in rej_connected_clients.values():
#             #     await client.send_json(data)
#             print("rejectee id ", rejectee_id)

#             if rejectee_id == user_rejected_id:
#                 # Send the rejection message to the user who initiated the request
#                 recipient_websocket = rej_connected_clients[user_rejected_id]
#                 print(recipient_websocket)
#                 await recipient_websocket.send_json(data)
#                 print(
#                     f"Sent a rejection from {rejector_id} to {user_rejected_id}: {data}"
#                 )
#             else:
#                 # Handle the case when the rejectee is not connected
#                 print(f"{rejectee_id} is not connected.")

#     except WebSocketDisconnect:
#         # Remove the disconnected client from the dictionary
#         del rej_connected_clients[rejectee_id]


# # ACCEPTED CHALENGES


# @app.websocket("/play/{challenger_id}/{opponent_id}")
# async def gameplay_websocket_endpoint(
#     websocket: WebSocket, challenger_id: str, opponent_id: str
# ):
#     await websocket.accept()

#     while True:
#         data = await websocket.receive_json()

#         challenger_websocket = connected_clients[challenger_id]
#         opponent_websocket = connected_clients[opponent_id]

#         print(challenger_websocket)
#         print(opponent_websocket)

#         opponent_websocket.send_json(data)


if __name__ == "__main__":
    uvicorn.run("main:app", port=9000, reload=True, access_log=False)
