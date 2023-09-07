// nickname-param.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class NicknameParamDto {
  @IsString()
  @IsNotEmpty()
  nickname: string;
}
