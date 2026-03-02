import { Role } from './role.enum';

export interface SystemUser {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}