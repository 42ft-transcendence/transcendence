import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class enterGameRoomDto {
  @IsString()
  @IsNotEmpty()
  readonly gameRoomURL: string;

  @IsNotEmpty()
  readonly user: User;
}
