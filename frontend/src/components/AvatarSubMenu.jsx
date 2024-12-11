// Shadcn
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Components
import NotificationFeed from "./NotificationFeed";

// Icons
import { LogOut, User, Moon, Sun, Heart } from "lucide-react";

// Hooks
import { useTheme } from "@/Context/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";

// Other Imports
import { NavLink } from "react-router-dom";

const AvatarSubMenu = () => {
	const { user, logout } = useAuth();

	const { theme, setTheme } = useTheme();

	const handleThemeChange = () => {
		if (theme === "light") {
			setTheme("dark");

			return;
		}

		setTheme("light");
	};

	const handleLogout = () => {
		logout();
	};

	return (
		<div className="flex items-center">
			{/* Notification Feed Dropdown */}
			<DropdownMenu>
				<DropdownMenuTrigger className="mr-5">
					<Heart size={25} />
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<NotificationFeed />
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Avatar Dropdown */}
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Avatar className="cursor-pointer">
						<AvatarImage src={user?.profileImage} />
						<AvatarFallback>
							{user?.username[0].toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<NavLink to={`/users/${user?.id}`}>
						<DropdownMenuItem>
							<User className="inline-block mr-2 h-4 w-4" />
							Profile
						</DropdownMenuItem>
					</NavLink>
					<DropdownMenuItem onClick={handleThemeChange}>
						{theme === "light" ? (
							<Sun className="inline-block mr-2 h-4 w-4" />
						) : (
							<Moon className="inline-block mr-2 h-4 w-4" />
						)}
						Switch Theme
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={handleLogout}>
						<LogOut className="inline-block mr-2 h-4 w-4" />
						Logout
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default AvatarSubMenu;
