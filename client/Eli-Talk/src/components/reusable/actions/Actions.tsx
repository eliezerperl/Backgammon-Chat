import "./Actions.css";

const Actions = (props: any) => {
	return (
		<>
			<div className="action" onClick={props.onClick}>
				Play Random
			</div>
			<div className="action" onClick={props.onClick}>
				Help
			</div>
		</>
	);
};

export default Actions;
