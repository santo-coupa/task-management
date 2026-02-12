import { Role } from "./role.enum";

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  role: Role;
}