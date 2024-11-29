import express from "express";
import multer from "multer";

// Middlewares
import isAuthenticated from "../middlewares/isAuthenicated.js";

import {
	validateCreateRequest,
	validateCommentRequest,
	validateDeleteCommentRequest,
	validateFollowRequest,
	validateLikeRequest,
} from "../middlewares/requestValidators.js";

// Controller
import {
	createPost,
	fetchFeedPosts,
	fetchSinglePost,
	fetchUserProfile,
	postComment,
	followUser,
	unfollowUser,
	likePost,
	unlikePost,
	deleteSinglePost,
	deleteComment,
} from "../controllers/app.js";

const appRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

appRouter.post(
	"/create",
	isAuthenticated,
	upload.single("image"),
	validateCreateRequest,
	createPost
);

appRouter.get("/users/:userId", isAuthenticated, fetchUserProfile);

appRouter.get("/feed", isAuthenticated, fetchFeedPosts);

appRouter
	.route("/posts/:id")
	.get(isAuthenticated, fetchSinglePost)
	.delete(isAuthenticated, deleteSinglePost);

appRouter
	.route("/comment")
	.post(isAuthenticated, validateCommentRequest, postComment)
	.delete(isAuthenticated, validateDeleteCommentRequest, deleteComment);

appRouter
	.route("/follow")
	.post(isAuthenticated, validateFollowRequest, followUser)
	.delete(isAuthenticated, validateFollowRequest, unfollowUser);

appRouter
	.route("/like")
	.post(isAuthenticated, validateLikeRequest, likePost)
	.delete(isAuthenticated, validateLikeRequest, unlikePost);

export default appRouter;
