// ShadCN
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Hooks
import { useNavigate } from "react-router-dom";

const FeedCard = ({ post }) => {
	let navigate = useNavigate();

	const handleClick = () => {
		navigate(`/posts/${post.id}`, { state: post });
	};

	return (
		<>
			<Card
				className="rounded-xl overflow-hidden relative hover:scale-105 ease-in-out transition duration-300 mb-3 cursor-pointer group border"
				onClick={handleClick}
			>
				<div className="group-hover:opacity-100 opacity-0 flex absolute top-2 left-2 items-center justify-center ease-in-out transition duration-300">
					<Avatar className="w-6 h-6 md:w-10 md:h-10">
						{/* TODO: UPDATE THIS */}
						<AvatarImage src={"test"} />
						<AvatarFallback>
							{post.username[0].toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<span className="text-sm md:text-md ml-2">
						@{post.username}
					</span>
				</div>

				<CardContent className="p-0">
					<img
						src={post.imageUrl}
						className="object-contain w-full h-auto"
						loading="lazy"
					/>
				</CardContent>
			</Card>
		</>
	);
};

export default FeedCard;
