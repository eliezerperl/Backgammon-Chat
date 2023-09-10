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
	const [senderId, setSenderId] = useState<string | null>(null);

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

	const senderIdCb = (id: string) => {
		console.log("the sender id is ", id);
		setSenderId(id);
	};

	return (
		<div className="mainAreaContainer">
			<div className={`homeContainer`}>
				<button className="connectDisconnectBtn" onClick={connectDisconnect}>
					{connected ? "Connected" : "Connect"}
				</button>
				<div className="greetContainer">
					<h3>Welcome {name}</h3>
					<ContactList senderId={senderId} parentCallback={userToChatCb} />
				</div>
			</div>
			<div className="chatAndGameContainer">
				<ChatBox fromWhomId={senderIdCb} user={userToChat} />
			</div>
		</div>
	);
};

export default Home;
