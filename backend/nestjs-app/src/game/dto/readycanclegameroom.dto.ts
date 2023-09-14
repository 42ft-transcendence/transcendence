import { IsNotEmpty, IsString } from 'class-validator';

export class readyCancleGameRoomDto {
  @IsString()
  @IsNotEmpty()
  readonly gameRoomURL: string;

  @IsString()
  @IsNotEmpty()
  readonly userId: string;
}
