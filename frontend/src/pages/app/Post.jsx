// ShadCN
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Components
import Comment from "@/components/Comment";
import ImageCard from "@/components/ImageCard";

// Icons
import { SendHorizontal } from "lucide-react";

// Hooks
import useFetch from "@/hooks/useFetch";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";

// Services
import { postComment } from "@/services/AppService";

const Post = () => {
	const { postId } = useParams();
	const { state: postFromProps } = useLocation();

	// get Post from props : postFromProps
	const [post, setPost] = useState();
	const [comments, setComments] = useState([]);
	const [commentContent, setCommentContent] = useState("");

	const { user } = useAuth();
	const { sendCommentNotification } = useNotifications();

	const [data, error, isLoading] = useFetch(
		`/app/posts/${postId}`,
		{},
		[postId],
		"Failed to fetch posts"
	);

	useEffect(() => {
		document.body.scrollTop = document.documentElement.scrollTop = 0;

		setPost(data?.post);
		setComments(data?.comments);
	}, [data]);

	const handleCommentSubmit = async () => {
		const trimmedComment = commentContent.trim();

		// Basic Validations
		if (trimmedComment === null || trimmedComment === "") {
			return;
		}

		const commentPayload = {
			postId,
			content: trimmedComment,
		};

		try {
			const response = await postComment(commentPayload);

			const localComment = {
				id: response.commentId,
				userId: user?.id,
				username: user?.username,
				content: trimmedComment,
			};

			// Optimistic update for comments
			setComments((prevData) => {
				return [localComment, ...prevData];
			});

			// Send comment notification event
			sendCommentNotification(
				user.id,
				user.username,
				post.id,
				post.userId
			);
		} catch (error) {
			console.log(error);
		}

		// if successfully posted, clear comment value
		setCommentContent("");
	};

	return post ? (
		<div className="flex-col-reverse md:flex md:flex-row justify-evenly items-start w-5/6 mx-auto h-screen">
			{/* POST VIEW */}
			<div className="md:w-1/2">
				<ImageCard post={post} />
			</div>

			{/* COMMENTS */}
			<div className="md:w-1/2 md:ml-5 h-full">
				<div className="mb-2">
					<h2 className="text-xl font-bold">Comments</h2>
				</div>
				<div className="overflow-scroll h-screen">
					{comments &&
						comments.map((comment) => (
							<Comment
								comment={comment}
								setComments={setComments}
								key={comment.id}
							/>
						))}
				</div>
				<div className="sticky bottom-5 flex w-full items-center space-x-2">
					<Input
						type="text"
						placeholder="Comment on this post"
						value={commentContent}
						onChange={(e) => setCommentContent(e.target.value)}
					/>
					<Button onClick={handleCommentSubmit}>
						<SendHorizontal />
					</Button>
				</div>
			</div>
		</div>
	) : (
		<div>Couldnt Load Data for post {postId}</div>
	);
};

export default Post;
