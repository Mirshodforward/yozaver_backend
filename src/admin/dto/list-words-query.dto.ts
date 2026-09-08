import { IsIn, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';

export class ListWordsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsIn(['en', 'uz'])
  lang?: 'en' | 'uz';
}
