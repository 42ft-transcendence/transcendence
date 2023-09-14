import { IsNotEmpty, IsString } from 'class-validator';

export class surrenderGameDto {
  @IsString()
  @IsNotEmpty()
  readonly gameRoomURL: string;

  @IsString()
  @IsNotEmpty()
  readonly userId: string;
}
