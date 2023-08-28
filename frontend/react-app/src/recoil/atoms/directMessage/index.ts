import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { DirectMessageType, JoinedDirectMessageType } from "@type";

const { persistAtom } = recoilPersist();

export const directMessageListState = atom<DirectMessageType[]>({
  key: "directMessageListState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const JoinedDirectMessageListState = atom<JoinedDirectMessageType[]>({
  key: "joinedDirectMessageListState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
