// id-param.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class IdParamDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
