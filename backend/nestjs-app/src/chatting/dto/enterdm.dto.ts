import { IsNotEmpty, IsString } from 'class-validator';

export class EnterDmDto {
  @IsString()
  @IsNotEmpty()
  readonly userId: string;
}
