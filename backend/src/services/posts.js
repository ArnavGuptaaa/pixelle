// Custom rrror
import ErrorResponse from "../utils/ErrorResponse.js";

// S3
import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
} from "@aws-sdk/client-s3";
import s3 from "../config/s3.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import db from "../db/index.js";
import { and, eq, inArray, sql } from "drizzle-orm";
import { getFollowedUserIdArray } from "./users.js";
import { comments, likes, posts, users } from "../db/schema.js";

// Load environment variables
import dotenv from "dotenv";
dotenv.config({ path: "./src/config/.env" });

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

/**
 * Uploads an image to S3.
 *
 * @function uploadImageToS3
 * @param {File} image - The image file to upload.
 * @returns {string} The name of the uploaded image.
 */
export const uploadImageToS3 = async (image) => {
	try {
		// Create unique image name
		const imageExtension = image.originalname.split(".").at(-1);
		const imageName = crypto.randomUUID() + "." + imageExtension;

		// Upload Logic
		const command = new PutObjectCommand({
			Bucket: S3_BUCKET_NAME,
			Key: imageName,
			Body: image.buffer,
			ContentType: image.mimetype,
		});

		await s3.send(command);

		return imageName;
	} catch (error) {
		throw new ErrorResponse(500, "Failed to upload to S3");
	}
};

/**
 * Creates a new post record in the database.
 *
 * @function createPostRecord
 * @param {Object} postData - The data for the post to be created.
 * @returns {Promise<Object>} A promise that resolves to the post ID if the creation is successful.
 */
export const createPostRecord = async (postData) => {
	try {
		const insertPostResult = await db
			.insert(posts)
			.values(postData)
			.$returningId();

		return insertPostResult[0];
	} catch (error) {
		throw new ErrorResponse(500, "Failed to create post");
	}
};

/**
 * Retrieves all posts for wander from the database.
 *
 * @function getWanderPosts
 * @returns {Promise<Object[]>} A promise that resolves to an array of posts, each with a signed image URL.
 */
export const getWanderPosts = async () => {
	try {
		let wanderPosts = await db
			.select({
				id: posts.id,
				imageUrl: posts.image_url,
				caption: posts.caption,
				likes: posts.likes,
				userId: posts.user_id,
				username: users.username,
			})
			.from(posts)
			.innerJoin(users, eq(posts.user_id, users.id))
			.orderBy(sql`${posts.created_at} DESC`);

		// Replace image_url with signed image URL
		for (let post of wanderPosts) {
			const command = new GetObjectCommand({
				Bucket: S3_BUCKET_NAME,
				Key: post.imageUrl,
			});

			const s3SignedImageUrl = await getSignedUrl(s3, command, {
				expiresIn: 3600,
			});

			post.imageUrl = s3SignedImageUrl;
		}

		return wanderPosts;
	} catch (error) {
		throw new ErrorResponse(500, "Failed to fetch wander posts");
	}
};

/**
 * Retrieves all posts for the home feed from the database.
 *
 * @function getFeedPosts
 * @param {number} userId - The ID of the user whose feed is being fetched.
 * @returns {Promise<Object[]>} A promise that resolves to an array of posts, each with a signed image URL.
 */
export const getFeedPosts = async (userId) => {
	try {
		const followedUserIds = await getFollowedUserIdArray(userId);

		if (
			!followedUserIds ||
			(followedUserIds && followedUserIds.length === 0)
		) {
			return [];
		}

		let feedPosts = await db
			.select({
				id: posts.id,
				imageUrl: posts.image_url,
				caption: posts.caption,
				likes: posts.likes,
				userId: posts.user_id,
				username: users.username,
			})
			.from(posts)
			.innerJoin(users, eq(posts.user_id, users.id))
			.where(inArray(posts.user_id, followedUserIds))
			.orderBy(sql`${posts.created_at} DESC`);

		// Replace image_url with signed image URL
		for (let post of feedPosts) {
			const command = new GetObjectCommand({
				Bucket: S3_BUCKET_NAME,
				Key: post.imageUrl,
			});

			const s3SignedImageUrl = await getSignedUrl(s3, command, {
				expiresIn: 3600,
			});

			post.imageUrl = s3SignedImageUrl;
		}

		return feedPosts;
	} catch (error) {
		throw new ErrorResponse(500, "Failed to fetch home feed posts");
	}
};

/**
 * Retrieves a single post matching the given post ID.
 *
 * @function getSinglePost
 * @param {number} postId - The ID of the post to fetch.
 * @returns {Promise<Object>} A promise that resolves to the post object, with a signed image URL.
 */
export const getSinglePost = async (postId) => {
	try {
		let singlePost = await db
			.select({
				id: posts.id,
				imageUrl: posts.image_url,
				caption: posts.caption,
				likes: posts.likes,
				userId: posts.user_id,
				username: users.username,
			})
			.from(posts)
			.innerJoin(users, eq(posts.user_id, users.id))
			.where(eq(posts.id, postId))
			.limit(1);

		if (
			singlePost === null ||
			singlePost?.length === 0 ||
			singlePost[0] === null
		) {
			throw new ErrorResponse(500, "No post fetched");
		}

		const command = new GetObjectCommand({
			Bucket: S3_BUCKET_NAME,
			Key: singlePost[0].imageUrl,
		});

		const s3SignedImageUrl = await getSignedUrl(s3, command, {
			expiresIn: 3600,
		});

		singlePost[0].imageUrl = s3SignedImageUrl;

		return singlePost[0];
	} catch (error) {
		throw new ErrorResponse(500, "Failed to fetch wander posts");
	}
};

/**
 * Retrieves all posts for a specific user.
 *
 * @function getUserPosts
 * @param {number} userId - The ID of the user whose posts are to be fetched.
 * @returns {Promise<Object[]>} A promise that resolves to an array of the user's posts, each with a signed image URL.
 */
export const getUserPosts = async (userId) => {
	try {
		let userPosts = await db
			.select({
				id: posts.id,
				imageUrl: posts.image_url,
				caption: posts.caption,
				likes: posts.likes,
				userId: posts.user_id,
				username: users.username,
			})
			.from(posts)
			.where(eq(users.id, userId))
			.innerJoin(users, eq(posts.user_id, users.id))
			.orderBy(sql`${posts.created_at} DESC`)
			.limit(30);

		// Replace image_url with signed image URL
		for (let post of userPosts) {
			const command = new GetObjectCommand({
				Bucket: S3_BUCKET_NAME,
				Key: post.imageUrl,
			});

			const s3SignedImageUrl = await getSignedUrl(s3, command, {
				expiresIn: 3600,
			});

			post.imageUrl = s3SignedImageUrl;
		}

		return userPosts;
	} catch (error) {
		throw new ErrorResponse(500, "Failed to fetch user posts");
	}
};

/**
 * Retrieves all comments for a specific post.
 *
 * @function getPostComments
 * @param {string} postId - The ID of the post whose comments are to be fetched.
 * @returns {Promise<Object[]>} A promise that resolves to an array of comments for the post.
 */
export const getPostComments = async (postId) => {
	try {
		let postComments = await db
			.select({
				id: comments.id,
				content: comments.comment,
				userId: comments.user_id,
				username: users.username,
			})
			.from(comments)
			.where(eq(comments.post_id, postId))
			.innerJoin(users, eq(comments.user_id, users.id))
			.orderBy(sql`${comments.created_at} DESC`);

		return postComments;
	} catch (error) {
		throw new ErrorResponse(500, "Failed to fetch post comments");
	}
};

/**
 * Creates a new comment for a post.
 *
 * @function createCommentRecord
 * @param {Object} commentData - The data for the comment, including postId, userId, and content.
 * @returns {Promise<Object>} A promise that resolves to the ID of the created comment.
 */
export const createCommentRecord = async (commentData) => {
	try {
		const insertCommentResult = await db
			.insert(comments)
			.values(commentData)
			.$returningId();

		return insertCommentResult[0];
	} catch (error) {
		throw new ErrorResponse(500, "Failed to create comment");
	}
};

/**
 * Fetches a comment by its ID.
 *
 * @function getCommentFromId
 * @param {String} commentId - The ID of the comment to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the comment object.
 */
export const getCommentFromId = async (commentId) => {
	try {
		let commentResult = await db
			.select({
				id: comments.id,
				content: comments.comment,
				userId: comments.user_id,
			})
			.from(comments)
			.where(eq(comments.id, commentId))
			.limit(1);

		return commentResult[0];
	} catch (error) {
		throw new ErrorResponse(500, "Failed to fetch single comment");
	}
};

/**
 * Deletes a comment by its ID.
 *
 * @function deleteCommentFromId
 * @param {String} commentId - The ID of the comment to delete.
 */
export const deleteCommentFromId = async (commentId) => {
	try {
		await db.delete(comments).where(eq(comments.id, commentId));
	} catch (error) {
		throw new ErrorResponse(500, "Failed to delete comment");
	}
};

/**
 * Fetches the existing like for a given post by a user.
 *
 * @function getExistingLike
 * @param {String} userId - The ID of the user.
 * @param {String} postId - The ID of the post.
 * @returns {Promise<Object>} Returns the user's like on a post.
 */
export const getExistingLike = async (userId, postId) => {
	try {
		let postLike = await db
			.select({
				id: likes.id,
				postId: likes.post_id,
				userId: likes.user_id,
			})
			.from(likes)
			.where(and(eq(likes.post_id, postId), eq(likes.user_id, userId)))
			.limit(1);

		return postLike[0];
	} catch (error) {
		throw new ErrorResponse(500, "Failed to fetch existing likes");
	}
};

/**
 * Create a like record in the database.
 *
 * @function createLikeRecord
 * @param {Object} likeData - The data for the like (user ID and post ID).
 * @returns {Promise<Object>} Returns the like's ID when created.
 */
export const createLikeRecord = async (likeData) => {
	try {
		const insertLikeResult = await db
			.insert(likes)
			.values(likeData)
			.$returningId();

		await incrementLikeCount(likeData.post_id);

		return insertLikeResult[0];
	} catch (error) {
		throw new ErrorResponse(500, "Failed to create like");
	}
};

/**
 * Increment like count on a post by 1.
 *
 * @function incrementLikeCount
 * @param {String} postId - The ID of the post to increment the like count for.
 */
export const incrementLikeCount = async (postId) => {
	try {
		await db
			.update(posts)
			.set({
				likes: sql`${posts.likes} + 1`,
			})
			.where(eq(posts.id, postId));
	} catch (error) {
		throw new ErrorResponse(500, "Failed to increment like count on post");
	}
};

/**
 * Delete a like record from the database.
 *
 * @function deleteLikeRecord
 * @param {String} userId - The ID of the user who liked the post.
 * @param {String} postId - The ID of the post that was liked.
 */
export const deleteLikeRecord = async (userId, postId) => {
	try {
		await db
			.delete(likes)
			.where(and(eq(likes.user_id, userId), eq(likes.post_id, postId)));

		await decrementLikeCount(postId);
	} catch (error) {
		throw new ErrorResponse(500, "Failed to delete like");
	}
};

/**
 * Decrement like count on a post by 1.
 *
 * @function decrementLikeCount
 * @param {String} postId - The ID of the post whose like count should be decremented.
 */
export const decrementLikeCount = async (postId) => {
	try {
		await db
			.update(posts)
			.set({
				likes: sql`${posts.likes} - 1`,
			})
			.where(eq(posts.id, postId));
	} catch (error) {
		throw new ErrorResponse(500, "Failed to decrement like count on post");
	}
};

/**
 * Retrieves a post record from the database.
 *
 * @function getPostRecord
 * @param {String} postId - The ID of the post to fetch.
 * @returns {Promise<Object>} - Returns the post's ID, user ID, and image URL if found.
 */
export const getPostRecord = async (postId) => {
	try {
		const postRecord = await db
			.select({
				id: posts.id,
				userId: posts.user_id,
				imageUrl: posts.image_url,
			})
			.from(posts)
			.where(eq(posts.id, postId))
			.limit(1);

		return postRecord[0];
	} catch (error) {
		throw new ErrorResponse(500, "Failed to fetch post record");
	}
};

/**
 * Deletes a post record from the database and its associated image from S3.
 *
 * @function deletePostRecord
 * @param {Object} postRecord - The post record to be deleted, which contains post ID and image information.
 */
export const deletePostRecord = async (postRecord) => {
	try {
		const postRecordClone = postRecord;

		await db.delete(posts).where(eq(posts.id, postRecord.id));

		await deleteImageFromS3(postRecordClone);
	} catch (error) {
		throw new ErrorResponse(500, "Failed to delete post record");
	}
};

/**
 * Deletes an image from S3 storage based on the provided post record.
 *
 * @function deleteImageFromS3
 * @param {Object} postRecord - The post record that contains the image URL to be deleted.
 */
export const deleteImageFromS3 = async (postRecord) => {
	try {
		// Delete Logic
		const command = new DeleteObjectCommand({
			Bucket: S3_BUCKET_NAME,
			Key: postRecord.imageUrl,
		});

		await s3.send(command);
	} catch (error) {
		throw new ErrorResponse(500, "Failed to delete image from S3");
	}
};
