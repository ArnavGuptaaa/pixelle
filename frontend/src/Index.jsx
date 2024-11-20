import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "./Context/ThemeProvider.jsx";
import { AuthProvider } from "@/hooks/useAuth";

import { BrowserRouter as Router } from "react-router-dom";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Router>
			<AuthProvider>
				<ThemeProvider defaultTheme="light" storageKey="theme">
					<App />
				</ThemeProvider>
			</AuthProvider>
		</Router>
	</StrictMode>
);
