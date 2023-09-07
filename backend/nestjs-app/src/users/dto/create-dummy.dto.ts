// create-dummy.dto.ts
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDummyDto {
  @IsNumber()
  @IsNotEmpty()
  count: number;
}
