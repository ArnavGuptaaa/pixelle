// Custom rrror
import ErrorResponse from "../utils/ErrorResponse.js";
import dotenv from "dotenv";
import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../config/s3.js";
import bcrypt from "bcrypt";

import db from "../db/index.js";
import { comments, likes, posts, users } from "../db/schema.js";
import { and, eq, sql } from "drizzle-orm";

// Load environment variables
dotenv.config({ path: "./src/config/.env" });

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
/**
 * Upload an image to S3
 *
 * @function uploadImageToS3
 * @param {File} image
 * @returns {String}
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
		console.log(error);

		throw new ErrorResponse(500, "Failed to upload to S3");
	}
};

/**
 * Create a new post in database
 *
 * @function createPostRecord
 * @param {Object} postData
 * @returns {Promise<Object>} returns post id if created
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
 * Get all posts for feed from DB
 *
 * @function getFeedPosts
 * @param {Object} offset
 * @returns {Promise<Object>} returns posts from DB
 */
export const getFeedPosts = async (offset) => {
	try {
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
			.orderBy(sql`${posts.created_at} DESC`)
			.offset(offset)
			.limit(30);

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
		console.log(error);

		throw new ErrorResponse(500, "Failed to fetch feed posts");
	}
};

/**
 * Get single post matching the postId
 *
 * @function getSinglePost
 * @param {Object} postId post ID to fetch
 * @returns {Promise<Object>}
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
		console.log(error);

		throw new ErrorResponse(500, "Failed to fetch feed posts");
	}
};

/**
 * Get all posts for a specific user
 *
 * @function getUserPosts
 * @param {Object} userId
 * @returns {Promise<Object>} returns user's posts
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
		console.log(error);

		throw new ErrorResponse(500, "Failed to fetch feed posts");
	}
};

/**
 * Get all comments for a specific post
 *
 * @function getPostComments
 * @param {String} postId
 * @returns {Promise<Object>} returns post's comments
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
		console.log(error);

		throw new ErrorResponse(500, "Failed to fetch post comments");
	}
};

/**
 * Create a comment
 *
 * @function createCommentRecord
 * @param {String} postId
 * @returns {Promise<Object>} returns comment's ID when created
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
 * Get comment from a specific ID
 *
 * @function getCommentFromId
 * @param {String} commentId
 * @returns {Promise<Object>} returns comment
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
		console.log(error);

		throw new ErrorResponse(500, "Failed to fetch single comment");
	}
};

/**
 * Delete comment of a given ID
 *
 * @function deleteComment
 * @param {String} commentId
 */
export const deleteCommentFromId = async (commentId) => {
	try {
		await db.delete(comments).where(eq(comments.id, commentId));
	} catch (error) {
		console.log(error);

		throw new ErrorResponse(500, "Failed to delete comment");
	}
};

/**
 * Fetches existing like for a given post by a user
 *
 * @function getExistingLike
 * @param {String} userId
 * @param {String} postId
 * @returns {Promise<Object>} returns user's like on a post
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
		console.log(error);

		throw new ErrorResponse(500, "Failed to fetch existing likes");
	}
};

/**
 * Create a like record in DB
 *
 * @function createLikeRecord
 * @param {Object} likeData
 * @returns {Promise<Object>} returns like's ID when created
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
		console.log(error);

		throw new ErrorResponse(500, "Failed to create like");
	}
};

/**
 * increment like count on post by 1
 *
 * @function incrementLikeCount
 * @param {String} postId
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
		console.log(error);

		throw new ErrorResponse(500, "Failed to increment like count on post");
	}
};

/**
 * Delete a like record in DB
 *
 * @function deleteLikeRecord
 * @param {String} userId
 * @param {String} postId
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
 * decrement like count on post by 1
 *
 * @function decrementLikeCount
 * @param {String} postId
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
 * Gets post record from DB
 *
 * @function getPostRecord
 * @param {String} postId
 * @returns {Promise<Object>} return post_id and user_id of post, if found
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
 * Delete post record from DB and Image From S3
 *
 * @function deletePostRecord
 * @param {Object} postRecord
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
 * delete image from S3
 *
 * @function deleteImageFromS3
 * @param {Promise<Object>} postRecord
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
