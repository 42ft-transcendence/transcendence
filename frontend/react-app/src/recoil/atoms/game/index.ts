import { GameModalType, MatchHistoryType } from "@src/types/game.type";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();
export const matchHistoryState = atom<MatchHistoryType[]>({
  key: "matchHistoryState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const gameModalState = atom<GameModalType>({
  key: "gameModalState",
  default: {
    gameMap: null,
  },
  effects_UNSTABLE: [persistAtom],
});
