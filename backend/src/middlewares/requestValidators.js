export const validateCreateRequest = (req, res, next) => {
	let errors = [];

	const { caption } = req.body;

	if (req.file == null) {
		errors.push({ field: "Image", message: "Image is required" });
	} else if (!req.file.mimetype.startsWith("image/")) {
		errors.push({ field: "Image", message: "Image must be an image" });
	} else {
		const fileSizeInMb = req.file.size / 10 ** 6;

		if (fileSizeInMb > 2) {
			errors.push({
				field: "Image",
				message: "Image size must not exceed 2MB",
				uploadedFileSize: `${fileSizeInMb.toFixed(2)} MB`,
			});
		}
	}

	if (caption && caption.length > 200) {
		errors.push({ field: "Caption", message: "Caption too long" });
	}

	if (errors.length > 0) {
		return res.status(400).json({
			success: false,
			errors,
		});
	}

	next();
};

export const validateCommentRequest = (req, res, next) => {
	let errors = [];

	const { content, postId } = req.body;

	if (!content || (content && content.trim() === "")) {
		errors.push({
			field: "Content",
			message: "Comment content is required",
		});
	} else if (content.length > 500) {
		errors.push({ field: "Content", message: "Comment content too long" });
	}

	if (!postId) {
		errors.push({ field: "postId", message: "Post Id is required" });
	}

	if (errors.length > 0) {
		return res.status(400).json({
			success: false,
			errors,
		});
	}

	next();
};

export const validateDeleteCommentRequest = (req, res, next) => {
	let errors = [];

	const { commentId } = req.body;

	if (!commentId) {
		errors.push({ field: "commentId", message: "Comment Id is required" });
	}

	if (errors.length > 0) {
		return res.status(400).json({
			success: false,
			errors,
		});
	}

	next();
};
export const validateUserRequest = (req, res, next) => {
	let errors = [];

	const { username, email, password } = req.body;

	if (!username) {
		errors.push({ field: "username", message: "Username is required" });
	} else if (username.length < 8 || username.length > 25) {
		errors.push({
			field: "username",
			message: "Username must be 8 - 25 characters long",
		});
	}

	// https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression
	if (email && !/^\S+@\S+\.\S+$/.test(email)) {
		errors.push({
			field: "email",
			message: "Email must be a valid email address",
		});
	}

	if (!password) {
		errors.push({ field: "password", message: "Password is required" });
	} else if (password.length < 8 || password.length > 255) {
		errors.push({
			field: "password",
			message: "Username must be 8 - 255 characters long",
		});
	}

	if (errors.length > 0) {
		return res.status(400).json({
			success: false,
			errors,
		});
	}

	next();
};

export const validateFollowRequest = (req, res, next) => {
	let errors = [];

	const { followingId } = req.body;

	if (!followingId) {
		errors.push({
			field: "followingId",
			message: "Following Id is required",
		});
	}

	if (errors.length > 0) {
		return res.status(400).json({
			success: false,
			errors,
		});
	}

	next();
};

export const validateLikeRequest = (req, res, next) => {
	let errors = [];

	const { postId } = req.body;

	if (!postId) {
		errors.push({
			field: "postId",
			message: "Post Id is required",
		});
	}

	if (errors.length > 0) {
		return res.status(400).json({
			success: false,
			errors,
		});
	}

	next();
};
