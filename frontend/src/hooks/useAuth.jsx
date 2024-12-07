// Hooks
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useState, useContext, createContext, useEffect } from "react";

// Services
import {
	loginService,
	registerService,
	verifyTokenService,
} from "../services/AuthService";

// Other Imports
import { cn } from "@/lib/utils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const navigate = useNavigate();
	const { toast } = useToast();

	useEffect(() => {
		setToken(localStorage.getItem("token"));
	}, []);

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
			setToken(response.accessToken);

			toast({
				className: cn("hidden md:block"),
				variant: "success",
				title: "Login Successful",
				description: "Good to see you back!",
			});

			navigate("/", { replace: true });
		} catch (error) {
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
			setToken(response.accessToken);

			toast({
				className: cn("hidden sm:block"),
				variant: "success",
				title: "User Registration Successful",
				description: "Welcome to Pixelle!",
			});

			navigate("/", { replace: true });
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		localStorage.removeItem("token");
		setToken("");

		setUser(null);

		navigate("/auth/login", { replace: true });
	};

	const fetchUser = async () => {
		setLoading(true);
		setError(null);

		const token = localStorage.getItem("token");
		setToken(token);

		try {
			const response = await verifyTokenService(token);

			// TODO: set profile picture here
			const userDetails = {
				id: response.user.id,
				username: response.user.username,
			};

			setUser(userDetails);
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	const value = {
		user,
		token,
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
