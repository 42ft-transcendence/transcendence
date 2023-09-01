import { ChannelType } from "@type";
import { atom } from "recoil";

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

export const channelEditModalState = atom<boolean>({
  key: "channelEditModalState",
  default: false,
});
