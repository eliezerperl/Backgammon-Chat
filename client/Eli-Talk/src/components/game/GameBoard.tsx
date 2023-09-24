import { useEffect, useState } from "react";
import "./GameBoard.css";
import { useNavigate } from "react-router";
import getLocalItem from "@/utils/sessionStorage/getLocalItem";
import deleteLocalItem from "@/utils/sessionStorage/deleteLocalItem";

const GameBoard = () => {
	const navigate = useNavigate();
	const [gameplaySocket, setGameplaySocket] = useState<WebSocket | null>(null);

	const id: string | null = getLocalItem("Id");
	const playingId: string | null = getLocalItem("currentlyAgainstId");
	const playingName: string | null = getLocalItem("currentlyAgainstName");

	//GAME WEBSOCKET CLOSES CUZ THE TWO PLAYERS NAVIGATED
	//GAMEPLAY WS gameplay/myid/room-id
	useEffect(() => {
		if (id && playingId) {
			const unsorted: string[] = [id, playingId];
			const roomId: string = unsorted.sort().join();
			const socket = new WebSocket(
				`ws://localhost:9000/gameplay/${id}/${roomId}`
			);

			socket.onopen = () => {
				console.log("connected to gameplay socket");
			};

			socket.onmessage = (event) => {
				const msg = JSON.parse(event.data);
				if (msg === "quit") {
					alert(`${playingName} has quit the game`);
				}
			};

			socket.onclose = async () => {
				console.log("GAMEPLAY SOCKET closed");
			};
			setGameplaySocket(socket);

			return () => {
				if (socket) {
					socket.close();
				}
			};
		}
	}, [id]);
	//OPEN NEW GAMEPLAY WS FOR THEM TO HANDLE GAME

	const handleCloseGame = () => {
		deleteLocalItem("currentlyAgainstId");
		deleteLocalItem("currentlyAgainstName");
		gameplaySocket?.send(JSON.stringify({ quit: "quit" }));
		navigate("/home");
	};

	return (
		<div className="gameContainer">
			<div className="board">
				<div className="halfBoard">
					<div className="point"></div>
					<div className="point"></div>
					<div className="point"></div>
					<div className="point"></div>
					<div className="point"></div>
					<div className="middleBar"></div>
					<div className="point"></div>
					<div className="point"></div>
					<div className="point"></div>
					<div className="point"></div>
					<div className="point"></div>
				</div>
				<div className="halfBoard bottomHalf">
					<div className="point"></div>
					<div className="point"></div>
					<div className="point"></div>
					<div className="point"></div>
					<div className="point"></div>
					<div className="middleBar"></div>
					<div className="point"></div>
					<div className="point"></div>
					<div className="point"></div>
					<div className="point"></div>
					<div className="point"></div>
				</div>
			</div>
			<div onClick={handleCloseGame} className="closeGameBtn">
				X
			</div>
		</div>
	);
};

export default GameBoard;
