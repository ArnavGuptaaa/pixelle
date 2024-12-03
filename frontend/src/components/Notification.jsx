import { Heart, MessageSquareMore } from "lucide-react";
import { NavLink } from "react-router-dom";

const Notification = ({ notification }) => {
	return (
		<div className="flex items-center p-2 mb-2">
			{notification.type === "like" ? <Heart /> : <MessageSquareMore />}
			<p className="ml-3">
				<NavLink
					to={`/users/${notification.actingUserId}`}
					className="font-bold"
				>
					@{notification.actingUsername}
				</NavLink>
				&nbsp;
				{notification.type === "like" ? "liked" : "commented on "}
				your &nbsp;
				<NavLink
					to={`/posts/${notification.postId}`}
					className="font-bold"
				>
					post
				</NavLink>
			</p>
		</div>
	);
};

export default Notification;
