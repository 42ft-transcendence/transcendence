import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class EditChannelDto {
  @IsUUID('4')
  @IsNotEmpty()
  readonly channelId: string;

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
