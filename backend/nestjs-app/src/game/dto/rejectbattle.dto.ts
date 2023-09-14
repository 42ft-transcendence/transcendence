import { IsNotEmpty, IsString } from 'class-validator';

export class rejectBattleDto {
  @IsString()
  @IsNotEmpty()
  readonly gameRoomURL: string;

  @IsString()
  @IsNotEmpty()
  readonly awayUserId: string;
}
