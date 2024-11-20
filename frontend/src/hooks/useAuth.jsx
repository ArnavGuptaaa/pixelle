import { useState, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";

import {
	loginService,
	registerService,
	verifyTokenService,
} from "../services/AuthService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const navigate = useNavigate();

	const login = async (userCredentials) => {
		setLoading(true);
		setError(null);

		try {
			const response = await loginService(userCredentials);

			const userDetails = {
				id: response.user.id,
				username: response.user.username,
			};

			setUser(userDetails);
			localStorage.setItem("token", response.accessToken);
			navigate("/", { replace: true });
		} catch (error) {
			console.log("Login Failed : ", error.message);

			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	const register = async (userCredentials) => {
		setLoading(true);
		setError(null);

		try {
			const response = await registerService(userCredentials);

			const userDetails = {
				id: response.user.id,
				username: response.user.username,
			};

			setUser(userDetails);
			localStorage.setItem("token", response.accessToken);

			navigate("/", { replace: true });
		} catch (error) {
			console.log("Register Failed : ", error.message);

			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		localStorage.removeItem("token");

		setUser(null);

		navigate("/auth/login", { replace: true });
	};

	const fetchUser = async () => {
		setLoading(true);
		setError(null);

		const token = localStorage.getItem("token");

		try {
			const response = await verifyTokenService(token);

			// TODO: set profile picture here
			const userDetails = {
				id: response.user.id,
				username: response.user.username,
			};

			console.log("userdetails");
			console.log(userDetails);

			setUser(userDetails);
		} catch (error) {
			console.log("Failed to set user : ", error.message);
		} finally {
			setLoading(false);
		}
	};

	const value = {
		user,
		login,
		register,
		logout,
		fetchUser,
		loading,
		error,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
