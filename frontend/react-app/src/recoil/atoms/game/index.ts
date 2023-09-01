import { UserType } from "@src/types";
import { GameRoomInfoType, MatchHistoryType } from "@src/types/game.type";
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

export const gameAcceptUser = atom<UserType>({
  key: "gameAcceptUser",
  default: {} as UserType,
  effects_UNSTABLE: [persistAtom],
});

export const gameRoomIn = atom<boolean>({
  key: "gameRoomIn",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const gameRoomInfoState = atom<GameRoomInfoType>({
  key: "gameRoomInfoState",
  default: {
    roomURL: "",
    roomName: "",
    homeUser: {} as UserType,
    awayUser: {} as UserType,
    homeReady: false,
    awayReady: false,
  },
  effects_UNSTABLE: [persistAtom],
});
