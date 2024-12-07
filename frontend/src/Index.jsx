import "./index.css";
import App from "./App.jsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

// ShadCN
import { Toaster } from "@/components/ui/toaster";

// Context
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "./Context/ThemeProvider.jsx";
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
