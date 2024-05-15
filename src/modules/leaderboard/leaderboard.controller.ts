import { countDirectEntryHistory, createLeaderboard, deleteLeaderboard, directEntryHistoryPlayer, directEntryPlayer, editLeaderboard, getCurrentLeaderboardParticipants, listLeaderboard } from '@/v1/controller/leaderboardManagement/leaderboardManagementController';
import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LeaderboardService } from './leaderboard.service';

@ApiTags('Leader Board Management')
@ApiBearerAuth()
@Controller('')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) { }

  @Post('countDirectEntryHistory')
  countDirectEntryHistory(@Req() req, @Body() dto: any) {
    return countDirectEntryHistory(req);
  }

  @Post('directEntryHistoryPlayer')
  directEntryHistoryPlayer(@Req() req, @Body() dto: any) {
    return directEntryHistoryPlayer(req);
  }

  @Post('createLeaderboard')
  createLeaderboard(@Req() req, @Body() dto: any) {
    return createLeaderboard(req);
  }

  @Post('listLeaderboard')
  listLeaderboard(@Req() req, @Body() dto: any) {
    return listLeaderboard(req);
  }

  @Post('deleteLeaderboard')
  deleteLeaderboard(@Req() req, @Body() dto: any) {
    return deleteLeaderboard(req);
  }

  @Post('editLeaderboard')
  editLeaderboard(@Req() req, @Body() dto: any) {
    return editLeaderboard(req);
  }

  @Post('directEntryPlayer')
  directEntryPlayer(@Req() req, @Body() dto: any) {
    return directEntryPlayer(req);
  }

  @Get('getCurrentLeaderboardParticipants/:leaderboardId/:status')
  getCurrentLeaderboardParticipants(@Req() req, @Body() dto: any) {
    return getCurrentLeaderboardParticipants(req);
  }
}
