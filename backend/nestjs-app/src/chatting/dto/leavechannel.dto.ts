import { IsNotEmpty, IsUUID } from 'class-validator';

export class LeaveChannelDto {
  @IsUUID('4') // UUID 형식 확인
  @IsNotEmpty()
  readonly channelId: string;
}
