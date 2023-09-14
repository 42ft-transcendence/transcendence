import { IsNotEmpty, IsString } from 'class-validator';

export class readyGameRoomDto {
  @IsString()
  @IsNotEmpty()
  readonly gameRoomURL: string;

  @IsString()
  @IsNotEmpty()
  readonly userId: string;
}
