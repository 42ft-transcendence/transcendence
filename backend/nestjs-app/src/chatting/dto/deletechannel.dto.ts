import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteChannelDto {
  @IsUUID('4')
  @IsNotEmpty()
  readonly channelId: string;
}
