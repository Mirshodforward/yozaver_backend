import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { ResultsModule } from '../results/results.module.js';
import { UsersModule } from '../users/users.module.js';
import { WordsModule } from '../words/words.module.js';
import { AdminController } from './admin.controller.js';
import { AdminService } from './admin.service.js';

@Module({
  imports: [AuthModule, UsersModule, ResultsModule, WordsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
