import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

const ProtectedRoute = ({ children }) => {
	const navigate = useNavigate();
	const { user, token, fetchUser } = useAuth();

	useEffect(() => {
		const routCheck = async () => {
			if (token === null) {
				navigate("/auth/login", { replace: true });
			}

			if (token !== null && user === null) {
				await fetchUser();
			}
		};

		routCheck();
	}, []);

	return children;
};

export default ProtectedRoute;
