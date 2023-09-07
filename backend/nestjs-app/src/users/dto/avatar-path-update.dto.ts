import { IsNotEmpty, IsString } from 'class-validator';

export class AvatarPathUpdateDto {
  @IsString()
  @IsNotEmpty()
  avatarPath: string;
}
