// avatar-default.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class AvatarDefaultDto {
  @IsString()
  @IsNotEmpty()
  avatarPath: string;
}
