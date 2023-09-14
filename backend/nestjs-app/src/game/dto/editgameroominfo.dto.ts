import { IsNotEmpty, IsString } from 'class-validator';
import { GameRoomType } from '../game.room';

export class editGameRoomInfoDto {
  @IsString()
  @IsNotEmpty()
  readonly gameRoomURL: string;

  @IsString()
  @IsNotEmpty()
  readonly infoType: string;

  @IsNotEmpty()
  readonly info: string | number | boolean | GameRoomType;
}
