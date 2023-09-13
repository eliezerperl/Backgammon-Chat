import { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import getLocalItem from "@/utils/sessionStorage/getLocalItem";
import setLocalItem from "@/utils/sessionStorage/setLocalItem";
import Connect from "@/utils/users/Connect";
import Disconnect from "@/utils/users/Disconnect";
import ContactList from "../contactList/ContactList";
import ChatBox from "@/components/chat/chatBox/ChatBox";

const Home = () => {
	const navigate = useNavigate();
	const [connected, setConnected] = useState<boolean>(false);

	const [userToChat, setUserToChat] = useState(null);
	const [sent, setSent] = useState<any>({});

	const [gameSocket, setGameSocket] = useState<WebSocket | null>(null);
	const [gameRejectionSocket, setGameRejectionSocket] =
		useState<WebSocket | null>(null);
	const [gameAcceptSocket, setGameAcceptSocket] = useState<WebSocket | null>(
		null
	);
	const [updateSocket, setUpdateSocket] = useState<WebSocket | null>(null);

	const id: string | null = getLocalItem("Id");
	const name: string | null = getLocalItem("Name");
	const authed: string | null = getLocalItem("Authenticated");
	const token: string | null = getLocalItem("jwtToken");
	const isConnected: string | null = getLocalItem("Connected");

	useEffect(() => {
		if (isConnected === "true") {
			setConnected(true);
		}

		if (!authed) {
			navigate("/");
		}
	}, []);

	useEffect(() => {
		// Check if id is available before creating the socket
		if (id) {
			//LISTEN TO ACCEPT SOCKET
			// const acceptSocket = new WebSocket(
			// 	`ws://localhost:9000/${id}/d8dbb913-e1ff-444d-99fc-42b86408b755`
			// );
			//LISTEN ON REJECTION SOCKET

			//Listen on user socket
			const socket = new WebSocket(`ws://localhost:5555/updateusers`);

			socket.onmessage = () => {
				console.log("user websocket msg sender");
			};

			socket.onclose = async () => {
				console.log("User websocket sender closed");
			};
			setUpdateSocket(socket);

			// Cleanup the WebSocket connection on unmount
			return () => {
				if (socket) {
					socket.close();
				}
			};
		}
	}, [id]);
	//END SOCKET CONNECTION

	const handleConnectDisconnect = async () => {
		if (token) {
			if (!connected) {
				try {
					const res = await Connect(token);
					setLocalItem("Connected", "true");
					setLocalItem("jwtToken", res);
					setConnected(true);
					// Send the connect message to the server using the existing WebSocket connection
					updateSocket?.send(
						JSON.stringify({ type: "user_connect", name: `${name}` })
					);
				} catch (error) {
					console.log("Did not set refresh token");
				}
			} else {
				try {
					await Disconnect(token);
					setLocalItem("Connected", "false");
					setConnected(false);
					// Send the disconnect message to the server using the existing WebSocket connection
					updateSocket?.send(
						JSON.stringify({ type: "user_disconnect", name: `${name}` })
					);
				} catch (error) {
					console.log("Did not set disconnect");
				}
			}
		}
	};

	const userToChatCb = async (dataFromChild: any) => {
		//REQUEST TO CHAT WITH USER CLICKED ON
		try {
			const res = await fetch(
				`http://localhost:8000/chat/${dataFromChild.id}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (!res.ok) {
				return new Error("Could not start chat");
			}
			setUserToChat(dataFromChild);
		} catch (error) {
			console.log(error);
		}
	};

	const sentCb = (req: any) => {
		setSent(req);
	};

	const playReq = (user: any) => {
		gameSocket?.send(
			JSON.stringify({
				user_to_play_id: user.id,
				// user_to_play_name: user.name,
				challenger_id: id,
				challenger_name: name,
			})
		);
	};

	//INCOMIONG GAME REQ HANDLE
	useEffect(() => {
		// Create and open the WebSocket connection
		const newSocket = new WebSocket(`ws://localhost:9000/play/${id}`);
		newSocket.onopen = () => {
			console.log("Game WebSocket connection is open.", id);
		};

		newSocket.onmessage = (event) => {
			const receivedMessage = JSON.parse(event.data);
			if (receivedMessage.decline) {
				alert(`${receivedMessage.decliner_name} declined your offer`);
				return;
			}
			if (receivedMessage.accept) {
				alert(`${receivedMessage.accepter_name} accepted your offer`);
				return;
			}

			const acceptChallenge = window.confirm(
				`${receivedMessage.challenger_name} would like to challenge you.\nDo you want to accept?`
			);
			if (acceptChallenge) {
				//ACEPPTED (send socket msg)
				newSocket.send(
					JSON.stringify({
						action: "accept",
						challengerName: receivedMessage.challenger_name,
						challengerId: receivedMessage.challenger_id,
					})
				);
			} else {
				//DECLINED (send socket msg)
				newSocket.send(
					JSON.stringify({
						action: "decline",
						challengerName: receivedMessage.challenger_name,
						challengerId: receivedMessage.challenger_id,
					})
				);
			}
		};

		newSocket.onclose = () => {
			console.log("Game WebSocket connection closed.");
		};

		newSocket.onerror = (error) => {
			console.error("WebSocket error:", error);
		};

		setGameSocket(newSocket);

		// Cleanup the WebSocket connection on unmount
		return () => {
			if (newSocket) {
				newSocket.close();
			}
		};
	}, [id]);

	return (
		<div className="mainAreaContainer">
			<div className={`homeContainer`}>
				<button
					className="connectDisconnectBtn"
					onClick={handleConnectDisconnect}>
					{connected ? "Connected" : "Connect"}
				</button>
				<div className="greetContainer">
					<h3>Welcome {name}</h3>
					<ContactList
						user={userToChat}
						sentReq={sent}
						playCb={playReq}
						chatCb={userToChatCb}
					/>
				</div>
			</div>
			<div className="chatAndGameContainer">
				<ChatBox fromWhom={sentCb} user={userToChat} />
			</div>
		</div>
	);
};

export default Home;
