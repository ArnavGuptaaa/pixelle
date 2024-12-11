// ShadCN
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Components
import CommentSubMenu from "./CommentSubMenu";

// Hooks
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Comment = ({ comment, setComments }) => {
	const navigate = useNavigate();
	const { user } = useAuth();

	const handleCommentClick = () => {
		navigate(`/users/${comment.userId}`);
	};

	return (
		<div className="border-b pb-1 mb-2">
			{/* user info */}
			<div className="flex items-center justify-start mb-2 cursor-pointer">
				<Avatar className="w-6 h-6 md:w-9 md:h-9">
					<AvatarImage src={user.profileImage} />
					<AvatarFallback>
						{comment.username[0]?.toUpperCase()}
					</AvatarFallback>
				</Avatar>

				<h2
					className="ml-2 font-bold text-sm hover:underline "
					onClick={handleCommentClick}
				>
					@{comment.username}
				</h2>

				{/* Sub menu visible to autor of comment only */}
				{user && user.id === comment.userId && (
					<div className="ml-auto">
						<CommentSubMenu
							commentId={comment.id}
							setComments={setComments}
						/>
					</div>
				)}
			</div>

			{/* comment */}
			<div>{comment.content}</div>
		</div>
	);
};

export default Comment;
