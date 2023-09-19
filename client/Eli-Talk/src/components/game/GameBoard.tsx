import "./GameBoard.css";
import { useNavigate } from "react-router";

const GameBoard = () => {
	const navigate = useNavigate();

	//GAME WEBSOCKET CLOSES CUZ THE TWO PLAYERS NAVIGATED
	//GAMEPLAY WS gameplay/user1iduser2id
	//OPEN NEW GAMEPLAY WS FOR THEM TO HANDLE GAME

	const handleCloseGame = () => {
		navigate("/home");
	};

	return (
		<div>
			<div onClick={handleCloseGame} className="closeGameBtn">
				X
			</div>
			<div>GAME BOARD</div>
		</div>
	);
};

export default GameBoard;
