import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { JoinedChannelType } from "@type";

const { persistAtom } = recoilPersist();

export const joinedChannelListState = atom<JoinedChannelType[]>({
  key: "joinedChannelListState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
