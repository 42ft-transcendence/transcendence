import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class userPaddleDto {
  @IsString()
  @IsNotEmpty()
  readonly gameRoomURL: string;

  @IsNumber()
  @IsNotEmpty()
  readonly userIndex: number;

  @IsNumber()
  @IsNotEmpty()
  readonly userPaddle: number;
}
