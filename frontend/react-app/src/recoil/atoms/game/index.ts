import { MatchHistoryType } from "@src/types/game.type";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();
export const matchHistoryState = atom<MatchHistoryType[]>({
  key: "matchHistoryState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const gameRoomName = atom<string>({
  key: "gameRoomName",
  default: "",
  effects_UNSTABLE: [persistAtom],
});
