import axios from "axios";
import { config } from "../config.ts";

export const httpRequest = axios.create({
  baseURL: `http://localhost:${config.port}/api`,
  validateStatus: () => true,
});
