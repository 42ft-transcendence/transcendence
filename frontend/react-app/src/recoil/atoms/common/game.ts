import { MatchHistoryType } from "@src/types/game.type";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const matchHistoryListState = atom<MatchHistoryType[]>({
  key: "matchHistoryListState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
