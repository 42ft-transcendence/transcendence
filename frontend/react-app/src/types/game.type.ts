// import { ParticipantType } from "./participant.type";
import { MessageType } from "./chat.type";
import { UserType } from "./user.type";

export interface OfferGameType {
  awayUser: UserType;
  myData: UserType;
  gameRoomURL: string;
  roomType: string;
}

export interface MatchHistoryType {
  id: number;
  player1Score: number;
  player2Score: number;
  createdAt: Date;
  player1: UserType;
  player2: UserType;
  player1ScoreChange: number;
  player2ScoreChange: number;
  gameMode: string;
  map: string;
}

export interface battleActionData {
  battleActionModal: boolean;
  awayUser: UserType;
  gameRoomURL: string;
}

export type GameRoomType = "PUBLIC" | "PROTECTED" | "PRIVATE" | "CREATING" | "";

export interface gameType {
  id: string;
  name: string;
  type: GameRoomType;
  password: string;
  createdAt: Date;
  ownerId: string;

  // participants?: ParticipantType[];
}

export interface JoinedgameType extends gameType {
  hasNewMessages: boolean;
}

export interface GameRoomParticipantType {
  user: UserType;
  ready: boolean;
}

export enum GameRoomStatus {
  WAITING = 0,
  GAMING = 1,
}

export interface GameRoomInfoType {
  roomURL: string;
  roomName: string;
  roomType: GameRoomType;
  roomPassword: string;
  roomOwner: UserType;
  status: GameRoomStatus;
  numberOfParticipants: number;
  gameMode: string;
  map: string;
  participants: GameRoomParticipantType[];
  chatMessages: MessageType[];
}

export interface gameAlertModalStateType {
  gameAlertModal: boolean;
  gameAlertModalMessage: string;
  shouldRedirect: boolean;
  shouldInitInfo: boolean;
}

export type GameMapType = "NORMAL" | "JUNGLE" | "DESERT";

export interface GameModalType {
  gameMap: GameMapType | null;
}
