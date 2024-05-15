import { Inject, Injectable } from '@nestjs/common';
import { CountInstantBonusHistoryDto } from '../../dto/count-instant-bonus-history.dto';
import { InstantBonusHistoryQueryDto } from '../../dto/instant-bonus-history-query.dto';
import { InstantBonusHistoryService } from '../instant-bonus-history/instant-bonus-history.service';

@Injectable()
export class TransferHistoryService {
  constructor(
    @Inject(InstantBonusHistoryService)
    protected readonly instantBonusHistoryService: InstantBonusHistoryService,
  ) {}
  countInstantBonusHistory(req: CountInstantBonusHistoryDto) {
    console.log('inside countInstantBonusHistory function', req);
    const query: any = {};
    if (req.userName) {
      query.userName = eval('/^' + req.userName + '$/i');
    }
    if (req.parentUserName) {
      query.parentUserName = eval('/^' + req.parentUserName + '$/i');
    }
    if (req.type) {
      query.type = req.type;
    }
    if (req.promoCode) {
      query.promoCode = req.promoCode;
    }
    return this.instantBonusHistoryService.count(query);
  }

  async listInstantBonusHistory(params: InstantBonusHistoryQueryDto) {
    const query: any = {};
    if (params.userName) {
      query.userName = eval('/^' + params.userName + '$/i');
    }
    if (params.parentUserName) {
      query.parentUserName = eval('/^' + params.parentUserName + '$/i');
    }
    if (params.type) {
      query.type = params.type;
    }
    if (params.promoCode) {
      query.promoCode = params.promoCode;
    }
    // query.skip = params.skip;
    // query.limit = params.limit;
    const data = await this.instantBonusHistoryService
      .findAll(query)
      .skip(params.skip || 0)
      .limit(params.limit || 0)
      .sort({ time: -1 });
    (params as any).instantBonusHistoryList = data;
    await this.calculateTotalAmount(params);
    return data;
  }

  async calculateTotalAmount(params) {
    const query: any = {};
    if (params.userName) {
      query.userName = eval('/^' + params.userName + '$/i');
    }
    if (params.parentUserName) {
      query.parentUserName = eval('/^' + params.parentUserName + '$/i');
    }
    if (params.type) {
      query.type = params.type;
    }
    if (params.promoCode) {
      query.promoCode = params.promoCode;
    }
    const data =
      await this.instantBonusHistoryService.getTotalInstantAmountTransferred(
        query,
      );
    params.totalAmountArray = data;
    return data;
  }
}
