import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Custom rrror
import ErrorResponse from "../utils/ErrorResponse.js";

// Load environment variables
dotenv.config({ path: "./src/config/.env" });

const isAuthenticated = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		throw new ErrorResponse(403, "Authorization headers not provided");
	}

	jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, user) => {
		if (err) {
			throw new ErrorResponse(403, "Invalid token provided");
		}

		req.user = user;
		next();
	});
};

export default isAuthenticated;
