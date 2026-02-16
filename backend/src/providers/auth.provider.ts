import { AuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";

const authService = new AuthService();
export const authProvider = new AuthController(authService);
