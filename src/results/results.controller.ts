import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto.js';
import type { User } from '../generated/prisma/client.js';
import { CreateResultDto } from './dto/create-result.dto.js';
import { ResultsService } from './results.service.js';

@ApiTags('results')
@ApiBearerAuth()
@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: User, @Body() dto: CreateResultDto) {
    return this.resultsService.create(user.id, dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  history(@CurrentUser() user: User, @Query() query: PaginationQueryDto) {
    return this.resultsService.history(user.id, query.page, query.pageSize);
  }

  @Get('me/best')
  @UseGuards(JwtAuthGuard)
  best(@CurrentUser() user: User) {
    return this.resultsService.personalBest(user.id);
  }
}
