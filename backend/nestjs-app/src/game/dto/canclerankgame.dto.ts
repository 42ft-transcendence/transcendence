import { IsNotEmpty } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class cancleRankGameDto {
  @IsNotEmpty()
  readonly user: User;
}
