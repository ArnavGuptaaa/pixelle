import db from "../db/index.js";
import { eq, or } from "drizzle-orm";
import { users } from "../db/schema.js";

import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

// Custom rrror
import ErrorResponse from "../utils/ErrorResponse.js";

// Load environment variables
dotenv.config({ path: "./src/config/.env" });

/**
 * Checks if an existing user record in the database has the same email or username.
 *
 * @function userExistsWithSameUsernameOrEmail
 * @param {string} username - The username to check for conflicts.
 * @param {string} email - The email to check for conflicts.
 * @returns {Promise<boolean>} A promise that resolves to true if a user with the same username or email exists, otherwise false.
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
 * Hashes a user's password.
 *
 * @function hashPassword
 * @param {string} password - The user's password to hash.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
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
 * Creates a new user in the database.
 *
 * @function createUser
 * @param {Object} userData - The data of the user to be created.
 * @returns {Promise<Object>} A promise that resolves to the user ID if the creation is successful.
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
 * Creates a JWT from the provided user data object.
 *
 * @function getAccessToken
 * @param {Object} userDataToBeSigned - The user data to include in the JWT payload.
 * @returns {string} The generated JWT.
 */
export const getAccessToken = (userDataToBeSigned) => {
	const token = jwt.sign(userDataToBeSigned, process.env.JWT_TOKEN_SECRET, {
		expiresIn: "12h",
	});

	return token;
};

/**
 * Queries the database for a user with the given username.
 *
 * @function fetchUserWithUsername
 * @param {string} username - The username to search for.
 * @returns {Promise<Object>} A promise that resolves to the user details if a matching username is found.
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
 * Verifies a password by comparing the plain text password with the stored hash.
 *
 * @function verifyPassword
 * @param {string} plainTextPassword - The input plain text password.
 * @param {string} userPasswordHash - The user password hash stored in the database.
 * @returns {Promise<boolean>} A promise that resolves to true if the passwords match, false otherwise.
 */
export const verifyPassword = async (plainTextPassword, userPasswordHash) => {
	return await bcrypt.compare(plainTextPassword, userPasswordHash);
};
