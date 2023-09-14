// check-nickname.dto.ts
import { IsString } from 'class-validator';

export class CheckNicknameDto {
  @IsString()
  nickname: string;
}
