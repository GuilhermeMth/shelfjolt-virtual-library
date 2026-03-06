import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";

const userService = new UserService();
export const userProvider = new UserController(userService);
