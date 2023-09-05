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
  gameRoomURL: string;
}

export enum UserStatus {
  ONLINE = 0,
  GAMING = 1,
  OFFLINE = 2,
  SIGNUP = 3,
}

export interface LoginResponseDataType {
  id: string;
  nickname: string;
  avatarPath: string;
}

export interface UserStatusCounts {
  friendCount: number;
  onlineCount: number;
  gamingCount: number;
  offlineCount: number;
}
