import { useEffect, useState, useContext, createContext } from "react";
import io from "socket.io-client";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
	const [notifications, setNotifications] = useState([]);
	let socket;
	let token;

	useEffect(() => {
		token = localStorage.getItem("token");

		socket = io(import.meta.env.VITE_API_BASE_URL, {
			query: { token },
		});

		socket.on("notification", (data) => {
			setNotifications((prevData) => [data, ...prevData]);
		});

		return () => {
			socket.off("notification");
			socket.disconnect();
		};
	}, [token]);

	const sendLikeNotification = (
		actingUserId,
		actingUsername,
		postId,
		recipientUserId
	) => {
		if (!socket) return;

		socket.emit("notification:like", {
			recipientUserId,
			actingUserId,
			actingUsername,
			postId,
		});
	};

	const sendCommentNotification = (
		actingUserId,
		actingUsername,
		postId,
		recipientUserId
	) => {
		if (!socket) return;

		socket.emit("notification:comment", {
			recipientUserId,
			actingUserId,
			actingUsername,
			postId,
		});
	};

	const value = {
		socket,
		notifications,
		sendCommentNotification,
		sendLikeNotification,
	};

	return (
		<NotificationContext.Provider value={value}>
			{children}
		</NotificationContext.Provider>
	);
};

export const useNotifications = () => {
	return useContext(NotificationContext);
};
