import jwt from "jsonwebtoken";
import prisma from "../prisma/prisma";
import bcrypt from "bcrypt";
import { admin } from "../providers/firebaseAdmin";
import type {
  User,
  AuthResponse,
  RegisterDTO,
  LoginDTO,
  JWTPayload,
} from "../@types/user.types";

export class AuthService {
  /**
   * Valida o token JWT do Firebase, extrai dados e cadastra/loga o usuário no banco.
   */
  async authenticateWithFirebaseToken(
    firebaseToken: string,
  ): Promise<AuthResponse> {
    let decoded;
    try {
      decoded = await admin.auth().verifyIdToken(firebaseToken);
    } catch (err) {
      throw new Error("INVALID_FIREBASE_TOKEN");
    }

    const { name, email, uid } = decoded;
    if (!email || !uid) {
      throw new Error("INVALID_FIREBASE_PAYLOAD");
    }

    // Procura usuário no banco
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Cadastra novo usuário
      user = await prisma.user.create({
        data: {
          name: name || "", // name pode ser undefined
          email,
          google_id: uid,
          password: null,
        },
      });
    } else if (!user.google_id) {
      // Atualiza google_id se ainda não existe
      user = await prisma.user.update({
        where: { email },
        data: { google_id: uid },
      });
    }

    const access_token = await this.generateToken(user);
    return {
      access_token,
      user: this.sanitizeUser(user),
    };
  }
  private readonly saltRounds = 10;
  private readonly jwt_secret = process.env.JWT_SECRET!;

  private sanitizeUser(user: User) {
    const { password, ...userWithoutPassword } = user as any;
    return userWithoutPassword;
  }

  private async generateToken(user: JWTPayload): Promise<string> {
    return jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      this.jwt_secret,
      {
        expiresIn: "1h",
      },
    );
  }

  async register({
    name,
    email,
    password,
  }: RegisterDTO): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new Error("USER_ALREADY_EXISTS");
    }

    let hashedPassword: string | null = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, this.saltRounds);
    }

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
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

    if (!user.password) {
      throw new Error("LOGIN_WITH_GOOGLE");
    }

    if (typeof password !== "string") {
      throw new Error("INVALID_CREDENTIALS");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password as string,
    );

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
