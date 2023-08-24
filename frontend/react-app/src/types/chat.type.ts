import { UserType } from "./user.type";

export interface ChatType {
  user: UserType;
  message: MessageType;
  role: "owner" | "admin" | "attendee";
}

export interface MessageType {
  id: string;
  content: string;
  userId: string;
  roomId: string;
  createdAt: Date;
}

export interface ProfileModalType {
  showProfile: boolean;
  user: UserType;
}
