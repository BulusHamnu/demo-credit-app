import type { User } from "../../services/auth.service.ts";
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
