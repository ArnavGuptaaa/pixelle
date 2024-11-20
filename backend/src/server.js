import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import authRouter from "./routes/auth.js";
import appRouter from "./routes/app.js";

// Error handler middleware
import errorHandler from "./middlewares/errorrHandler.js";

// Load environment variables
dotenv.config({ path: "./src/config/.env" });

// Initialize express
const app = express();

// Body parser
app.use(express.json());

// Middlewares
app.use(cors());

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

// Bind server to a port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server up and running"));
