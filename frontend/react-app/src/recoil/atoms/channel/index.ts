import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import {
  ChannelType,
  JoinedChannelType,
  MessageType,
  ParticipantType,
} from "@type";

const { persistAtom } = recoilPersist();

export const joinedChannelListState = atom<JoinedChannelType[]>({
  key: "joinedChannelListState",
  default: [],
  effects_UNSTABLE: [persistAtom],
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
