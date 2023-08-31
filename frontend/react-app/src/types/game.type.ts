// import { ParticipantType } from "./participant.type";
import { UserType } from "./user.type";

export interface OfferGameType {
  user_id: string;
  awayUser: UserType;
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
}

export type gameTypeType = "PUBLIC" | "PROTECTED" | "PRIVATE";

export interface gameType {
  id: string;
  name: string;
  type: gameTypeType;
  password: string;
  createdAt: Date;
  ownerId: string;

  // participants?: ParticipantType[];
}

export interface JoinedgameType extends gameType {
  hasNewMessages: boolean;
}
