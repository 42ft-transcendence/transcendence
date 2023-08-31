import { MessageType } from "./chat.type";
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

export interface EnterChannelReturnType {
  channel: ChannelType;
  messages: MessageType[];
  participants: ParticipantType[];
}

export interface RefreshChannelType {
  newChannel: ChannelType;
  newParticipantList: ParticipantType[];
}
