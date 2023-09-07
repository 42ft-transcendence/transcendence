import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SendInviteDto {
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsUUID('4')
  @IsNotEmpty()
  readonly channelId: string;
}
