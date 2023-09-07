import { UserType } from "@src/types";
import {
  GameRoomInfoType,
  MatchHistoryType,
  GameRoomType,
  GameRoomStatus,
  GameModalType,
} from "@src/types/game.type";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();
export const matchHistoryState = atom<MatchHistoryType[]>({
  key: "matchHistoryState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const gameRoomURLState = atom<string>({
  key: "gameRoomURLState",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const gameRoomInfoState = atom<GameRoomInfoType>({
  key: "gameRoomInfoState",
  default: {
    roomURL: "",
    roomName: "",
    roomType: "" as GameRoomType,
    roomPassword: "",
    roomOwner: {} as UserType,
    numberOfParticipants: 0,
    gameMode: "",
    map: "",
    participants: [],
    chatMessages: [],
    status: GameRoomStatus.WAITING,
  },
  effects_UNSTABLE: [persistAtom],
});

export const gameRoomInfoInitState = {
  roomURL: "",
  roomName: "",
  roomType: "" as GameRoomType,
  roomPassword: "",
  roomOwner: {} as UserType,
  numberOfParticipants: 0,
  gameMode: "",
  map: "",
  participants: [],
  chatMessages: [],
  status: GameRoomStatus.WAITING,
};

export const gameRoomListState = atom<GameRoomInfoType[]>({
  key: "gameRoomListState",
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
