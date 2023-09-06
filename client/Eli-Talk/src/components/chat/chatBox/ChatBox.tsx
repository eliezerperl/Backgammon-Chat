import getLocalItem from "@/utils/sessionStorage/getLocalItem";
import "./ChatBox.css";

const ChatBox = (props: any) => {
	const token: string | null = getLocalItem("jwtToken");
	const myId: string | null = getLocalItem("Id");

	const sendMsg = async () => {
		const inputElement: HTMLInputElement =
			document.querySelector("#messageInput")!;
		if (inputElement.value.length > 0) {
			try {
				// const res = await fetch(`http://localhost:8000/send/${props.user.id}`, {
				// 	method: "POST",
				// 	headers: {
				// 		"Content-Type": "application/json",
				// 		Authorization: `Bearer ${token}`,
				// 	},
				// 	body: JSON.stringify(inputElement.value),
				// });
				// if (!res.ok) {
				// 	return new Error("Could not send message");
				// }
				const socket = new WebSocket(
					`ws://localhost:8000/message/${props.user.id}`
				);
				setTimeout(() => {
					socket.send(
						JSON.stringify({ from: myId, message: inputElement.value })
					);
					// inputElement.value = "";
				}, 500); // timeout for the websocket to connect
			} catch (error) {
				console.log(error);
			}
		}
	};

	//INCOMIONG MSG HANDLE
	const socket = new WebSocket(`ws://localhost:8000/message/${myId}`);

	socket.onopen = () => {
		console.log(
			"Listening for msgs on ",
			`ws://localhost:8000/message/${myId}`
		);
	};

	socket.onmessage = (event) => {
		const receivedMessage = event.data;
		console.log("Received message:", receivedMessage);
	};
	socket.onclose = async () => {};
	socket.onerror = (error) => {
		console.error("WebSocket error:", error);
	};

	return (
		<div className="chatBoxContainer">
			<div className="chatWith">
				Chat with {props.user.name} {props.user.id}
			</div>
			<div className="chatHistory"></div>
			<div className="writeChatContainer">
				<form>
					<input type="text" id="messageInput" />
					<button onClick={sendMsg} className="sendMsgBtn">
						Send message
					</button>
				</form>
			</div>
		</div>
	);
};

export default ChatBox;
