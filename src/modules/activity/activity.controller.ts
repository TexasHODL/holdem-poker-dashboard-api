import {
  calculateChipsAddedPartialForDashboard,
  findNewPlayersJoinData,
  findPartialRakeGenerated,
  findPartialRakeGeneratedDay,
  findPlayerLoginData,
  findTotalRakeLastWeek,
  findTotalRakeYesterday,
} from '@/v1/controller/activity/activityController';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
@ApiTags('Activity')
@Controller('')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post('findPartialRakeGenerated')
  findPartialRakeGenerated(@Req() req: Request) {
    return findPartialRakeGenerated(req);
  }

  @Post('findTotalRakeYesterday')
  findTotalRakeYesterday(@Req() req: Request) {
    return findTotalRakeYesterday(req);
  }

  @Post('findPartialRakeGeneratedDay')
  findPartialRakeGeneratedDay(@Req() req: Request) {
    return findPartialRakeGeneratedDay(req);
  }

  @Post('findTotalRakeLastWeek')
  findTotalRakeLastWeek(@Req() req: Request) {
    return findTotalRakeLastWeek(req);
  }

  @Post('findPlayerLoginData')
  findPlayerLoginData(@Req() req: Request) {
    return findPlayerLoginData(req);
  }

  @Post('findTotalChipsAdded')
  async findTotalChipsAdded(@Req() req: Request) {
    return calculateChipsAddedPartialForDashboard(req);
  }

  @Post('findNewPlayersJoinData')
  findNewPlayersJoinData(@Req() req: Request) {
    return findNewPlayersJoinData(req);
  }
}
