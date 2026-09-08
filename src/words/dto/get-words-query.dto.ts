import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

export class GetWordsQueryDto {
  @IsOptional()
  @IsIn(['en', 'uz'])
  lang: 'en' | 'uz' = 'en';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(5)
  @Max(300)
  count: number = 50;
}
