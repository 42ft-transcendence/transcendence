import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsObject,
  IsBoolean,
} from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class HistoryDto {
  @IsNumber()
  @IsNotEmpty()
  player1Score: number;

  @IsNumber()
  @IsNotEmpty()
  player2Score: number;

  @IsNumber()
  @IsNotEmpty()
  player1ScoreChange: number;

  @IsNumber()
  @IsNotEmpty()
  player2ScoreChange: number;

  @IsObject()
  @IsNotEmpty()
  player1: User;

  @IsObject()
  @IsNotEmpty()
  player2: User;

  @IsString()
  @IsNotEmpty()
  roomType: string;

  @IsString()
  @IsNotEmpty()
  map: string;

  @IsBoolean()
  @IsNotEmpty()
  isDummy: boolean;
}
