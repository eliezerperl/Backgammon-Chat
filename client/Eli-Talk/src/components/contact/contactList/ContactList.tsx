import User from "@/models/user";
import "./ContactList.css";
import getLocalItem from "@/utils/sessionStorage/getLocalItem";
import GetUpdateUsers from "@/utils/users/GetUpdateUsers";
import { useEffect, useState } from "react";

const ContactList = (props: any) => {
	const [allOfflineUsers, setAllOfflineUsers] = useState<any[]>([]);
	const [allOnlineUsers, setAllOnlineUsers] = useState<any[]>([]);
	const [userChattingWith, setUserChattingWith] = useState(null);

	const token: string | null = getLocalItem("jwtToken");
	const id: string | null = getLocalItem("Id");

	const getUsers = async () => {
		if (token) {
			const users: any[] = await GetUpdateUsers(token);
			const otherUsers: any[] = users.filter((user: any) => user.id !== id);
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

	//SOCKET CONNECTION
	const socket = new WebSocket(`ws://localhost:5555/updateusers`);

	socket.onmessage = () => {
		console.log("User Websocket Connected");
		getUsers();
	};
	socket.onclose = () => {
		console.log("User websocket closed");
	};

	useEffect(() => {
		getUsers();
	}, []);

	const handleChatClick = (user: any) => {
		props.parentCallback({
			id: user.id,
			name: user.name,
		});
		//setting user currently on chat screen with in order not to get
		//chatwaiting notifications while on chat with said person
		setUserChattingWith(user);
	};

	const handlePlayClick = (user: any) => {};

	return (
		<div className="friendsContainer">
			<div>
				Online Friends:
				{allOnlineUsers.map((user) => (
					<div className="onlineUsers" key={user["id"]}>
						<b
							className={
								props.senderId === user["id"] && userChattingWith !== user
									? "chat-waiting"
									: ""
							}>
							{user["name"]}
						</b>
						<div className="userActions">
							<button onClick={() => handleChatClick(user)} className="chatBtn">
								Chat
							</button>
							<button className="playBtn" onClick={() => handlePlayClick(user)}>
								Play
							</button>
						</div>
					</div>
				))}
			</div>
			<div className="offlineUsers">
				Offline Friends:
				{allOfflineUsers.map((user) => (
					<div key={user["id"]}>{user["name"]}</div>
				))}
			</div>
		</div>
	);
};

export default ContactList;
