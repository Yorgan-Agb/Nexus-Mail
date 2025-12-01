import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  profileUser,
} from "../controllers/auth.controller.ts";
import { tokenRefresh } from "../controllers/auth.controller.ts";
import { checkAuth } from "../middlewares/auth.middleware.ts";

export const authRouter = Router();

authRouter.get("/me", checkAuth, profileUser);
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/refresh", tokenRefresh);
authRouter.post("/logout", logoutUser);
