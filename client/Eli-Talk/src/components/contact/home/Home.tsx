import { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import getLocalItem from "@/utils/sessionStorage/getLocalItem";
import setLocalItem from "@/utils/sessionStorage/setLocalItem";
import Connect from "@/utils/users/Connect";
import Disconnect from "@/utils/users/Disconnect";
import ContactList from "../contactList/ContactList";
import ChatBox from "@/components/chat/chatBox/ChatBox";
import Toast from "@/components/reusable/toast/Toast";

const Home = () => {
	const navigate = useNavigate();
	const [connected, setConnected] = useState<boolean>(false);
	const [toastMessage, setToastMessage] = useState<string>("");
	const [showToast, setShowToast] = useState<boolean>(false);

	const [userToChat, setUserToChat] = useState(null);
	const [sent, setSent] = useState<any>({});

	const [gameSocket, setGameSocket] = useState<WebSocket | null>(null);
	const [updateSocket, setUpdateSocket] = useState<WebSocket | null>(null);

	const id: string | null = getLocalItem("Id");
	const name: string | null = getLocalItem("Name");
	const authed: string | null = getLocalItem("Authenticated");
	const token: string | null = getLocalItem("jwtToken");
	const isConnected: string | null = getLocalItem("Connected");

	const showToastWithDuration = (message: string, duration: number) => {
		setToastMessage(message);
		setShowToast(true);

		setTimeout(() => {
			setShowToast(false);
		}, duration);
	};

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
			//Listen on update users socket
			const socket = new WebSocket(`ws://localhost:5555/updateusers`);

			socket.onmessage = () => {
				console.log("user websocket msg sender");
			};

			socket.onclose = async () => {
				console.log("User websocket sender closed");
			};
			setUpdateSocket(socket);

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

					updateSocket?.send(
						JSON.stringify({ type: "user_disconnect", name: `${name}` })
					);
				} catch (error) {
					console.log("Did not set disconnect");
				}
			}
		}
	};

	//REQUEST TO CHAT WITH USER CLICKED ON
	const userToChatCb = async (dataFromChild: any) => {
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
				user_to_play_name: user.name,
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
			if (receivedMessage.offline) {
				console.log("user is not connected to ws");
				return;
			}
			if (receivedMessage.decline) {
				showToastWithDuration(
					`${receivedMessage.decliner_name} declined your offer`,
					4000
				);
				return;
			}
			if (receivedMessage.startGame) {
				showToastWithDuration("Game starting...", 3000);
				setTimeout(() => {
					console.log(receivedMessage);
				}, 3000);
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
						challengeeName: receivedMessage.user_to_play_name,
						challengerName: receivedMessage.challenger_name,
						challengerId: receivedMessage.challenger_id,
					})
				);
			} else {
				//DECLINED (send socket msg)
				newSocket.send(
					JSON.stringify({
						action: "decline",
						challengeeName: receivedMessage.user_to_play_name,
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
		<>
			{showToast && (
				<Toast
					message={toastMessage}
					duration={3000}
					onClose={() => setShowToast(false)}
				/>
			)}
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
		</>
	);
};

export default Home;
