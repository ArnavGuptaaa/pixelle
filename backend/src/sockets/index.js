import notifications from "./notifications.js";
import jwt from "jsonwebtoken";

export const onlineUsers = {};

const initializeSockets = (io) => {
	io.on("connection", (socket) => {
		console.log(`${socket.id} connected`);

		// Get token attached to socket
		const token = socket.handshake.query.token;

		if (!token) {
			socket.disconnect();
			console.log("No auth token provided. Socket disconnected");
			return;
		}

		jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, user) => {
			if (err) {
				socket.disconnect();
				console.log(
					"Token verification unsuccessful. Socket disconnected"
				);
			}

			onlineUsers[user.id] = socket.id;

			// Attach Notification Events
			notifications(io, socket);

			// Socket Disconnect
			socket.on("disconnect", () => {
				console.log(`${socket.id} disconnected`);
			});
		});
	});
};

export default initializeSockets;
