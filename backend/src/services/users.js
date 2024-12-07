import ErrorResponse from "../utils/ErrorResponse.js";

import db from "../db/index.js";
import { follows, users } from "../db/schema.js";
import { and, eq, like, sql } from "drizzle-orm";

/**
 * Fetches all information and posts about the user.
 *
 * @function getUser
 * @param {number} userId - The ID of the user to fetch data for.
 * @returns {Promise<Object>} A promise that resolves to the user's profile information.
 */
export const getUser = async (userId) => {
	try {
		const userInfo = await db
			.select({
				id: users.id,
				username: users.username,
				followCount: users.follower_count,
				avatarUrl: users.profile_image_url,
			})
			.from(users)
			.where(eq(users.id, userId))
			.limit(1);

		return userInfo[0];
	} catch (error) {
		throw new ErrorResponse(500, "Failed to fetch user profile data");
	}
};

/**
 * Creates a user follow record in the database.
 *
 * @function createFollowRecord
 * @param {Object} followerData - The data for the follow record, including follower and following user IDs.
 * @returns {Promise<Object>} A promise that resolves to the follow record details.
 */
export const createFollowRecord = async (followerData) => {
	try {
		const insertFollowResult = await db
			.insert(follows)
			.values(followerData)
			.$returningId();

		// Once followed, update follower count on user table
		await incrementFollowCount(followerData.following_user_id);

		return insertFollowResult[0];
	} catch (error) {
		throw new ErrorResponse(500, "Failed to follow user");
	}
};

/**
 * Returns true if the follow record exists between the given users.
 *
 * @function doesFollowExist
 * @param {number} followerId - The ID of the follower user.
 * @param {number} followingId - The ID of the user being followed.
 * @returns {Promise<boolean>} A promise that resolves to true if the follow exists, false otherwise.
 */
export const doesFollowExist = async (followerId, followingId) => {
	try {
		const existingFollow = await db
			.select({
				id: follows.id,
			})
			.from(follows)
			.where(
				and(
					eq(follows.follower_user_id, followerId),
					eq(follows.following_user_id, followingId)
				)
			)
			.limit(1);

		return !!existingFollow.length;
	} catch (error) {
		throw new ErrorResponse(500, "Failed to fetch existing follow");
	}
};

/**
 * Increments the follow count of a user by 1.
 *
 * @function incrementFollowCount
 * @param {number} userId - The ID of the user whose follow count should be incremented.
 */
export const incrementFollowCount = async (userId) => {
	try {
		await db
			.update(users)
			.set({
				follower_count: sql`${users.follower_count} + 1`,
			})
			.where(eq(users.id, userId));
	} catch (error) {
		throw new ErrorResponse(500, "Failed to update follow count on user");
	}
};

/**
 * Deletes a follow record from the database.
 *
 * @function deleteFollowRecord
 * @param {number} followerId - The ID of the follower user.
 * @param {number} followingId - The ID of the user being unfollowed.
 */
export const deleteFollowRecord = async (followerId, followingId) => {
	try {
		// No limit clause
		await db
			.delete(follows)
			.where(
				and(
					eq(follows.follower_user_id, followerId),
					eq(follows.following_user_id, followingId)
				)
			);

		// Once unfollowed, update follower count on user table
		await decrementFollowCount(followingId);
	} catch (error) {
		throw new ErrorResponse(500, "Failed to unfollow user");
	}
};

/**
 * Decrements the follow count of a user by 1.
 *
 * @function decrementFollowCount
 * @param {number} userId - The ID of the user whose follow count should be decremented.
 */
export const decrementFollowCount = async (userId) => {
	try {
		await db
			.update(users)
			.set({
				follower_count: sql`${users.follower_count} - 1`,
			})
			.where(eq(users.id, userId));
	} catch (error) {
		throw new ErrorResponse(500, "Failed to update follow count on user");
	}
};

/**
 * Fetches an array of user IDs of all the users followed by the given user.
 *
 * @function getFollowedUserIdArray
 * @param {number} userId - The ID of the user whose followed users are to be fetched.
 * @returns {Promise<number[]>} A promise that resolves to an array of user IDs of the users followed by the given user.
 */
export const getFollowedUserIdArray = async (userId) => {
	try {
		const followingIds = await db
			.select({ followingId: follows.following_user_id })
			.from(follows)
			.where(eq(follows.follower_user_id, userId));

		return followingIds.map((user) => user.followingId);
	} catch (error) {
		throw new ErrorResponse(500, "Failed to fetch followed users");
	}
};

/**
 * Fetches user search results matching a given string.
 *
 * @function getUserSearchResults
 * @param {string} likeString - The string to search for in user usernames.
 * @returns {Promise<Object[]>} A promise that resolves to an array of user objects matching the search criteria.
 */

export const getUserSearchResults = async (likeString) => {
	try {
		const searchResults = await db
			.select({
				id: users.id,
				username: users.username,
				followers: users.follower_count,
			})
			.from(users)
			.where(like(users.username, `%${likeString}%`));

		return searchResults;
	} catch (error) {
		throw new ErrorResponse(500, "Failed to fetch user search results");
	}
};
