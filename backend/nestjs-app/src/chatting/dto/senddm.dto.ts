import { IsNotEmpty, IsString } from 'class-validator';

export class SendDmDto {
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  readonly message: string;
}
