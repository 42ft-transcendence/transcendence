import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { DirectMessageType, DmOtherType, JoinedDmOtherType } from "@type";

const { persistAtom } = recoilPersist();

export const joinedDmOtherListState = atom<JoinedDmOtherType[]>({
  key: "joinedDmOtherListState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const dmOtherState = atom<DmOtherType | null>({
  key: "dmOtherState",
  default: null,
});

export const dmListState = atom<DirectMessageType[]>({
  key: "dmListState",
  default: [],
});
