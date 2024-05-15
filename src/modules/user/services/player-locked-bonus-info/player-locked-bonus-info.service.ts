import { app } from '@/configs/app';
import { ScheduledExpiryService } from '@/modules/bonus-chips/services/scheduled-expiry/scheduled-expiry.service';
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import _ from 'underscore';
import { UserService } from '../../user.service';

@Injectable()
export class PlayerLockedBonusInfoService implements OnModuleInit {
  private scheduledExpiryService: ScheduledExpiryService;
  constructor(
    private readonly userService: UserService,
    private readonly moduleRef: ModuleRef,
  ) {}

  async onModuleInit() {
    console.log('inited');
    this.scheduledExpiryService = await this.moduleRef.get(
      ScheduledExpiryService,
    );
  }

  async getCountOfPlayerData(params) {
    const query = { userName: eval('/^' + params.playerName + '$/i') };
    const result = await this.scheduledExpiryService.count(query);
    if (result == 0) {
      throw new NotFoundException(
        'No Locked Bonus data found for this Player.',
      );
    } else {
      return result;
    }
  }

  async getPlayerData(params) {
    const query = { userName: eval('/^' + params.playerName + '$/i') };
    const player = await this.userService.findOne(query);
    params.playerInfo = player;
    return player;
  }

  async getPlayerLockedBonusData(params) {
    const query = { userName: eval('/^' + params.playerName + '$/i') };
    const result = await this.scheduledExpiryService
      .findAll(query)
      .skip(params.skip || 0)
      .limit(params.limit || 0);
    params.bonusData = result;
  }

  calculatePointsReminingToAccumulate(params) {
    for (let i = 0; i < params.bonusData.length; i++) {
      if (
        params.bonusData[i].lockedBonusAmount > 0 &&
        params.bonusData[i].expireStatus == 0
      ) {
        const tempAmt =
          (params.bonusData[i].lockedBonusAmount *
            app.PERCENTFOR_BONUSRELEASE) /
          100;
        const remainingPoints =
          tempAmt - params.playerInfo.statistics.countPointsForBonus;
        params.bonusData[i].remainingPoints =
          remainingPoints > 0 ? remainingPoints : 0;
        params.bonusData[i].isAvailableToClaim =
          remainingPoints > 0 ? false : true;
      } else {
        params.bonusData[i].remainingPoints = 0;
      }
    }
  }

  async listPlayerLockedBonusData(params) {
    await this.getPlayerData(params);
    await this.getPlayerLockedBonusData(params);
    await this.calculatePointsReminingToAccumulate(params);
    return params.bonusData;
  }
}
