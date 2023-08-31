import { UserType } from "@src/types";
import { MatchHistoryType, acceptUserType } from "@src/types/game.type";
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

export const gameAcceptUser = atom<acceptUserType>({
  key: "gameAcceptUser",
  default: {
    // showProfile: false,
    user: {} as UserType,
  },
});

export const gameRoomIn = atom<boolean>({
  key: "gameRoomIn",
  default: false,
  effects_UNSTABLE: [persistAtom],
});
