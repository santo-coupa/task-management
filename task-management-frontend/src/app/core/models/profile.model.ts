import { Role } from "./role.enum"

export interface Profile {
  id: string
  username: string
  firstName?: string
  lastName?: string
  email: string
  title?: string
  role: Role
  createdAt: string
}