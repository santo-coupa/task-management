import { Role } from './role.enum';

export interface Profile {
  id: string;
  username: string;
  email: string;
  role: Role;
  firstName?: string;
  lastName?: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
}
