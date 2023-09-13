import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { UserType } from "../../../types";
import { ProfileModalType } from "@type/index";
import { initialUserData } from "./data";

const { persistAtom } = recoilPersist();

export const userDataState = atom<UserType>({
  key: "userDataState",
  default: initialUserData,
});

export const allUserListState = atom<UserType[]>({
  key: "allUserListState",
  default: [],
});

export const showProfileState = atom<ProfileModalType>({
  key: "showProfileState",
  default: {
    showProfile: false,
    user: {} as UserType,
  },
});

export const otherUserDataState = atom<UserType>({
  key: "otherUserDataState",
  default: initialUserData,
});

export const showProfileSlideState = atom<number>({
  key: "showProfileSlideState",
  default: 1,
});

export const isFirstLoginState = atom<boolean>({
  key: "isFirstLoginState",
  default: true, // 최초에는 true로 설정
  effects_UNSTABLE: [persistAtom],
});

export const friendListState = atom<UserType[]>({
  key: "friendListState",
  default: [],
});
