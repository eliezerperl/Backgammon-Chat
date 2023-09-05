import "./Actions.css";

const FormInput = (props: any) => {
	//ACTION REQUESTS

	//END ACTION REQUESTS
	return (
		<>
			<div className="action" onClick={props.onClick}>
				Chat
			</div>
			<div className="action" onClick={props.onClick}>
				Play
			</div>
			<div className="action" onClick={props.onClick}>
				Help
			</div>
		</>
	);
};

export default FormInput;
