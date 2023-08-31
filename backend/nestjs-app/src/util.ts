export enum UserStatusType {
  ONLINE,
  GAME,
  OFFLINE,
  SIGNUP,
}

export interface TMP {
  id?: string;
}

export enum UserRelationType {
  FRIEND,
  BLOCK,
}

export interface ValidNicknameType {
  message: string;
  status: number;
}

export interface RoomData {
  name: string;
  pass: string;
  mode: number;
  person: number;
  id: number;
  secret: boolean;
  participation: boolean;
}
