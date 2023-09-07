import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AppointAdminDto {
  @IsUUID('4')
  @IsNotEmpty()
  readonly channelId: string;

  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsBoolean()
  @IsNotEmpty()
  readonly to: boolean;
}
