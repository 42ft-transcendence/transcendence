// two-factor-code.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class TwoFactorCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
