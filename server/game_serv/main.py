from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict

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
            who_to_play_id = data.get("user_to_play_id")
            who_to_play_name = data.get("user_to_play_name")
            if action is None:
                # Check if a specific recipient is specified in the message
                if who_to_play_id in connected_clients:
                    recipient_websocket = connected_clients[who_to_play_id]
                    await recipient_websocket.send_json(data)
                    print(
                        f"Sent a play req from {player_id} to {who_to_play_id}: {data}"
                    )
                else:
                    await connected_clients[player_id].send_json(
                        {"offline": "user is offline"}
                    )
                    print(f"{who_to_play_name} is offline")
            else:
                if action == "decline":
                    print(action)

                    await connected_clients[data.get("challengerId")].send_json(
                        {
                            "decline": "offer was declined",
                            "decliner_name": data.get("challengeeName"),
                        }
                    )
                else:
                    print("Accepted")
                    # ACCEPTED GAME
                    challenger_id = data.get("challengerId")
                    challenger_name = data.get("challengerName")
                    player_name = data.get("challengeeName")

                    # Inform both players that the game has started
                    await connected_clients[player_id].send_json(
                        {
                            "startGame": "Game has started",
                            "playing_against": {
                                "id": challenger_id,
                                "name": challenger_name,
                            },
                        }
                    )
                    await connected_clients[challenger_id].send_json(
                        {
                            "startGame": "Game has started",
                            "playing_against": {"id": player_id, "name": player_name},
                        }
                    )

    except WebSocketDisconnect:
        # Remove the disconnected client from the dictionary
        if who_to_play_id is not None:
            del connected_clients[who_to_play_id]
        # pass


# FOR GAMEPLAY
playing_clients: Dict[str, WebSocket] = {}
game_state = {
    "current_player": "white",  # Set the initial player
    "dice": [1, 1],  # You can initialize with two dice rolls
}


@app.websocket("/gameplay/{my_id}/{playing_id}")
async def gameplay_websocket_endpoint(
    websocket: WebSocket, my_id: str, playing_id: str
):
    await websocket.accept()
    # # Store the WebSocket connection with its who_to_play_id
    playing_clients[my_id] = websocket

    print("gamrplay clients", playing_clients)

    try:
        while True:
            data = await websocket.receive_json()

            # Move pieces

    except WebSocketDisconnect:
        # OTHER PLAYER QUIT  NOTIFY OTHER PLAYER
        await playing_clients[playing_id].send_json({"quitter": my_id})
        # Remove the disconnected client from the dictionary
        del playing_clients[my_id]


if __name__ == "__main__":
    uvicorn.run("main:app", port=9000, reload=True, access_log=False)
