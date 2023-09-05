import { useState } from "react";
import "./FormInput.css";

const FormInput = (props: any) => {
	const [focused, setFocused] = useState(false);
	const { label, errorMessage, onChange, id, ...inputProps } = props;
	return (
		<div className="formInput">
			<label htmlFor={props.id}>{label}</label>
			<input
				id={id}
				{...inputProps}
				onChange={onChange}
				onBlur={() => setFocused(true)}
				onFocus={() =>
					inputProps.name === "comfirmPassword" && setFocused(true)
				}
				focused={focused.toString()}
			/>
			<span className="errorMsg">{errorMessage}</span>
		</div>
	);
};

export default FormInput;
