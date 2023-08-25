import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { UserType } from "../../../types";
import { ProfileModalType } from "@type/index";

const { persistAtom } = recoilPersist();

export const userDataState = atom<UserType>({
  key: "userDataState",
  default: {
    id: "0",
    nickname: "guest",
    win: 0,
    lose: 0,
    ladder_win: 0,
    ladder_lose: 0,
    admin: false,
    avatarPath: "src/img_files",
    status: 0,
    twoFactorAuthenticationSecret: "",
    isTwoFactorAuthenticationEnabled: false,
    rating: 1000,
  },
  effects_UNSTABLE: [persistAtom],
});

export const allUserListState = atom<UserType[]>({
  key: "allUserListState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const showProfileState = atom<ProfileModalType>({
  key: "showProfileState",
  default: {
    showProfile: false,
    user: {} as UserType,
  },
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
