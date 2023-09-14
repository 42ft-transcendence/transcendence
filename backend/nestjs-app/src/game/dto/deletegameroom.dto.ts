import { IsNotEmpty, IsString } from 'class-validator';

export class deleteGameRoomDto {
  @IsString()
  @IsNotEmpty()
  readonly gameRoomURL: string;
}
