import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class exitRankGameRoomDto {
  @IsString()
  @IsNotEmpty()
  readonly gameRoomURL: string;

  @IsNotEmpty()
  readonly user: User;
}
