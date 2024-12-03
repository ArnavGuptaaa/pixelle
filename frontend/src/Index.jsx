import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "./Context/ThemeProvider.jsx";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";

import { BrowserRouter as Router } from "react-router-dom";
import { NotificationProvider } from "./hooks/useNotifications.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Router>
			<AuthProvider>
				<NotificationProvider>
					<ThemeProvider defaultTheme="light" storageKey="theme">
						<App />
						<Toaster />
					</ThemeProvider>
				</NotificationProvider>
			</AuthProvider>
		</Router>
	</StrictMode>
);
