import { NavLink } from "react-router-dom";

// Shadcn
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Icons
import { LogOut, User, Moon, Sun } from "lucide-react";

// Theme Toggle
import { useTheme } from "@/Context/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";

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
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar className="cursor-pointer">
					<AvatarImage src={"test"} />
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
	);
};

export default AvatarSubMenu;
