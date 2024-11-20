import { Routes, Route } from "react-router-dom";

// Routes
import AuthRoutes from "@/Routes/AuthRoutes";
import AppRoutes from "@/Routes/AppRoutes";

// Pages
import NotFound from "./pages/NotFound";

// axios interceptor
import "./services/axiosSetup.js";

function App() {
	return (
		<Routes>
			{/* Auth Routes */}
			<Route path="/auth/*" element={<AuthRoutes />} />

			{/* App Routes */}
			<Route path="/*" element={<AppRoutes />} />

			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

export default App;
