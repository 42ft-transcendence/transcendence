import { UserType } from "@type";

export interface DirectMessageType {
  id: number;
  message: string;
  from: UserType;
  to: UserType;
  read: boolean;
}

export type DmOtherType = UserType;

export interface JoinedDmOtherType extends DmOtherType {
  hasNewMessages: boolean;
}
