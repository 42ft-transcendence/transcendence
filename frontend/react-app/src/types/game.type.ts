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

export type GameMapType = "NORMAL" | "JUNGLE" | "DESERT";

export interface GameModalType {
  gameMap: GameMapType | null;
}
