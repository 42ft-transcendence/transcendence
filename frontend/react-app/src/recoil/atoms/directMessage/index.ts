import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { DirectMessageType, DmPartnerType, JoinedDmPartnerType } from "@type";

const { persistAtom } = recoilPersist();

export const joinedDmPartnerListState = atom<JoinedDmPartnerType[]>({
  key: "joinedDmPartnerListState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const dmPartnerState = atom<DmPartnerType | null>({
  key: "dmPartnerState",
  default: null,
});

export const dmListState = atom<DirectMessageType[]>({
  key: "dmListState",
  default: [],
});
