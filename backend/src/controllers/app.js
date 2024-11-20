import ErrorResponse from "../utils/ErrorResponse.js";
import {
	uploadImageToS3,
	createPostRecord,
	getFeedPosts,
	getSinglePost,
	getUserPosts,
	getPostComments,
	createCommentRecord,
	createLikeRecord,
	getExistingLike,
	deleteLikeRecord,
} from "../services/posts.js";
import {
	doesFollowExist,
	createFollowRecord,
	deleteFollowRecord,
	getUser,
	incrementFollowCount,
	decrementFollowCount,
} from "../services/users.js";
import { longtext } from "drizzle-orm/mysql-core";

export const createPost = async (req, res, next) => {
	try {
		const imageFile = req.file;

		// Upload image to S3
		const imageName = await uploadImageToS3(imageFile);

		// create post object
		const newPost = {
			image_url: imageName,
			caption: req.body.caption,
			user_id: req.user.id,
			likes: 0,
		};

		//Post to DB
		const createdPost = await createPostRecord(newPost);

		return res.status(200).json({
			success: true,
			message: "Post created successfully",
		});
	} catch (error) {
		next(error);
	}
};

export const fetchFeedPosts = async (req, res, next) => {
	try {
		// This route is expected to have query param : page
		// converting that to 0 index'ed page
		const page =
			req.query.page && req.query.page > 0 ? req.query.page - 1 : 0;
		const offset = page * 30;

		// fetch all posts sorted descending limit 30
		const feedPosts = await getFeedPosts(offset);

		// return posts
		res.status(200).json({
			success: true,
			posts: feedPosts,
		});
	} catch (error) {
		next(error);
	}
};

export const fetchSinglePost = async (req, res, next) => {
	try {
		// This route is expected to have request param
		// converting that to 0 index'ed page
		// console.log(req.params.id);

		// fetch single posts
		let post = await getSinglePost(req.params.id);

		// Check if post is liked by the given user
		const existingLike = await getExistingLike(req.user.id, req.params.id);
		console.log(existingLike);
		console.log(!!existingLike);

		post.isLiked = !!existingLike;

		// Fetch comments for the respective post
		const comments = await getPostComments(req.params.id);

		// return posts
		res.status(200).json({
			success: true,
			post,
			comments,
		});
	} catch (error) {
		next(error);
	}
};

export const fetchUserProfile = async (req, res, next) => {
	// TODO: Integrate infinite scroll with offset
	try {
		// This route is expected to have request param
		// console.log(req.params.userId);

		// Fetch user from ID
		let userData = await getUser(req.params.userId);

		// Fetch Post for given user
		const profilePosts = await getUserPosts(req.params.userId);

		// TODO: Set boolean if logged in user follows requested User
		const isFollowed = await doesFollowExist(
			req.user.id,
			req.params.userId
		);
		res.status(200).json({
			success: true,
			user: userData,
			posts: profilePosts,
			isFollowed,
		});
	} catch (error) {
		next(error);
	}
};

export const postComment = async (req, res, next) => {
	try {
		// TODO: check existence of post before commenting?

		// create comment object
		const commentData = {
			post_id: req.body.postId,
			comment: req.body.content,
			user_id: req.user.id,
		};

		// create a comment record
		const createdComment = await createCommentRecord(commentData);

		res.status(200).json({
			success: true,
			message: "Comment posted successfully",
		});
	} catch (error) {
		next(error);
	}
};

export const followUser = async (req, res, next) => {
	try {
		// This route expects ID of the user being followed, in body
		// console.log(req.body.followingId);

		// Check if user is not following themselves
		if (req.body.followingId === req.user.id) {
			throw new ErrorResponse(400, "User cannot follow ownself");
		}

		// Check if a similar follow already exists
		if (await doesFollowExist(req.user.id, req.body.followingId)) {
			throw new ErrorResponse(
				400,
				"User cannot follow already followed user"
			);
		}

		const followerData = {
			follower_user_id: req.user.id,
			following_user_id: req.body.followingId,
		};

		// If not, then create a follow record in DB
		const followRecord = await createFollowRecord(followerData);

		res.status(200).json({
			success: true,
			message: "User followed",
		});
	} catch (error) {
		next(error);
	}
};

export const unfollowUser = async (req, res, next) => {
	try {
		// This route expects ID of the user being followed, in body
		// console.log(req.body.followingId);

		// If follow doesnt exist, return success
		if (!(await doesFollowExist(req.user.id, req.body.followingId))) {
			return res.status(200).json({
				success: true,
				message: "User unfollowed",
			});
		}

		await deleteFollowRecord(req.user.id, req.body.followingId);

		res.status(200).json({
			success: true,
			message: "User unfollowed",
		});
	} catch (error) {
		next(error);
	}
};

export const likePost = async (req, res, next) => {
	try {
		// This route expects a postId
		console.log(req.body.postId);

		// check if like already exists exists
		const existingLike = await getExistingLike(
			req.user.id,
			req.body.postId
		);

		// If it does, return error
		if (existingLike)
			throw new ErrorResponse(
				500,
				"Cannot like a post which is already liked"
			);

		// Else, create a like record
		const likeRecord = {
			user_id: req.user.id,
			post_id: req.body.postId,
		};

		// Post it to DB
		await createLikeRecord(likeRecord);

		return res.status(200).json({
			success: true,
			message: "Post Liked",
		});
	} catch (error) {
		console.log(error);

		next(error);
	}
};

export const unlikePost = async (req, res, next) => {
	try {
		// This route expects a postId
		console.log(req.body.postId);

		// check if like already exists exists
		const existingLike = await getExistingLike(
			req.user.id,
			req.body.postId
		);

		// If it does not exist, then return success
		if (!existingLike)
			return res.status(200).json({
				success: true,
				message: "Post unliked",
			});

		// Else, delete record
		await deleteLikeRecord(req.user.id, req.body.postId);

		// return success
		return res.status(200).json({
			success: true,
			message: "Post unliked",
		});
	} catch (error) {
		next(error);
	}
};
