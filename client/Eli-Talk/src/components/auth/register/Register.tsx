import { BaseSyntheticEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import registerUser from "@/utils/auth/registerUser";
// import checkLogin from "@/utils/auth/checkLogin";
import FormInput from "@/components/reusable/formInput/FormInput";
import inputs from "./inputData";

const Register = () => {
	const [values, setValues]: any = useState({
		name: "",
		email: "",
		password: "",
		comfirmPassword: "",
	});

	const formInputs: any[] = inputs; //imported

	const navigate = useNavigate();

	const handleRegister = async (e: BaseSyntheticEvent) => {
		e.preventDefault();

		const registerData = {
			id: "",
			name: values.name,
			email: values.email,
			password: values.password,
		};
		try {
			const res = await registerUser(registerData);
			if (res) {
				navigate("/");
			}
		} catch (error) {
			console.log(error);
		}

		// //functionality to login straight away
		// const loginData = {
		// 	email: values.email,
		// 	password: values.password,
		// };
		//
		// try {
		// 	const isSuccess = await checkLogin(loginData);

		// 	if (isSuccess) {
		// 		setTimeout(() => {
		// 			navigate("/home");
		// 		}, 1000); // in order to present the token and name to user
		// 	}
		// } catch (error) {
		// 	console.log(error);
		// }
	};
	const onChange = (e: BaseSyntheticEvent) => {
		setValues({ ...values, [e.target.name]: e.target.value });
	};
	return (
		<div className="registerPageContainer">
			<h1>Register</h1>
			<form className="registerContainer" onSubmit={handleRegister}>
				{formInputs.map((input: any) => (
					<FormInput
						key={input.id}
						{...input}
						value={values[input.id]}
						onChange={onChange}
					/>
				))}
				<button>Register</button>
			</form>
			<Link to="/">Back to login</Link>
		</div>
	);
};

export default Register;
