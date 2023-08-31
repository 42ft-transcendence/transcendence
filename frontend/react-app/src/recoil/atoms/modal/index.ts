import { ChannelType } from "@type";
import { battleActionData } from "@src/types/game.type";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const settingOptionModalState = atom<boolean>({
  key: "settingOptionModalState",
  default: false,
});

export const channelJoinModalState = atom<ChannelType | null>({
  key: "channelJoinModalState",
  default: null,
});

export const channelCreateModalState = atom<boolean>({
  key: "channelCreateModalState",
  default: false,
});

export const createGameRoomModalState = atom<boolean>({
  key: "makeGameRoomModalState",
  default: false,
});

export const battleActionModalState = atom<battleActionData>({
  key: "battleActionModalState",
  default: {
    battleActionModal: false,
    nickname: "",
  },
  effects_UNSTABLE: [persistAtom],
});
