import { UserResponse } from "./user.types";

declare global {
  namespace Express {
    interface Request {
      user?: UserResponse;
    }
  }
}
