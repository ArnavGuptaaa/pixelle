import axios from "axios";

axios.interceptors.request.use(
	(config) => {
		// Auth token must not be automatcally added for auth routes
		if (!config.url.includes("/auth")) {
			config.headers.Authorization = `Bearer ${localStorage.getItem(
				"token"
			)}`;
		}

		return config;
	},
	(error) => Promise.reject(error)
);

axios.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status && error.response.status == 403) {
			localStorage.removeItem("token");
			window.location.href = "/auth/login";
		}

		return Promise.reject(error);
	}
);
