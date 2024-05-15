import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { LeaderboardSetService } from './leaderboard-set.service';
import { CreateLeaderboardSetDto } from './dto/create-leaderboard-set.dto';
import { UpdateLeaderboardSetDto } from './dto/update-leaderboard-set.dto';
import {
  changeViewOfLeaderboard,
  changeViewOfSet,
  countLeaderboardSets,
  createLeaderboardSet,
  deleteLeaderboardSet,
  getLeaderboardSets,
  getLeaderboardSpecificDetails,
  updateLeaderboardSet,
} from '@/v1/controller/leaderboardSetManagement/leaderboardSetManagementController';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Leaderboard set Management')
@ApiBearerAuth()
@Controller('')
export class LeaderboardSetController {
  constructor(private readonly leaderboardSetService: LeaderboardSetService) {}

  @Post('getLeaderboardSpecificDetails')
  getLeaderboardSpecificDetails(@Req() req) {
    return getLeaderboardSpecificDetails(req);
  }

  @Post('createLeaderboardSet')
  createLeaderboardSet(@Req() req) {
    return createLeaderboardSet(req);
  }

  @Post('countLeaderboardSets')
  countLeaderboardSets(@Req() req) {
    return countLeaderboardSets(req);
  }

  @Post('getLeaderboardSets')
  getLeaderboardSets(@Req() req) {
    return getLeaderboardSets(req);
  }

  @Post('changeViewOfSet')
  changeViewOfSet(@Req() req) {
    return changeViewOfSet(req);
  }

  @Post('updateLeaderboardSet')
  updateLeaderboardSet(@Req() req) {
    return updateLeaderboardSet(req);
  }

  @Post('changeViewOfLeaderboard')
  changeViewOfLeaderboard(@Req() req) {
    return changeViewOfLeaderboard(req);
  }

  @Post('deleteLeaderboardSet')
  deleteLeaderboardSet(@Req() req) {
    return deleteLeaderboardSet(req);
  }
}
