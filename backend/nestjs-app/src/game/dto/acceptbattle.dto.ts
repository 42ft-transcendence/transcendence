import { IsNotEmpty, IsString } from 'class-validator';

export class acceptBattleDto {
  @IsString()
  @IsNotEmpty()
  readonly gameRoomURL: string;

  @IsString()
  @IsNotEmpty()
  readonly user1Id: string;

  @IsString()
  @IsNotEmpty()
  readonly user2Id: string;
}
