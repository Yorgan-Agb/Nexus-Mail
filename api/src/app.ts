import express from "express";
import cors from "cors";
import { config } from "../config.ts";
import { router as apiRouter } from "./routers/index.router.ts";
import cookieParser from "cookie-parser";

export const app = express();

app.use(cors({ origin: config.allowedOrigin }));

app.use(express.json());

app.use(cookieParser());

app.use("/api", apiRouter);
