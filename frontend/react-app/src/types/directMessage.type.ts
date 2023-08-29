import { UserType } from "@type";

export interface DirectMessageType {
  id: number;
  message: string;
  from: UserType;
  to: UserType;
  read: boolean;
}

export type DmPartnerType = UserType;

export interface JoinedDmPartnerType extends DmPartnerType {
  hasNewMessages: boolean;
}
