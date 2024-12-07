import ErrorResponse from "../utils/ErrorResponse.js";
import {
	uploadImageToS3,
	createPostRecord,
	getWanderPosts,
	getSinglePost,
	getUserPosts,
	getPostComments,
	createCommentRecord,
	createLikeRecord,
	getExistingLike,
	deleteLikeRecord,
	getPostRecord,
	deletePostRecord,
	getCommentFromId,
	deleteCommentFromId,
	getFeedPosts,
} from "../services/posts.js";
import {
	doesFollowExist,
	createFollowRecord,
	deleteFollowRecord,
	getUser,
	getUserSearchResults,
} from "../services/users.js";

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

export const fetchWanderPosts = async (req, res, next) => {
	try {
		// This route is expected to have query param : page
		// converting that to 0 index'ed page
		const page =
			req.query.page && req.query.page > 0 ? req.query.page - 1 : 0;
		const offset = page * 30;

		// fetch all posts sorted descending limit 30
		const wanderPosts = await getWanderPosts(offset);

		// return posts
		return res.status(200).json({
			success: true,
			posts: wanderPosts,
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
		const feedPosts = await getFeedPosts(offset, req.user.id);

		// return posts
		return res.status(200).json({
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

		post.isLiked = !!existingLike;

		// Fetch comments for the respective post
		const comments = await getPostComments(req.params.id);

		// return posts
		return res.status(200).json({
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

		// Return error if user does NOT exist
		if (!userData) {
			return res.status(404).json({
				success: false,
				message: "User does not exist",
			});
		}

		// Fetch Post for given user
		const profilePosts = await getUserPosts(req.params.userId);

		// TODO: Set boolean if logged in user follows requested User
		const isFollowed = await doesFollowExist(
			req.user.id,
			req.params.userId
		);

		return res.status(200).json({
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

		return res.status(200).json({
			success: true,
			message: "Comment posted successfully",
			commentId: createdComment.id,
		});
	} catch (error) {
		next(error);
	}
};

export const deleteComment = async (req, res, next) => {
	try {
		// Check if comment exists
		const commentRecord = await getCommentFromId(req.body.commentId);

		// If it does not, then return success
		if (!commentRecord) {
			return res.status(200).json({
				success: true,
				message: "Comment deleted successfully",
			});
		}

		// Check if user issuing delete is the author of comment
		if (req.user.id !== commentRecord.userId) {
			return res.status(400).json({
				success: true,
				message:
					"Comment does not belong to user attempting to delete it",
			});
		}

		// If it does, then delete comment from DB
		await deleteCommentFromId(req.body.commentId);

		// return success response
		return res.status(200).json({
			success: true,
			message: "Comment deleted successfully",
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

		return res.status(200).json({
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

		return res.status(200).json({
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
		// console.log(req.body.postId);

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
		// console.log(req.body.postId);

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

export const deleteSinglePost = async (req, res, next) => {
	try {
		// This route expects postId in request parameters
		// console.log(req.params.id);

		// check if post exists
		const postRecord = await getPostRecord(req.params.id);

		// If not, then return Error
		if (!postRecord) {
			throw new ErrorResponse(400, "Post doesn't exist");
		}

		// if post exists, check if the author of post is same as the person trying to delete it
		if (postRecord.userId !== req.user.id) {
			throw new ErrorResponse(
				400,
				"Post does not belong to user attempting to delete it"
			);
		}

		// if yes, then proceeed to delete
		await deletePostRecord(postRecord);

		// return success
		return res.status(200).json({
			success: true,
			message: "Post deleted",
		});
	} catch (error) {
		next(error);
	}
};

export const fetchUserSearchResults = async (req, res, next) => {
	try {
		// This route expects a query parameter
		// console.log(req.query.q);

		// Get all users search results
		const userSearchResults = await getUserSearchResults(req.query.q);

		return res.status(200).json({
			success: true,
			results: userSearchResults,
		});
	} catch (error) {
		next(error);
	}
};
