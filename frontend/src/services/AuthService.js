import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const loginService = async (userCredentials) => {
	const LOGIN_URL = `${BASE_URL}/auth/login`;

	try {
		const response = await axios.post(LOGIN_URL, userCredentials);

		return response.data;
	} catch (error) {
		throw new Error(error.response?.data?.message || "User login failed");
	}
};

export const registerService = async (userCredentials) => {
	const REGISTER_URL = `${BASE_URL}/auth/register`;

	try {
		const response = await axios.post(REGISTER_URL, userCredentials);

		return response.data;
	} catch (error) {
		throw new Error(
			error.response?.data?.message || "User registration failed"
		);
	}
};

export const verifyTokenService = async (token) => {
	const VERIFY_TOKEN_URL = `${BASE_URL}/auth/me`;
	const requestOptions = {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	};

	try {
		const response = await axios.get(VERIFY_TOKEN_URL, requestOptions);

		return response.data;
	} catch (error) {
		throw new Error(
			error.response?.data?.message || "Token verification failed"
		);
	}
};
