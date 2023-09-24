import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import Actions from "../actions/Actions";
import getLocalItem from "@/utils/sessionStorage/getLocalItem";
import Disconnect from "@/utils/users/Disconnect";

const Navbar = () => {
	const navigate = useNavigate();
	const name: string | null = getLocalItem("Name");

	const logout = async () => {
		const connected: string | null = getLocalItem("Connected");
		if (connected === "true") {
			const token: string | null = getLocalItem("jwtToken");
			if (token) {
				Disconnect(token);
			}

			//NEED TO UPDATE OTHERS' UI
			const socket = new WebSocket(`ws://localhost:5555/updateusers`);

			socket.onopen = () => {
				console.log("logout sokcet open");
				socket.send(
					JSON.stringify({ type: "user_disconnect", name: `${name}` })
				);
				socket.close();
			};
			socket.onclose = () => {
				console.log("logout sokcet closed");
			};
		}
		sessionStorage.clear();
		navigate("/");
	};

	const authed: string | null = getLocalItem("Authenticated");
	if (!authed) {
		return <nav className="notAuthed">Not Authenticated</nav>;
	}
	return (
		<div>
			<nav className="actionsContainer">
				<div className="navUserName">{name}</div>
				<Actions />
				<button onClick={logout}>Logout</button>
			</nav>
		</div>
	);
};

export default Navbar;
