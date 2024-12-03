import { Server } from "socket.io";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";

// Routes
import authRouter from "./routes/auth.js";
import appRouter from "./routes/app.js";

// Error handler middleware
import errorHandler from "./middlewares/errorrHandler.js";

// Socket
import initializeSockets from "./sockets/index.js";

// Load environment variables
dotenv.config({ path: "./src/config/.env" });

// Initialize express
const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Body parser
app.use(express.json());

// Middlewares
app.use(cors());

// Initialize Socket.IO
const io = new Server(server, {
	cors: {
		origin: "*",
	},
});

// Ping route
app.get("/ping", (req, res) => {
	res.json({
		success: true,
		message: "🏓 Pong!",
	});
});

// Mount Routes
app.use("/auth", authRouter);
app.use("/app", appRouter);

// Error Handler
app.use(errorHandler);

// Initialize Socket Connections
initializeSockets(io);

// Bind server to a port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Server up and running"));
