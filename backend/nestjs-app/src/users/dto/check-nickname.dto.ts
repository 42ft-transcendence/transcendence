// check-nickname.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CheckNicknameDto {
  @IsString()
  @IsNotEmpty()
  nickname: string;
}
