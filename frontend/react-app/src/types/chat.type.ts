import { UserType } from "./user.type";

export type RoleType = "self" | "owner" | "admin" | "attendee";
export interface ChatType {
  id: string;
  user: UserType;
  message: string;
  role: RoleType;
}

export interface MessageType {
  id: string;
  content: string;
  userId: string;
  channelId: string;
  createdAt?: Date;
}

export interface ProfileModalType {
  showProfile: boolean;
  user: UserType;
}

export interface SendMessageReturnType {
  user: UserType;
  message: MessageType;
}
