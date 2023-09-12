import User from "@/models/user";
import "./ContactList.css";
import getLocalItem from "@/utils/sessionStorage/getLocalItem";
import GetUpdateUsers from "@/utils/users/GetUpdateUsers";
import { useEffect, useState } from "react";

const ContactList = (props: any) => {
	const [allOfflineUsers, setAllOfflineUsers] = useState<any[]>([]);
	const [allOnlineUsers, setAllOnlineUsers] = useState<any[]>([]);
	const [modifiedUsers, setModifiedUsers] = useState<User[]>([]);

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
	useEffect(() => {
		getUsers();
	}, []);

	//SOCKET CONNECTION
	useEffect(() => {
		const socket = new WebSocket(`ws://localhost:5555/updateusers`);

		socket.onmessage = () => {
			console.log("User Websocket Connected");
			getUsers();
		};
		socket.onclose = () => {
			console.log("User websocket closed");
		};
	}, [id]);

	const handleChatClick = (user: User) => {
		props.chatCb({
			id: user.id,
			name: user.name,
		});
	};

	useEffect(() => {
		const modifiedUsers = allOnlineUsers.map((user) => ({
			...user,
			alert: true ? false : false,
		}));
		setModifiedUsers(modifiedUsers);
	}, [props.user]);

	useEffect(() => {
		const modifiedUsers = allOnlineUsers.map((user) => ({
			...user,
			alert: props.sentReq.from === user.id && user.id !== props.user.id,
		}));
		setModifiedUsers(modifiedUsers);
	}, [props.sentReq.from, allOnlineUsers]);

	const handlePlayClick = (user: User) => {
		props.playCb(user);
	};

	return (
		<div className="friendsContainer">
			<div className="onlineUsersContainer">
				Online Friends:
				{modifiedUsers.map((user: User) => (
					<div className="onlineUsers" key={user.id}>
						<b className={user.alert ? "chat-waiting" : ""}>{user.name}</b>|
						<div className="userActions">
							<button onClick={() => handleChatClick(user)} className="chatBtn">
								Chat
							</button>
							<button onClick={() => handlePlayClick(user)} className="playBtn">
								Play
							</button>
						</div>
					</div>
				))}
			</div>
			<div className="offlineUsersContainer">
				Offline Friends:
				{allOfflineUsers.map((user) => (
					<div className="offlineUsers" key={user.id}>
						{user.name}
					</div>
				))}
			</div>
		</div>
	);
};

export default ContactList;
