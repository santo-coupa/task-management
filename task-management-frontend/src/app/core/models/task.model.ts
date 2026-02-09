import { UserTaskStatus } from "./task-status.enum";

export interface UserTask{
  id : string;
  title : string;
  status : UserTaskStatus;
  assignedToUserId: string;
}