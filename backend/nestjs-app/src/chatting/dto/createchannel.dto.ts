import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  readonly channelName: string;

  @IsNumber()
  @Min(0)
  @Max(2)
  @IsNotEmpty()
  readonly type: number;

  @IsString()
  readonly password: string;
}
