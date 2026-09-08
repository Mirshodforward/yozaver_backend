import { Injectable } from '@nestjs/common';
import { ResultsService } from '../results/results.service.js';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly resultsService: ResultsService,
  ) {}

  async stats() {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [totalUsers, newUsersThisWeek, totalTests, testsToday, averageWpm] = await Promise.all([
      this.usersService.count(),
      this.usersService.countCreatedSince(weekAgo),
      this.resultsService.count(),
      this.resultsService.countToday(),
      this.resultsService.averageWpm(),
    ]);

    return {
      totalUsers,
      newUsersThisWeek,
      totalTests,
      testsToday,
      averageWpm: Math.round(averageWpm * 10) / 10,
    };
  }
}
