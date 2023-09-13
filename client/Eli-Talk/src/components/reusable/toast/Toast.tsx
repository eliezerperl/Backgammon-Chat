import React, { useEffect } from "react";

interface ToastProps {
	message: string;
	duration: number;
	onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, duration, onClose }) => {
	useEffect(() => {
		const timeout = setTimeout(() => {
			onClose();
		}, duration);

		return () => {
			clearTimeout(timeout);
		};
	}, [duration, onClose]);

	return (
		<div className="toast">
			<div className="toast-message">{message}</div>
		</div>
	);
};

export default Toast;
