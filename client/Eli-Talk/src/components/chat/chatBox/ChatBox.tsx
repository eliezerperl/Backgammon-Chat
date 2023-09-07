import getLocalItem from "@/utils/sessionStorage/getLocalItem";
import "./ChatBox.css";
import { BaseSyntheticEvent, useEffect, useState } from "react";

interface Message {
	text: string;
	type: "sender" | "receiver";
}

const ChatBox = (props: any) => {
	// const token: string | null = getLocalItem("jwtToken");
	const myId: string | null = getLocalItem("Id");
	const [inputValue, setInputValue] = useState<string>("");
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);

	//INCOMIONG MSG HANDLE
	useEffect(() => {
		// Create and open the WebSocket connection
		const newSocket = new WebSocket(`ws://localhost:8000/message/${myId}`);
		newSocket.onopen = () => {
			console.log("WebSocket connection is open.");
		};

		newSocket.onmessage = (event) => {
			const receivedMessage = JSON.parse(event.data);
			console.log("Received message:", receivedMessage);
			const messageGot: Message = {
				text: receivedMessage.message,
				type: "receiver",
			};
			setMessages((prevMsgs) => [...prevMsgs, messageGot]);
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

	useEffect(() => {
		setMessages([]);
	}, [props.user]);

	const sendMsg = async (e: BaseSyntheticEvent) => {
		e.preventDefault();
		if (inputValue.length > 0 && socket) {
			socket.send(
				JSON.stringify({
					from: myId,
					recipient_id: props.user.id,
					message: inputValue,
				})
			);
			const mySentMessage: Message = {
				text: inputValue,
				type: "sender",
			};
			setMessages((prevMsgs) => [...prevMsgs, mySentMessage]);
			setInputValue("");
		}
	};

	if (props.user) {
		return (
			<div className="chatBoxContainer">
				<div className="chatWith">
					Chat with {props.user.name} {props.user.id}
				</div>
				<div className="chatHistory">
					{messages &&
						messages.map((message, index) => (
							<div
								key={index}
								className={`message ${
									message.type === "sender" ? "sent-msg" : "recv-msg"
								}`}>
								{message.text}
							</div>
						))}
				</div>
				<div className="writeChatContainer">
					<form>
						<input
							type="text"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
						/>
						<button onClick={sendMsg} className="sendMsgBtn">
							Send message
						</button>
					</form>
				</div>
			</div>
		);
	} else {
		return <h2>CHATT SCREEN</h2>;
	}
};

export default ChatBox;
