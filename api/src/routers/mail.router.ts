import { Router } from "express";
import { checkAuth } from "../middlewares/auth.middleware.ts";
import { getAllMails } from "../controllers/mail.controller.ts";

export const mailRouter = Router();

mailRouter.get("/", checkAuth, getAllMails);
