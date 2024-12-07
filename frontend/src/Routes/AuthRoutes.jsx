// Pages
import Login from "@/pages/auth/Login";
import NotFound from "@/pages/NotFound";
import Register from "@/pages/auth/Register";

// Other Imports
import { Navigate, Routes, Route } from "react-router-dom";
import AuthRouteUserCheck from "@/utils/AuthRouteUserCheck";

const AuthRoutes = () => {
	return (
		<Routes>
			<Route index element={<Navigate to={"/auth/login"} />} />
			<Route
				path="login"
				element={
					<AuthRouteUserCheck>
						<Login />
					</AuthRouteUserCheck>
				}
			/>
			<Route
				path="register"
				element={
					<AuthRouteUserCheck>
						<Register />
					</AuthRouteUserCheck>
				}
			/>

			<Route path="*" element={<NotFound />} />
		</Routes>
	);
};

export default AuthRoutes;
