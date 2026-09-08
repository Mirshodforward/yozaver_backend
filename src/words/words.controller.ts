import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Language } from '../generated/prisma/client.js';
import { GetWordsQueryDto } from './dto/get-words-query.dto.js';
import { WordsService } from './words.service.js';

@ApiTags('words')
@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Get()
  async getWords(@Query() query: GetWordsQueryDto) {
    const language = query.lang === 'uz' ? Language.UZ : Language.EN;
    const words = await this.wordsService.getRandomWords(language, query.count);
    return { language: query.lang, words };
  }
}
