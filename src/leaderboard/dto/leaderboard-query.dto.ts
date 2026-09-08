import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'allTime';

export class LeaderboardQueryDto {
  @IsOptional()
  @IsIn(['daily', 'weekly', 'monthly', 'allTime'])
  period: LeaderboardPeriod = 'allTime';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 50;
}
