// ShadCN
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Components
import PostSubMenu from "./PostSubMenu";

// Icons
import { Heart } from "lucide-react";

// Hooks
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";

// Services
import { likePost, unlikePost } from "@/services/AppService";

const ImageCard = ({ post }) => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [isLiked, setIsLiked] = useState(post.isLiked);
	const [likeCount, setLikeCount] = useState(post.likes);

	const { sendLikeNotification } = useNotifications();

	const handleLike = async () => {
		const likePayload = {
			postId: post.id,
		};

		try {
			if (isLiked) {
				// if already liked, then we will unlike

				setLikeCount((prevData) => prevData - 1);
				await unlikePost(likePayload);
			} else {
				// Else like the post

				setLikeCount((prevData) => prevData + 1);
				await likePost(likePayload);

				// Send like notification event
				sendLikeNotification(
					user.id,
					user.username,
					post.id,
					post.userId
				);
			}
		} catch (error) {
			console.log(error);
		}

		setIsLiked((prevData) => !prevData);
	};
	return (
		<div className="">
			<div className="flex items-center justify-start mb-2">
				<Avatar className="w-6 h-6 md:w-12 md:h-12">
					<AvatarImage src={user.profileImage} />
					<AvatarFallback>
						{user?.username[0].toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<h2
					className="ml-2 font-bold hover:underline cursor-pointer"
					onClick={() => navigate(`/users/${post.userId}`)}
				>
					@{post.username}
				</h2>

				{/* Sub menu visible only to the author of given post */}
				{user && user.id === post.userId && (
					<div className="ml-auto">
						<PostSubMenu postId={post.id} />
					</div>
				)}
			</div>
			<div className="">
				<img src={post.imageUrl} alt="test" className="w-full" />
			</div>
			<div className="flex mt-2 mb-5">
				<div className="flex-1">{post.caption}</div>
				<div
					className="flex hover:text-destructive cursor-pointer"
					onClick={handleLike}
				>
					{isLiked ? (
						<Heart fill="red" className="border-destructive" />
					) : (
						<Heart />
					)}

					<span className="ml-2">{likeCount}</span>
				</div>
			</div>
		</div>
	);
};

export default ImageCard;
