import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class MuteUserDto {
  @IsUUID('4')
  @IsNotEmpty()
  readonly channelId: string;

  @IsString()
  @IsNotEmpty()
  readonly userId: string;
}
