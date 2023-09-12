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

	//SOCKET CONNECTION for sending msgs to server for connectDisconnect
	useEffect(() => {
		// Check if id is available before creating the socket
		if (id) {
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

	// useEffect(() => {

	// }, [])

	//INCOMIONG GAME REQ HANDLE
	useEffect(() => {
		// Create and open the WebSocket connection
		const newSocket = new WebSocket(`ws://localhost:9000/play/${id}`);
		newSocket.onopen = () => {
			console.log("Game WebSocket connection is open.", id);
		};

		newSocket.onmessage = (event) => {
			const receivedMessage = JSON.parse(event.data);
			//making a brief connection the closing it to send rejection msg

			const acceptChallenge = window.confirm(
				`${receivedMessage.challenger_name} would like to challenge you.\nDo you want to accept?`
			);
			if (acceptChallenge) {
				// User clicked "OK" (accept)
				// Handle the acceptance logic here
			} else {
				const rejectionSocket = new WebSocket(
					`ws://localhost:9000/play/reject/${receivedMessage.id}`
				);

				rejectionSocket.onopen = () => {
					console.log("rejection socket open");
					rejectionSocket.send(
						JSON.stringify({
							rejector_id: id,
							rejectee_id: receivedMessage.challenger_id,
							message: `${name} rejected your offer... sorry`,
						})
					);
				};

				rejectionSocket.onmessage = (rejEvent) => {
					console.log(JSON.parse(rejEvent.data));
				};

				rejectionSocket.onclose = () => {
					console.log("rejection socket closed");
				};
				setTimeout(() => {
					rejectionSocket.close();
				}, 500);
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
