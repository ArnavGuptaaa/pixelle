import { onlineUsers } from "./index.js";

export const sendNotification = (type, data, io) => {
	const { recipientUserId, actingUserId, actingUsername, postId } = data;

	if (!recipientUserId || !actingUserId || !actingUsername || !postId) {
		return;
	}

	try {
		// Get socket ID from user ID
		const recipientSocketId = onlineUsers[recipientUserId];

		io.to(recipientSocketId).emit("notification", {
			type,
			actingUserId,
			actingUsername,
			postId,
		});
	} catch (error) {
		console.log(`${type} Socket Error`, error);
	}
};
