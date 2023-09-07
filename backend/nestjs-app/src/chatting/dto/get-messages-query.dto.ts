import { IsString, IsNotEmpty } from 'class-validator';

export class GetMessagesQueryDto {
  @IsString()
  @IsNotEmpty()
  channelId: string;
}
