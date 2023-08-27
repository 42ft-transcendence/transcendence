import { atom } from "recoil";

export const settingOptionModalState = atom<boolean>({
  key: "settingOptionModalState",
  default: false,
});
