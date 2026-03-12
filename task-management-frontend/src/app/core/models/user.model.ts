import { Role } from './role.enum';

export interface User {
  id: string;
  email: string;
  role: Role;

  username?: string;
  firstName?: string;
  lastName?: string;
}