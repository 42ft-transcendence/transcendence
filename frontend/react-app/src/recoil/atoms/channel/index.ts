import { atom } from "recoil";
import {
  ChannelType,
  JoinedChannelType,
  MessageType,
  ParticipantType,
} from "@type";

export const allChannelListState = atom<ChannelType[]>({
  key: "allChannelListState",
  default: [],
});

export const joinedChannelListState = atom<JoinedChannelType[]>({
  key: "joinedChannelListState",
  default: [],
});

export const channelState = atom<ChannelType | null>({
  key: "channelState",
  default: null,
});

export const messageListState = atom<MessageType[]>({
  key: "messageListState",
  default: [],
});

export const participantListState = atom<ParticipantType[]>({
  key: "participantListState",
  default: [],
});
