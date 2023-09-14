import { IsNotEmpty } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class joinRankGameDto {
  @IsNotEmpty()
  readonly user: User;
}
