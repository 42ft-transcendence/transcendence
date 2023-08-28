import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { DirectMessageType } from "@src/types/directMessage.type";

const { persistAtom } = recoilPersist();

export const directMessageListState = atom<DirectMessageType[]>({
  key: "directMessageListState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
