import express from "express";
import { registerUser, loginUser, fetchUser } from "../controllers/auth.js";

// Middlewares
import { validateUserRequest } from "../middlewares/requestValidators.js";
import isAuthenticated from "../middlewares/isAuthenicated.js";

const authRouter = express.Router();

authRouter.post("/register", validateUserRequest, registerUser);
authRouter.post("/login", validateUserRequest, loginUser);
authRouter.get("/me", isAuthenticated, fetchUser);

export default authRouter;
