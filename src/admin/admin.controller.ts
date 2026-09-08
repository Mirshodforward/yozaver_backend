import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Language, Role } from '../generated/prisma/client.js';
import { ResultsService } from '../results/results.service.js';
import { UsersService } from '../users/users.service.js';
import { CreateWordDto } from '../words/dto/create-word.dto.js';
import { UpdateWordDto } from '../words/dto/update-word.dto.js';
import { WordsService } from '../words/words.service.js';
import { AdminService } from './admin.service.js';
import { ListResultsQueryDto } from './dto/list-results-query.dto.js';
import { ListUsersQueryDto } from './dto/list-users-query.dto.js';
import { ListWordsQueryDto } from './dto/list-words-query.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly usersService: UsersService,
    private readonly resultsService: ResultsService,
    private readonly wordsService: WordsService,
  ) {}

  @Get('stats')
  stats() {
    return this.adminService.stats();
  }

  @Get('users')
  listUsers(@Query() query: ListUsersQueryDto) {
    return this.usersService.list(query);
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.adminUpdate(id, { role: dto.role as Role | undefined, isBanned: dto.isBanned });
  }

  @Get('results')
  listResults(@Query() query: ListResultsQueryDto) {
    return this.resultsService.list(query);
  }

  @Delete('results/:id')
  deleteResult(@Param('id') id: string) {
    return this.resultsService.remove(id);
  }

  @Get('words')
  listWords(@Query() query: ListWordsQueryDto) {
    const language = query.lang === 'uz' ? Language.UZ : query.lang === 'en' ? Language.EN : undefined;
    return this.wordsService.list({ ...query, language });
  }

  @Post('words')
  createWord(@Body() dto: CreateWordDto) {
    return this.wordsService.create(dto.text, dto.lang === 'uz' ? Language.UZ : Language.EN);
  }

  @Patch('words/:id')
  updateWord(@Param('id') id: string, @Body() dto: UpdateWordDto) {
    return this.wordsService.update(id, dto);
  }

  @Delete('words/:id')
  deleteWord(@Param('id') id: string) {
    return this.wordsService.remove(id);
  }
}
