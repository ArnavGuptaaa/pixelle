// ShadCN
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Icons
import { EllipsisVertical, Trash2 } from "lucide-react";

// Hooks
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Services
import { deletePost } from "@/services/AppService";

// Other Imports
import { cn } from "@/lib/utils";

const PostSubMenu = ({ postId }) => {
	const navigate = useNavigate();
	const { toast } = useToast();

	const handleDelete = async () => {
		try {
			await deletePost(postId);

			toast({
				className: cn("hidden md:block"),
				variant: "success",
				title: "Post Deleted",
			});

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
