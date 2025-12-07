import { Router } from "express";
import { checkAuth } from "../middlewares/auth.middleware.ts";
import {
  getAllMails,
  getOneMail,
  sendMail,
} from "../controllers/mail.controller.ts";

export const mailRouter = Router();

mailRouter.get("/", checkAuth, getAllMails);
mailRouter.get("/:id", checkAuth, getOneMail);
mailRouter.post("/send", checkAuth, sendMail);
