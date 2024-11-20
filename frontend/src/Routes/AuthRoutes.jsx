import { Navigate, Routes, Route } from "react-router-dom";

// Pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import NotFound from "@/pages/NotFound";
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
