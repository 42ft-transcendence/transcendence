// nickname.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class NicknameDto {
  @IsString()
  @IsNotEmpty()
  nickname: string;
}
