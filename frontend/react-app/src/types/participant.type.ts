import { UserType } from "./user.type";
import { ChannelType } from "./channel.type";

export interface ParticipantType {
  id: string;
  owner: boolean;
  admin: boolean;
  muted: boolean;
  createdAt: Date;

  user?: UserType;
  userId?: string;
  channel?: ChannelType;
  channelId?: string;
}
