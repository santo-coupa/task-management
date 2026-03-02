import { Role } from './role.enum';

export interface CreateUserRequest {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  title?: string;
  role: Role;
  isActive: boolean;
}