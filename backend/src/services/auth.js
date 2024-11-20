import db from "../db/index.js";
import { eq, or } from "drizzle-orm";
import { users } from "../db/schema.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Custom rrror
import ErrorResponse from "../utils/ErrorResponse.js";

// Load environment variables
dotenv.config({ path: "./src/config/.env" });

/**
 * Check if any existing user record in db exists with same email or username
 *
 * @function userExistsWithSameUsernameOrEmail
 * @param {string} username user username
 * @param {string} email user email
 * @returns {Promise<boolean>}
 */
export const userExistsWithSameUsernameOrEmail = async (username, email) => {
	try {
		const existingUserWithSameUsernameOrEmail = await db
			.select({
				userId: users.id,
			})
			.from(users)
			.where(or(eq(users.username, username), eq(users.email, email)))
			.limit(1);

		return (
			existingUserWithSameUsernameOrEmail &&
			existingUserWithSameUsernameOrEmail.length !== 0
		);
	} catch (error) {
		throw new ErrorResponse(500, "Failed to check user validity");
	}
};

/**
 * Hash user password
 *
 * @function hashPassword
 * @param {string} password user password
 * @returns {Promise<string>} hashed password
 */
export const hashPassword = async (password) => {
	try {
		const saltRounds = 10;

		return await bcrypt.hash(password, saltRounds);
	} catch (error) {
		throw new ErrorResponse(500, "Failed to secure password");
	}
};

/**
 * Create a new user in database
 *
 * @function createUser
 * @param {Object} userData
 * @returns {Promise<Object>} returns user id if created
 */
export const createUser = async (userData) => {
	try {
		const insertUserResult = await db
			.insert(users)
			.values(userData)
			.$returningId();

		return insertUserResult[0];
	} catch (error) {
		throw new ErrorResponse(500, "Failed to create user");
	}
};

/**
 * Create JWT from user data object
 *
 * @function getAccessToken
 * @param {object} userDataToBeSigned
 * @returns {string}
 */
export const getAccessToken = (userDataToBeSigned) => {
	const token = jwt.sign(userDataToBeSigned, process.env.JWT_TOKEN_SECRET, {
		expiresIn: "12h",
	});

	return token;
};

/**
 * Query user with given username from database
 *
 * @function fetchUserWithUsername
 * @param {string} username user username
 * @returns {Promise<Object>} returns user detail with matching username
 */
export const fetchUserWithUsername = async (username) => {
	try {
		let userData = await db
			.select({
				userId: users.id,
				username: users.username,
				passwordHash: users.password,
				email: users.email,
			})
			.from(users)
			.where(eq(users.username, username))
			.limit(1);

		return userData[0];
	} catch (error) {
		throw new ErrorResponse(500, "Failed to fetch user data");
	}
};

/**
 * Verify password by comparing hash
 *
 * @function verifyPassword
 * @param {string} plainTextPassword Input plain text password
 * @param {string} userPasswordHash User password hash stored in database
 * @returns {Promise<Boolean>} Returns true if passwords match, false otherwise
 */
export const verifyPassword = async (plainTextPassword, userPasswordHash) => {
	return await bcrypt.compare(plainTextPassword, userPasswordHash);
};
