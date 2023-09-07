import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class HistoryDto {
  @IsNumber()
  @IsNotEmpty()
  player1score: number;

  @IsNumber()
  @IsNotEmpty()
  player2score: number;

  @IsString()
  @IsNotEmpty()
  player1: string;

  @IsString()
  @IsNotEmpty()
  player2: string;

  @IsString()
  @IsNotEmpty()
  gameMode: string;
}
