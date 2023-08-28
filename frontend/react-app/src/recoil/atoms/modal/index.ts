import { atom } from "recoil";

export const settingOptionModalState = atom<boolean>({
  key: "settingOptionModalState",
  default: false,
});

export const createGameRoomModalState = atom<boolean>({
  key: "makeGameRoomModalState",
  default: false,
});
