export interface User {
  id: number;
  name: string;
  email: string;
  password?: string | null;
  google_id?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GoogleUser {
  google_id: string;
  name: string;
  email: string;
}

export type RegisterDTO = Pick<User, "email" | "name" | "password">;

export type LoginDTO = Pick<User, "email" | "password">;

export type UserResponse = Omit<User, "password">;

export interface AuthResponse {
  access_token: string;
  user: UserResponse;
}

export interface JWTPayload {
  id: number;
  name: string;
  email: string;
}
