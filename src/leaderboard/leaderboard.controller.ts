import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LeaderboardQueryDto } from './dto/leaderboard-query.dto.js';
import { LeaderboardService } from './leaderboard.service.js';

@ApiTags('leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  top(@Query() query: LeaderboardQueryDto) {
    return this.leaderboardService.top(query.period, query.limit);
  }
}
