// ShadCN
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetClose,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";

// Components
import AvatarSubMenu from "./AvatarSubMenu";

// Icons
import { Menu, CirclePlus, Search, House, Compass } from "lucide-react";

// Other Imports
import { NavLink } from "react-router-dom";

const Navbar = () => {
	const NAVBAR_ICON_SIZE = 15;

	const handleSheetClose = () => {
		const closeButton = document.querySelector("#sheet-close");

		closeButton.click();
	};

	return (
		<nav className="flex items-center justify-between border border-b-1 px-5 py-2 fixed top-0 w-full bg-background z-50">
			{/* Hamburger menu for smaller screens */}
			<Sheet className="md:hidden">
				<SheetTrigger asChild className="md:hidden">
					<Menu />
				</SheetTrigger>
				<SheetContent
					side={"left"}
					className="flex flex-col justify-start items-left mt-5"
					onClick={handleSheetClose}
				>
					<NavLink to={"/"} className="flex items-center">
						<House className="mr-2" size={NAVBAR_ICON_SIZE} />
						Home
					</NavLink>
					<NavLink to={"/wander"} className="flex items-center">
						<Compass className="mr-2" size={NAVBAR_ICON_SIZE} />
						Wander
					</NavLink>
					<NavLink to={"/posts/create"} className="flex items-center">
						<CirclePlus className="mr-2" size={NAVBAR_ICON_SIZE} />
						Create Post
					</NavLink>
					<NavLink to={"/search"} className="flex items-center">
						<Search className="mr-2" size={NAVBAR_ICON_SIZE} />
						Search Users
					</NavLink>
				</SheetContent>
				{/* Hidden button which will be programatically clicked to close sheet */}
				<SheetClose className="hidden" asChild>
					<Button id="sheet-close">Close Sheet</Button>
				</SheetClose>
			</Sheet>

			<div className="hidden md:block">
				<NavLink to={"/"}>
					<img className="w-12" src="/favicon.ico" alt="" />
				</NavLink>
			</div>
			{/* Nav Links */}
			<div className="hidden items-center gap-5 md:flex w-2/5 max-w-xs justify-around">
				<NavLink
					to={"/"}
					className="flex items-center hover:bg-muted transition-all duration-150 ease-in-out p-3 rounded-sm"
				>
					<House className="mr-2" size={NAVBAR_ICON_SIZE} />
					Home
				</NavLink>
				<NavLink
					to={"/wander"}
					className="flex items-center hover:bg-muted transition-all duration-150 ease-in-out p-3 rounded-sm"
				>
					<Compass className="mr-2" size={NAVBAR_ICON_SIZE} />
					Wander
				</NavLink>
				<NavLink
					to={"/posts/create"}
					className="flex items-center hover:bg-muted transition-all duration-150 ease-in-out p-3 rounded-sm"
				>
					<CirclePlus className="mr-2" size={NAVBAR_ICON_SIZE} />
					Create
				</NavLink>
				<NavLink
					to={"/search"}
					className="flex items-center hover:bg-muted transition-all duration-150 ease-in-out p-3 rounded-sm"
				>
					<Search className="mr-2" size={NAVBAR_ICON_SIZE} />
					Search
				</NavLink>
			</div>

			{/* Avatar and profile submenu */}
			<AvatarSubMenu />
		</nav>
	);
};

export default Navbar;
