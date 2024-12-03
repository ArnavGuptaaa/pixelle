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
import { deleteComment } from "@/services/AppService";

const CommentSubMenu = ({ commentId, setComments }) => {
	const handleDelete = async (e) => {
		try {
			// Prevent Navigation
			e.stopPropagation();

			const deleteCommentPayload = {
				commentId,
			};

			await deleteComment(deleteCommentPayload);

			// Optimistic Local Updates
			setComments((prevData) =>
				prevData.filter((comment) => comment.id !== commentId)
			);
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="border-0"
					onClick={(e) => e.preventDefault()}
				>
					<EllipsisVertical />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>Comment Options</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleDelete}>
					<Trash2 className="inline-block mr-2 h-4 w-4" />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default CommentSubMenu;
