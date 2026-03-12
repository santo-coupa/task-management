import { Role } from './role.enum';

export interface AuthResponse {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  token: string;
}
