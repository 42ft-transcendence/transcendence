import { IsNotEmpty, IsString } from 'class-validator';

export class sendGameRoomChatDto {
  @IsString()
  @IsNotEmpty()
  readonly roomURL: string;

  @IsString()
  @IsNotEmpty()
  readonly roomName: string;

  @IsString()
  @IsNotEmpty()
  readonly message: string;

  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  readonly userNickname: string;

  @IsNotEmpty()
  readonly createdAt: Date;
}
