import "./ContactList.css";
import getLocalItem from "@/utils/sessionStorage/getLocalItem";
import GetUpdateUsers from "@/utils/users/GetUpdateUsers";
import { useEffect, useState } from "react";

const ContactList = (props: any) => {
	const [allOfflineUsers, setAllOfflineUsers] = useState<any[]>([]);
	const [allOnlineUsers, setAllOnlineUsers] = useState<any[]>([]);

	const token: string | null = getLocalItem("jwtToken");
	const email: string | null = getLocalItem("Email");

	const getUsers = async () => {
		if (token) {
			const users: any[] = await GetUpdateUsers(token);
			const otherUsers: any[] = users.filter(
				(user: any) => user.email !== email
			);
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
		getUsers();
	};

	useEffect(() => {
		getUsers();
	}, []);

	const handleChatClick = (id: string, name: string) => {
		props.parentCallback({
			id: id,
			name: name,
		});
	};

	return (
		<div className="friendsContainer">
			<div>
				Online Friends:
				{allOnlineUsers.map((user) => (
					<div className="onlineUsers" key={user["id"]}>
						<b>{user["name"]}</b>
						<div className="userActions">
							<button
								onClick={() => handleChatClick(user["id"], user["name"])}
								className="chatBtn">
								Chat
							</button>
							<button className="playBtn">Play</button>
						</div>
					</div>
				))}
			</div>
			<div>
				Offline Friends:
				{allOfflineUsers.map((user) => (
					<li key={user["email"]}>{user["name"]}</li>
				))}
			</div>
		</div>
	);
};

export default ContactList;
