// Hooks
import { useAuth } from "./useAuth";
import { useEffect, useState, useContext, createContext } from "react";

// Other Imports
import io from "socket.io-client";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
	const [notifications, setNotifications] = useState([]);
	const [socket, setSocket] = useState();

	const { token } = useAuth();

	useEffect(() => {
		const connectSocket = () => {
			if (!token) {
				if (socket) {
					socket.disconnect();
				}

				return;
			}

			const returnedSocket = io(import.meta.env.VITE_API_BASE_URL, {
				query: { token },
			});

			setSocket((prevData) => returnedSocket);

			returnedSocket.on("notification", (data) => {
				setNotifications((prevData) => [data, ...prevData]);
			});
		};

		connectSocket();

		return () => {
			if (socket) {
				socket.off("notification");
				socket.disconnect();
			}
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
