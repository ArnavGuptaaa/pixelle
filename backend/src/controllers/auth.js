// Auth Service
import {
	userExistsWithSameUsernameOrEmail,
	hashPassword,
	createUser,
	getAccessToken,
	fetchUserWithUsername,
	verifyPassword,
} from "../services/auth.js";

import ErrorResponse from "../utils/ErrorResponse.js";

const registerUser = async (req, res, next) => {
	try {
		// Check if user already exists
		// If user exists, return error response
		let userExists = await userExistsWithSameUsernameOrEmail(
			req.body.username,
			req.body.email
		);

		if (userExists) {
			throw new ErrorResponse(
				409,
				"User with the same username or email already exists"
			);
		}

		// Else, Hash password
		const hashedPassword = await hashPassword(req.body.password);

		// Create user object
		const newUser = {
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword,
			profile_image_url: "testImageURL",
			follower_count: 0,
		};

		// Post to DB
		const createdUser = await createUser(newUser);

		// JWT sign
		// TODO: sign profile picture here
		const accessToken = getAccessToken({
			id: createdUser.id,
			username: req.body.username,
		});

		// Return response
		return res.json({
			success: true,
			message: "User registered successfully",
			user: {
				id: createdUser.id,
				username: newUser.username,
			},
			accessToken,
		});
	} catch (error) {
		next(error);
	}
};

const loginUser = async (req, res, next) => {
	try {
		// Get user from DB
		let loggedInUser = await fetchUserWithUsername(req.body.username);

		// If user doesnt exist, return error response
		if (!loggedInUser) {
			throw new ErrorResponse(404, "User does not exist");
		}

		// Else, verify password
		const isPasswordCorrect = await verifyPassword(
			req.body.password,
			loggedInUser.passwordHash
		);

		if (!isPasswordCorrect) {
			throw new ErrorResponse(401, "Invalid user credentials");
		}

		// JWT sign
		const accessToken = getAccessToken({
			id: loggedInUser.userId,
			username: req.body.username,
		});

		// Response must not contain password and user DB Id
		delete loggedInUser.passwordHash;
		// delete loggedInUser.userId;

		// Return response
		res.json({
			success: true,
			message: "User logged in successfully",
			user: {
				id: loggedInUser.userId,
				username: req.body.username,
			},
			accessToken,
		});
	} catch (error) {
		next(error);
	}
};

const fetchUser = (req, res, next) => {
	res.status(200).json({
		success: true,
		user: req.user,
	});
};

export { registerUser, loginUser, fetchUser };
