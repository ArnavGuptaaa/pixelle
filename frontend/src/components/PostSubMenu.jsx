import { EllipsisVertical, Trash2 } from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { deletePost } from "@/services/AppService";
import { useNavigate } from "react-router-dom";

const PostSubMenu = ({ postId }) => {
	const navigate = useNavigate();

	const handleDelete = async () => {
		try {
			await deletePost(postId);

			navigate(-1, { replace: true });
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Button
					variant="outline"
					size="icon"
					onClick={(e) => e.preventDefault()}
				>
					<EllipsisVertical />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>Post Options</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleDelete}>
					<Trash2 className="inline-block mr-2 h-4 w-4" />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default PostSubMenu;
