import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

const ProtectedRoute = ({ children }) => {
	const [accessToken, setAccessToken] = useState(
		localStorage.getItem("token")
	);

	const navigate = useNavigate();
	const { user, fetchUser } = useAuth();

	useEffect(() => {
		const routCheck = async () => {
			if (accessToken === null) {
				navigate("/auth/login", { replace: true });
			}

			if (accessToken !== null && user === null) {
				await fetchUser();
			}
		};

		routCheck();
	}, []);

	return children;
};

export default ProtectedRoute;
