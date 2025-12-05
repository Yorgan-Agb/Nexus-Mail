import type { Role } from "../models/index.ts";

declare global {
  namespace Express {
    interface Request {
      userId: number;
      userRole: Role;
      cookies: Record<string, string>;
    }
  }
}
