import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class createGameRoomDto {
  @IsNotEmpty()
  readonly user: User;

  @IsString()
  @IsNotEmpty()
  readonly gameRoomURL: string;
}
