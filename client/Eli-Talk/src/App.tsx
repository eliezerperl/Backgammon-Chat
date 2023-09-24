import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Login from "components/auth/login/Login";
import Register from "components/auth/register/Register";
import Home from "components/contact/home/Home";
import { useEffect } from "react";
import Navbar from "./components/reusable/Navbar/Navbar";
import Footer from "./components/reusable/footer/Footer";
import setLocalItem from "./utils/sessionStorage/setLocalItem";
import getLocalItem from "./utils/sessionStorage/getLocalItem";
import GameBoard from "./components/game/GameBoard";

function App() {
	const authed: string | null = getLocalItem("Authenticated");

	useEffect(() => {
		if (authed) {
			setLocalItem("Authenticated", "true");
		}
	}, [authed]);

	return (
		<>
			<div className="appPageContainer">
				<HashRouter>
					<Navbar />
					<div className="contentContainer">
						{/* <div className="appContainer"> */}
						<Routes>
							<Route path="/" Component={Login} />
							<Route path="/register" Component={Register} />
							<Route path="/home" Component={Home} />
							<Route path="/play" Component={GameBoard} />
						</Routes>
						{/* </div> */}
					</div>
					<Footer />
				</HashRouter>
			</div>
		</>
	);
}

export default App;
