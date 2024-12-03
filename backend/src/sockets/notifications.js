import { sendNotification } from "./utils.js";

const notifications = (io, socket) => {
	socket.on("notification:like", (data) => {
		try {
			sendNotification("like", data, io);
		} catch (error) {
			console.log("Like Socket Error", error);
		}
	});

	socket.on("notification:comment", (data) => {
		try {
			sendNotification("comment", data, io);
		} catch (error) {
			console.log("Comment Socket Error", error);
		}
	});
};

export default notifications;
