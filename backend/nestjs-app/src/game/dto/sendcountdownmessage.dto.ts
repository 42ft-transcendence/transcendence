import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class sendCountDownMessageDto {
  @IsString()
  @IsNotEmpty()
  readonly roomURL: string;

  @IsNumber()
  @IsNotEmpty()
  readonly seconds: number;
}
