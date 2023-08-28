import { UserType } from "./user.type";

export interface DirectMessageType {
  id: number;
  message: string;
  from: UserType;
  to: UserType;
  read: boolean;
}

export interface JoinedDirectMessageType extends DirectMessageType {
  hasNewMessages: boolean;
}
