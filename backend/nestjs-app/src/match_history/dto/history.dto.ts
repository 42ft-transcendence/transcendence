import { IsNumber } from 'class-validator';

export class HistoryDto {
  @IsNumber()
  player1score: number;

  @IsNumber()
  player2score: number;

  player1: string;
  player2: string;

  gameMode: string;
}
