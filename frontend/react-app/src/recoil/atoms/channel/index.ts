import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { JoinedChannelType } from "@type";

const { persistAtom } = recoilPersist();

export const joinedChannelListState = atom<JoinedChannelType[]>({
  key: "joinedChannelListState",
  default: [], // 최초에는 true로 설정
  effects_UNSTABLE: [persistAtom],
});
