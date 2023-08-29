import { UserType } from "./user.type";

export type RoleType = "self" | "owner" | "admin" | "attendee";
export interface ChatType {
  user: UserType;
  message: MessageType;
  role: RoleType;
}

export interface MessageType {
  id: string;
  content: string;
  userId: string;
  channelId: string;
  createdAt: Date;
}

export interface ProfileModalType {
  showProfile: boolean;
  user: UserType;
}
