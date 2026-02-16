import jwt from "jsonwebtoken";
import prisma from "../prisma/prisma";
import bcrypt from "bcrypt";
import type {
  User,
  AuthResponse,
  RegisterDTO,
  LoginDTO,
  JWTPayload,
} from "../@types/user.types";

export class AuthService {
  private readonly saltRounds = 10;
  private readonly jwt_secret = process.env.JWT_SECRET!;

  private sanitizeUser(user: User) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private async generateToken(user: JWTPayload): Promise<string> {
    return jwt.sign({ id: user.id, email: user.email }, this.jwt_secret, {
      expiresIn: "1h",
    });
  }

  async register({ email, password }: RegisterDTO): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new Error("USER_ALREADY_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    const access_token = await this.generateToken(user);

    return {
      access_token,
      user: this.sanitizeUser(user),
    };
  }

  async login({ email, password }: LoginDTO): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const access_token = await this.generateToken(user);

    return {
      access_token,
      user: this.sanitizeUser(user),
    };
  }
}
