// Components
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/utils/ProtectedRoute";

// Other Imports
import { Outlet } from "react-router-dom";

const AppLayout = () => {
	return (
		<ProtectedRoute>
			<div className="">
				<Navbar />

				<main className="mt-16 md:mt-20">
					<Outlet />
				</main>
			</div>
		</ProtectedRoute>
	);
};

export default AppLayout;
