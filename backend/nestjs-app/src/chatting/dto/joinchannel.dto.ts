import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class JoinChannelDto {
  @IsUUID('4') // UUID 형식 확인
  @IsNotEmpty()
  readonly channelId: string;

  @IsString()
  @IsOptional() // 선택 사항으로 설정
  readonly password: string;
}
