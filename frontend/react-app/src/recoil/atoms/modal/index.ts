import { ChannelType, UserType } from "@type";
import {
  battleActionData,
  gameAlertModalStateType,
} from "@src/types/game.type";
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

export const secondAuthActivateModalState = atom<boolean>({
  key: "secondAuthActivateModalState",
  default: false,
});

export const secondAuthDeactivateModalState = atom<boolean>({
  key: "secondAuthDeactivateModalState",
  default: false,
});
export const channelEditModalState = atom<boolean>({
  key: "channelEditModalState",
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
    awayUser: {} as UserType,
    gameRoomURL: "",
  },
  effects_UNSTABLE: [persistAtom],
});

export const changeNicknameModalState = atom<boolean>({
  key: "changeNicknameModalState",
  default: false,
});

export const gameAlertModalState = atom<gameAlertModalStateType>({
  key: "gameAlertModalState",
  default: {
    gameAlertModal: false,
    gameAlertModalMessage: "",
    shouldRedirect: false,
    shouldInitInfo: false,
  },
});
export const channelInviteModalState = atom<boolean>({
  key: "channelInviteModalState",
  default: false,
});

export const channelInviteAcceptModalState = atom<{
  channel: ChannelType;
  user: UserType;
} | null>({
  key: "channelInviteAcceptModalState",
  default: null,
});

export const isOpenRankGameWatingModalState = atom<boolean>({
  key: "isOpenRankGameWatingModalState",
  default: false,
});
