import { IsString, IsNotEmpty } from 'class-validator';

export class SearchChannelsQueryDto {
  @IsString()
  @IsNotEmpty()
  keyword: string;
}
