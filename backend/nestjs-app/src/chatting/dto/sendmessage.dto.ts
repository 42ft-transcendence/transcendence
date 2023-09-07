import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SendMessageDTO {
  @IsString()
  @IsNotEmpty()
  readonly message: string;

  @IsUUID('4')
  @IsNotEmpty()
  readonly channelId: string;
}
