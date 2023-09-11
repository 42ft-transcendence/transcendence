import { atom } from "recoil";
import { DirectMessageType, DmOtherType, JoinedDmOtherType } from "@type";

export const joinedDmOtherListState = atom<JoinedDmOtherType[]>({
  key: "joinedDmOtherListState",
  default: [],
});

export const dmOtherState = atom<DmOtherType | null>({
  key: "dmOtherState",
  default: null,
});

export const dmListState = atom<DirectMessageType[]>({
  key: "dmListState",
  default: [],
});
