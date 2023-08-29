import { UserType } from "@type";

export interface DirectMessageType {
  id: number;
  message: string;
  from: UserType;
  to: UserType;
  read: boolean;
}

export interface JoinedDirectMessageType extends UserType {
  hasNewMessages: boolean;
}
