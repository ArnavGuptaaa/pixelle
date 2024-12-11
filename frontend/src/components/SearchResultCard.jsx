// ShadCN
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Icons
import { Users } from "lucide-react";

// Hooks
import { useNavigate } from "react-router-dom";

const SearchResultCard = ({ user }) => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(`/users/${user.id}`);
	};

	return (
		<div
			className="flex items-center justify-between p-2 border rounded-md mb-2 cursor-pointer hover:scale-105 transition-all ease-in-out duration-300"
			onClick={handleClick}
		>
			<div className="flex items-center">
				<Avatar className="cursor-pointer">
					<AvatarImage src={user.profileImage} />
					<AvatarFallback>
						{user.username[0].toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<p className="ml-3">@{user.username}</p>
			</div>
			<div className="flex items-center text-muted-foreground">
				<Users className="mr-2" size={20} />
				{user.followers}
			</div>
		</div>
	);
};

export default SearchResultCard;
