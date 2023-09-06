import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from routes.user_routes import router
import uvicorn

from utils.database import change_user_to_offline, change_user_to_online, add_profile_to_db

app = FastAPI()


# WebSocket routes
@app.websocket("/updatenewuser")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    data = await websocket.receive_json()
    try:
        add_profile_to_db(data)
        print("Data inserted successfully.")
    except Exception as e:
        print(f"Error inserting data: {str(e)}")




# Store connected WebSocket clients
connected_clients = set()
@app.websocket("/updateusers") 
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.add(websocket)  # Store the WebSocket object

    try:
        while True:
            data = await websocket.receive_text()

            try:
                data_dict = json.loads(data)
                message_type = data_dict.get("type")
                user_name = data_dict.get("name")

                if message_type == "user_disconnect":
                    # Handle user disconnection using the `name` parameter
                    await broadcast_user_status_change(user_name, False)
                elif message_type == "user_connect":
                    # Handle user connection using the `name` parameter
                    await broadcast_user_status_change(user_name, True)

                # You can add more message types and handlers here if needed

            except json.JSONDecodeError:
                pass

    except WebSocketDisconnect:
        # Remove the WebSocket object from the set when a client disconnects
        connected_clients.remove(websocket)

async def broadcast_user_status_change(user_name: str, is_connected: bool):
    status_message = {
        "type": "user_status_change",
        "name": user_name,
        "is_connected": is_connected
    }
    for client in connected_clients:
        try:
            await client.send_text(json.dumps(status_message))
        except Exception as e:
            print(f"Failed to send message to client: {str(e)}")

app.add_middleware(
    CORSMiddleware,
    allow_origins='http://localhost:5173',
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)



if __name__ == "__main__":
    uvicorn.run("main:app", port=5555, reload=True, access_log=False)



# @app.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket):
#    await websocket.accept()
#    while True:
#       data = await websocket.receive_text()
#       await websocket.send_text(f"Message text was: {data}")