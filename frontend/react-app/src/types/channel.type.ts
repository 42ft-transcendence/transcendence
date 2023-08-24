import { ParticipantType } from "./participant.type";

export type ChannelTypeType = "PUBLIC" | "PROTECTED" | "PRIVATE";

export interface ChannelType {
  id: string;
  name: string;
  type: ChannelTypeType;
  password: string;
  createdAt: Date;
  ownerId: string;

  participants?: ParticipantType[];
}

export interface JoinedChannelType extends ChannelType {
  hasNewMessages: boolean;
}
