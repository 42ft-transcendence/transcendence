import { IsNotEmpty, IsString } from 'class-validator';

export class startGameCountDownDto {
  @IsString()
  @IsNotEmpty()
  readonly gameRoomURL: string;
}
