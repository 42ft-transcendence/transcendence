import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { GameRoomType } from '../game.room';

export class offerBattleDto {
  @IsNotEmpty()
  readonly awayUser: User;

  @IsNotEmpty()
  readonly myData: User;

  @IsString()
  @IsNotEmpty()
  readonly gameRoomURL: string;

  @IsNotEmpty()
  readonly roomType: GameRoomType;
}
