// channel-id.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class ChannelIdDto {
  @IsString()
  @IsNotEmpty()
  channelId: string;
}
