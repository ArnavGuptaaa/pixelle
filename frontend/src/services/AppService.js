import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createPostService = async (formData) => {
	const CREATE_POST_URL = `${BASE_URL}/app/create`;
	const requestOptions = {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	};

	try {
		const response = await axios.post(
			CREATE_POST_URL,
			formData,
			requestOptions
		);

		return response.data;
	} catch (error) {
		throw new Error(
			error.response?.data?.errors[0].message || "Post creation failed"
		);
	}
};

export const postComment = async (commentData) => {
	const POST_COMMENT_URL = `${BASE_URL}/app/comment`;

	try {
		const response = await axios.post(POST_COMMENT_URL, commentData);

		return response.data;
	} catch (error) {
		throw new Error(
			error.response?.data?.message || "Failed to post comment"
		);
	}
};

export const followUser = async (commentData) => {
	const FOLLOW_URL = `${BASE_URL}/app/follow`;

	try {
		const response = await axios.post(FOLLOW_URL, commentData);

		return response.data;
	} catch (error) {
		throw new Error(
			error.response?.data?.message || "Failed to follow profile"
		);
	}
};

export const unFollowUser = async (commentData) => {
	const UNFOLLOW_URL = `${BASE_URL}/app/follow`;

	const requestOptions = {
		data: commentData,
	};

	try {
		const response = await axios.delete(UNFOLLOW_URL, requestOptions);

		return response.data;
	} catch (error) {
		throw new Error(
			error.response?.data?.message || "Failed to unfollow user"
		);
	}
};

export const likePost = async (likeData) => {
	const LIKE_URL = `${BASE_URL}/app/like`;

	try {
		const response = await axios.post(LIKE_URL, likeData);

		return response.data;
	} catch (error) {
		throw new Error(error.response?.data?.message || "Failed to like post");
	}
};

export const unlikePost = async (likeData) => {
	const UNLIKE_URL = `${BASE_URL}/app/like`;

	const requestOptions = {
		data: likeData,
	};

	try {
		const response = await axios.delete(UNLIKE_URL, requestOptions);

		return response.data;
	} catch (error) {
		throw new Error(
			error.response?.data?.message || "Failed to unlike post"
		);
	}
};

export const deletePost = async (postId) => {
	const DELETE_POST_URL = `${BASE_URL}/app/posts/${postId}`;

	try {
		const response = await axios.delete(DELETE_POST_URL);

		return response.data;
	} catch (error) {
		throw new Error(
			error.response?.data?.message || "Failed to delete post"
		);
	}
};

export const deleteComment = async (commentData) => {
	const DELETE_COMMENT_URL = `${BASE_URL}/app/comment/`;

	const requestOptions = {
		data: commentData,
	};

	try {
		const response = await axios.delete(DELETE_COMMENT_URL, requestOptions);

		return response.data;
	} catch (error) {
		throw new Error(
			error.response?.data?.message || "Failed to delete comment"
		);
	}
};

export const getSearchResults = async (searchText) => {
	const SEARCH_USERS_URL = `${BASE_URL}/app/search?q=${encodeURIComponent(
		searchText
	)}`;

	try {
		const response = await axios.get(SEARCH_USERS_URL);

		return response.data;
	} catch (error) {
		throw new Error(
			error.response?.data?.message || "Failed to fetch search results"
		);
	}
};
