import ErrorResponse from "../utils/ErrorResponse.js";

import db from "../db/index.js";
import { follows, users } from "../db/schema.js";
import { and, eq, sql } from "drizzle-orm";

/**
 * Fetches all information and posts about user
 *
 * @function getUser
 * @param {File} userId
 * @returns {Promise<Object>}
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

		// console.log(userInfo);
		return userInfo[0];
	} catch (error) {
		console.log(error);

		throw new ErrorResponse(500, "Failed to fetch user profile data");
	}
};

/**
 * Creates a user follow in DB
 *
 * @function createFollowRecord
 * @param {Object} followerData
 * @returns {Promise<Object>}
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
		console.log(error);

		throw new ErrorResponse(500, "Failed to follow user");
	}
};

/**
 * Returns true if input follow exists
 *
 * @function doesFollowExist
 * @param {Number} followerId
 * @param {Number} followingId
 * @returns {Promise<Boolean>}
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
		console.log(error);

		throw new ErrorResponse(500, "Failed to fetch existing follow");
	}
};

/**
 * increment follow count on user by 1
 *
 * @function incrementFollowCount
 * @param {Number} userId
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
		console.log(error);

		throw new ErrorResponse(500, "Failed to update follow count on user");
	}
};

/**
 * Fetches all information and posts about user
 *
 * @function deleteFollowRecord
 * @param {Number} followerId
 * @param {Number} followingId
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
		console.log(error);

		throw new ErrorResponse(500, "Failed to unfollow user");
	}
};

/**
 * Decrement follow count on user by 1
 *
 * @function decrementFollowCount
 * @param {Number} userId
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
		console.log(error);

		throw new ErrorResponse(500, "Failed to update follow count on user");
	}
};
