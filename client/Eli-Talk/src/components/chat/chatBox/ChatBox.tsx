import getLocalItem from "@/utils/sessionStorage/getLocalItem";
import "./ChatBox.css";
import { useEffect, useState } from "react";

const ChatBox = (props: any) => {
	// const token: string | null = getLocalItem("jwtToken");
	const myId: string | null = getLocalItem("Id");
	const [inputValue, setInputValue] = useState<string>("");
	const [socket, setSocket] = useState<WebSocket | null>(null);

	//INCOMIONG MSG HANDLE
	useEffect(() => {
		// Create and open the WebSocket connection
		const newSocket = new WebSocket(`ws://localhost:8000/message/${myId}`);
		newSocket.onopen = () => {
			console.log("WebSocket connection is open.");
		};

		newSocket.onmessage = (event) => {
			const receivedMessage = event.data;
			console.log("Received message:", receivedMessage);
		};

		newSocket.onclose = () => {
			console.log("WebSocket connection closed.");
		};

		newSocket.onerror = (error) => {
			console.error("WebSocket error:", error);
		};

		setSocket(newSocket);

		// Cleanup the WebSocket connection on unmount
		return () => {
			if (newSocket) {
				newSocket.close();
			}
		};
	}, [myId]);
	const sendMsg = async () => {
		if (inputValue.length > 0 && socket) {
			socket.send(
				JSON.stringify({
					from: myId,
					recipient_id: props.user.id,
					message: inputValue,
				})
			);
			setInputValue("");
		}
	};

	if (props.user) {
		return (
			<div className="chatBoxContainer">
				<div className="chatWith">
					Chat with {props.user.name} {props.user.id}
				</div>
				<div className="chatHistory"></div>
				<div className="writeChatContainer">
					<input
						type="text"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
					/>
					<button onClick={sendMsg} className="sendMsgBtn">
						Send message
					</button>
				</div>
			</div>
		);
	} else {
		return <h2>CHATT SCREEN</h2>;
	}
};

export default ChatBox;
