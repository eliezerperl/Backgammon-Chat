import { BaseSyntheticEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import checkLogin from "@/utils/auth/checkLogin";
import saveEmails from "@/utils/localEmails/saveEmails";
import GetLocalEmails from "@/utils/localEmails/getLocalEmails";

const Login = () => {
	const navigate = useNavigate();
	const [wasWrong, setWasWrong] = useState(false);
	const [isInputFocused, setInputFocused] = useState<boolean>(false); // State to track input focus
	const [selectedEmail, setSelectedEmail] = useState<string>(""); // State to store the selected email

	const handleLogin = async (e: BaseSyntheticEvent) => {
		e.preventDefault();

		const data = {
			email: e.target[0].value,
			password: e.target[1].value,
		};

		try {
			const isSuccess = await checkLogin(data);

			if (isSuccess) {
				saveEmails(data.email);
				navigate("/home");
			} else {
				setWasWrong(true);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const emails: string[] = GetLocalEmails();

	return (
		<div className="loginPageContainer">
			<h1>Login</h1>
			<form className="loginContainer" onSubmit={handleLogin}>
				<div className="emailInputContainer">
					<label htmlFor="emailInput">Email</label>
					<input
						required
						value={selectedEmail}
						type="text"
						id="emailInput"
						onChange={(e: BaseSyntheticEvent) =>
							setSelectedEmail(e.target.value)
						}
						onFocus={() => setInputFocused(true)}
						onBlur={() => setTimeout(() => setInputFocused(false), 200)} //without timeout it does not catch the value of an email
					/>
					{isInputFocused && emails && (
						<div className="emailListContainer">
							{emails.map((email) => (
								<div
									key={email}
									className="singleEmail"
									onClick={(e: BaseSyntheticEvent) =>
										setSelectedEmail(e.target.innerText)
									}>
									{email}
								</div>
							))}
						</div>
					)}
				</div>

				<label htmlFor="passInput">Password</label>
				<input required type="text" id="passInput" />
				{wasWrong && (
					<span className="credsErrMsg">Email or password were wrong</span>
				)}
				<button>Login</button>
			</form>
			<div className="registerQuestionContainer">
				Not registered?
				<Link to="/register">Register here!</Link>
			</div>
		</div>
	);
};

export default Login;
