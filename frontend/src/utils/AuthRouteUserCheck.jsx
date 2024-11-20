import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthRouteUserCheck = ({ children }) => {
	const navigate = useNavigate();
	const [accessToken, setAccessToken] = useState(
		localStorage.getItem("token")
	);

	useEffect(() => {
		if (accessToken != null) {
			navigate("/", { replace: true });
		}
	}, []);

	return accessToken ? (
		<div>
			<h1>Loading...</h1>
		</div>
	) : (
		children
	);
};

export default AuthRouteUserCheck;
