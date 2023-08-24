export interface UserType {
  id: string;
  nickname: string;
  win: number;
  lose: number;
  ladder_win: number;
  ladder_lose: number;
  admin: boolean;
  avatarPath: string;
  status: UserStatus;
  twoFactorAuthenticationSecret: string;
  isTwoFactorAuthenticationEnabled: boolean;
  rating: number;
}

export enum UserStatus {
  ONLINE = 0,
  GAMING = 1,
  OFFLINE = 2,
  SIGNUP = 3,
}
