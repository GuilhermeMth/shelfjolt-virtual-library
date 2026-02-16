export interface User {
  id: number;
  email: string;
  password: string;
}

export type RegisterDTO = Pick<User, "email" | "password">;

export type LoginDTO = Pick<User, "email" | "password">;

export type UserResponse = Omit<User, "password">;

export interface AuthResponse {
  access_token: string;
  user: UserResponse;
}

export interface JWTPayload {
  id: number;
  email: string;
}
