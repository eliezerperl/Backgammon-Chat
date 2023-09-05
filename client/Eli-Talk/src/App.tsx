import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Login from "components/auth/login/Login";
import Register from "components/auth/register/Register";
import Home from "components/auth/home/Home";
import { useEffect } from "react";
import Navbar from "./components/reusable/Navbar/Navbar";
import Footer from "./components/reusable/footer/Footer";
import setLocalItem from "./utils/sessionStorage/setLocalItem";
import getLocalItem from "./utils/sessionStorage/getLocalItem";

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
						<div className="appContainer">
							<Routes>
								<Route path="/" Component={Login} />
								<Route path="/register" Component={Register} />
								<Route path="/home" Component={Home} />
							</Routes>
						</div>
					</div>
					<Footer />
				</HashRouter>
			</div>
		</>
	);
}

export default App;
