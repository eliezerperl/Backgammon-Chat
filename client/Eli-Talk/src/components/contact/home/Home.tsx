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

	//SOCKET CONNECTION for sending msgs to server for connectDisconnect
	const socket = new WebSocket(`ws://localhost:5555/updateusers`);

	socket.onmessage = () => {
		console.log("user websocket msg sender");
	};

	socket.onclose = async () => {
		console.log("User websocket sender closed");
	};
	//END SOCKET CONNECTION

	const connectDisconnect = async () => {
		if (token) {
			if (!connected) {
				try {
					const res = await Connect(token);
					socket.send(
						JSON.stringify({ type: "user_connect", name: `${name}` })
					);
					setLocalItem("Connected", "true");
					setLocalItem("jwtToken", res);
					setConnected(true);
				} catch (error) {
					console.log("Did not set refresh token");
				}
			} else {
				try {
					await Disconnect(token);
					socket.send(
						JSON.stringify({ type: "user_disconnect", name: `${name}` })
					);
					setLocalItem("Connected", "false");
					setConnected(false);
				} catch (error) {
					console.log("Did not set dissconnect");
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
		// const socket = new WebSocket(`ws://localhost:9000/play/${user.id}`);

		setTimeout(() => {
			gameSocket?.send(
				JSON.stringify({
					user_to_play_id: user.id,
					challenger_id: id,
					challenger_name: name,
				})
			);
		}, 500);
		//send a ws request to ws://localhost:9000/play/user.id that user will be listening
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
			console.log(
				`${receivedMessage.challenger_name} would like to challenge you.\nAccept?`,
				receivedMessage
			);
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
				<button className="connectDisconnectBtn" onClick={connectDisconnect}>
					{connected ? "Connected" : "Connect"}
				</button>
				<div className="greetContainer">
					<h3>Welcome {name}</h3>
					<ContactList sentReq={sent} playCb={playReq} chatCb={userToChatCb} />
				</div>
			</div>
			<div className="chatAndGameContainer">
				<ChatBox fromWhomId={sentCb} user={userToChat} />
			</div>
		</div>
	);
};

export default Home;
