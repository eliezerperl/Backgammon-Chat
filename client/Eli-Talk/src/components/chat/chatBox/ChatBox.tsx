import getLocalItem from "@/utils/sessionStorage/getLocalItem";
import "./ChatBox.css";
import { BaseSyntheticEvent, useEffect, useRef, useState } from "react";

interface Message {
	text: string;
	type: "sender" | "receiver";
	otherParty: string | null;
}

const ChatBox = (props: any) => {
	// const token: string | null = getLocalItem("jwtToken");
	const myId: string | null = getLocalItem("Id");
	const [inputValue, setInputValue] = useState<string>("");
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);

	const chatHistoryRef = useRef<HTMLDivElement | null>(null);

	//KEEP MSGS SCROLLED TO LATEST
	useEffect(() => {
		if (chatHistoryRef.current) {
			chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
		}
	}, [messages]);

	//INCOMIONG MSG HANDLE
	useEffect(() => {
		const newSocket = new WebSocket(`ws://localhost:8000/message/${myId}`);
		newSocket.onopen = () => {
			console.log("msg WebSocket connection is open.");
		};

		newSocket.onmessage = (event) => {
			const receivedMessage = JSON.parse(event.data);
			console.log("Received message:", receivedMessage);
			const messageGot: Message = {
				text: receivedMessage.message,
				type: "receiver",
				otherParty: receivedMessage.from,
			};
			setMessages((prevMsgs) => [...prevMsgs, messageGot]);
			props.fromWhom(receivedMessage);
		};

		newSocket.onclose = () => {
			console.log("msg WebSocket connection closed.");
		};

		newSocket.onerror = (error) => {
			console.error("WebSocket error:", error);
		};

		setSocket(newSocket);

		return () => {
			if (newSocket) {
				newSocket.close();
			}
		};
	}, [myId]);

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
				otherParty: props.user.id,
			};
			setMessages((prevMsgs) => [...prevMsgs, mySentMessage]);
			setInputValue("");
		}
	};

	if (props.user) {
		return (
			<div className="chatBoxContainer">
				<div className="chatWith">
					<u>Chat with {props.user.name}</u>
				</div>
				<div className="chatHistory" ref={chatHistoryRef}>
					{messages &&
						messages.map(
							(message, index) =>
								props.user.id === message.otherParty && (
									<div
										key={index}
										className={`message ${
											message.type === "sender" ? "sent-msg" : "recv-msg"
										}`}>
										{message.text}
									</div>
								)
						)}
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
		return <h2>CHAT SCREEN</h2>;
	}
};

export default ChatBox;
