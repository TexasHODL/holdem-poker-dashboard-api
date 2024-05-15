import { Injectable } from '@nestjs/common';
import { CreateLeaderboardSetDto } from './dto/create-leaderboard-set.dto';
import { UpdateLeaderboardSetDto } from './dto/update-leaderboard-set.dto';

@Injectable()
export class LeaderboardSetService {
  create(createLeaderboardSetDto: CreateLeaderboardSetDto) {
    return 'This action adds a new leaderboardSet';
  }

  findAll() {
    return `This action returns all leaderboardSet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} leaderboardSet`;
  }

  update(id: number, updateLeaderboardSetDto: UpdateLeaderboardSetDto) {
    return `This action updates a #${id} leaderboardSet`;
  }

  remove(id: number) {
    return `This action removes a #${id} leaderboardSet`;
  }
}
