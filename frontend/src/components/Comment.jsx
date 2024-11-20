import { useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Comment = ({ comment }) => {
	const navigate = useNavigate();

	const handleCommentClick = () => {
		navigate(`/users/${comment.userId}`);
	};
	return (
		<div className="border-b pb-1 mb-2">
			{/* user info */}
			<div
				className="flex items-center justify-start mb-2 cursor-pointer"
				onClick={handleCommentClick}
			>
				<Avatar className="w-6 h-6 md:w-9 md:h-9">
					{/* TODO: Handle profile image url */}
					<AvatarImage src="test" />
					<AvatarFallback>
						{comment.username[0]?.toUpperCase()}
					</AvatarFallback>
				</Avatar>

				<h2 className="ml-2 font-bold text-sm hover:underline ">
					@{comment.username}
				</h2>
			</div>

			{/* comment */}
			<div>{comment.content}</div>
		</div>
	);
};

export default Comment;
