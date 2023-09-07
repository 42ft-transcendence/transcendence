import { IsNotEmpty, IsUUID } from 'class-validator';

export class EnterChannelDto {
  @IsUUID('4')
  @IsNotEmpty()
  readonly channelId: string;
}
