import { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import getLocalItem from "@/utils/sessionStorage/getLocalItem";
import setLocalItem from "@/utils/sessionStorage/setLocalItem";
import GetUpdateUsers from "@/utils/users/GetUpdateUsers";
import Connect from "@/utils/users/Connect";
import Disconnect from "@/utils/users/Disconnect";

const Home = () => {
	const navigate = useNavigate();
	const [connected, setConnected] = useState(false);
	const [allOfflineUsers, setAllOfflineUsers] = useState<any[]>([]);
	const [allOnlineUsers, setAllOnlineUsers] = useState<any[]>([]);
	const [dialog, setDialog] = useState(true);

	const name: string | null = getLocalItem("Name");
	const authed: string | null = getLocalItem("Authenticated");
	const token: string | null = getLocalItem("jwtToken");
	const isConnected: string | null = getLocalItem("Connected");

	const getUsers = async () => {
		if (token) {
			const users: any[] = await GetUpdateUsers(token);
			const otherUsers: any[] = users.filter((user: any) => user.name !== name);
			const offlineUsers: any[] = otherUsers.filter(
				(user: any) => !user.is_online
			);
			setAllOfflineUsers(offlineUsers);
			const onlineUsers: any[] = otherUsers.filter(
				(user: any) => user.is_online
			);
			setAllOnlineUsers(onlineUsers);
		}
	};

	useEffect(() => {
		getUsers();
		if (isConnected === "true") {
			setConnected(true);
		}

		if (!authed) {
			navigate("/");
		}
	}, []);

	//SOCKET CONNECTION
	const socket = new WebSocket(`ws://localhost:5555/updateusers`);

	socket.onmessage = () => {
		getUsers();
	};

	socket.onclose = async () => {};
	//END SOCKET CONNECTION

	const connectDisconnect = async () => {
		if (token) {
			if (!connected) {
				setLocalItem("Connected", "true");
				socket.send(JSON.stringify({ type: "user_connect", name: `${name}` }));
				const res = await Connect(token);
				setLocalItem("jwtToken", res);
				setConnected(true);
			} else {
				setLocalItem("Connected", "false");
				socket.send(
					JSON.stringify({ type: "user_disconnect", name: `${name}` })
				);
				const res = await Disconnect(token);
				setConnected(false);
			}
		}
	};

	const chat = () => {
		setDialog(true);
	};

	return (
		<div className="mainAreaContainer">
			<div className="homeContainer">
				<button onClick={connectDisconnect}>
					{connected ? "Connected" : "Connect"}
				</button>
				<div className="greetContainer">
					<h3>Welcome {name}</h3>
					<div className="friendsContainer">
						<div>
							Online Friends:
							{/* <div className="userHolders"> */}
							{allOnlineUsers.map((user) => (
								<div className="onlineUsers" key={user["id"]}>
									<b>{user["name"]}</b>
									<div className="userActions">
										<button onClick={chat} className="chatBtn">
											Chat
										</button>
										<button className="playBtn">Play</button>
									</div>
								</div>
							))}
							{/* </div> */}
						</div>
						<div>
							Offline Friends:
							{allOfflineUsers.map((user) => (
								<li key={user["email"]}>{user["name"]}</li>
							))}
						</div>
					</div>
				</div>
			</div>
			{dialog && <div className="chatAndGameContainer">hello</div>}
		</div>
	);
};

export default Home;
