// Icons
import { RouteOff } from "lucide-react";

// Other Imports
import { Link } from "react-router-dom";

const NotFound = () => {
	return (
		<main className="flex items-center justify-center place-items-center h-screen">
			<div className="flex-col justify-center items-center text-center">
				<div className="flex flex-row items-center mb-5">
					<RouteOff className="animate-bounce" />

					<h2 className="text-sm ml-2 md:text-2xl md:ml-5">
						Whoops! We Can&apos;t Seem to Find This Page
					</h2>
				</div>

				<Link to={"/"} replace className="underline cursor-pointer">
					Return Home
				</Link>
			</div>
		</main>
	);
};

export default NotFound;
