import { getLeaderboardReportCount, listLeaderboardReport } from '@/v1/controller/leaderboardReport/leaderboardReportController';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LeaderboardReportService } from './leaderboard-report.service';
@ApiTags('Leader report')
@ApiBearerAuth()
@Controller('')
export class LeaderboardReportController {
  constructor(private readonly leaderboardReportService: LeaderboardReportService) {}

  @Post('getLeaderboardReportCount')
  getLeaderboardReportCount(@Req() req, @Body() dto: any) {
    return getLeaderboardReportCount(req);
  }
  
  @Post('listLeaderboardReport')
  listLeaderboardReport(@Req() req, @Body() dto: any) {
    return listLeaderboardReport(req);
  }

}
