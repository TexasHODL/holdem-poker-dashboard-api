import { LoyalityPlayerService } from '@/modules/loyality-player/loyality-player.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class LoyalityReportService {
  constructor(private readonly loyalityPlayerService: LoyalityPlayerService) {}
  countDataInPlayerLoyalityPointsReport(params) {
    console.log('inside countDataInPlayerLoyalityPointsReport line929', params);
    const query: any = {};
    if (params.userName) {
      query.userName = eval('/' + params.userName + '/i');
    }
    if (params.channelId) {
      query.channelId = params.channelId;
    }
    if (params.startDate && !params.endDate) {
      query.date = { $gte: params.startDate };
    }
    if (params.endDate && !params.startDate) {
      query.date = { $lt: params.endDate };
    }
    if (params.endDate && params.startDate) {
      query.date = { $gte: params.startDate, $lt: params.endDate };
    }

    console.log('query==========', query);
    return this.loyalityPlayerService.count(query);
  }
  async listDataInPlayerLoyalityPointsReport(params) {
    let data = {};
    data = params;
    console.log(
      'Inside listDataInPlayerLoyalityPointsReport function ---------' +
        JSON.stringify(params),
    );
    await this.listDataInPlayerLoyalityPoints(data);
    return await this.calculateTotalVipPoints(data);
  }

  async listDataInPlayerLoyalityPoints(params) {
    console.log('inside listDataInPlayerLoyalityPointsReport  line929', params);
    const query: any = {};
    const newQuery: any = {};
    if (params.userName) {
      query.userName = eval('/' + params.userName + '/i');
      newQuery.userName = eval('/' + params.userName + '/i');
    }
    if (params.startDate && !params.endDate) {
      query.date = { $gte: params.startDate };
    }
    if (params.endDate && !params.startDate) {
      query.date = { $lt: params.endDate };
    }
    if (params.endDate && params.startDate) {
      query.date = { $gte: params.startDate, $lt: params.endDate };
    }
    if (params.channelId) {
      query.channelId = params.channelId;
      newQuery.channelId = params.channelId;
    }
    if (query.date) {
      newQuery.date = query.date;
    }
    console.log('query==========', query);

    const result = await this.loyalityPlayerService.listVipPoints(query, params)
    
    console.log("result====== ", result);
    if (result) {
      params.result = result;
      params.query = newQuery;
      return result;
    } else {
      throw new NotFoundException('Unable to find player Record');
    }
  }

  async calculateTotalVipPoints(params) {
    console.log('inside calculateTotalVipPoints  line929', params);
    console.log('+++++', params.query);
    const result = await this.loyalityPlayerService.calculateTotalVipPoints(
      params.query,
    );
    if (result) {
      console.log('result from calculate total Vip Points --->', result);
      params.totalVipPoints = 0;
      params.totalRake = 0;
      for (let i = 0; i < result.length; i++) {
        params.totalVipPoints = params.totalVipPoints + result[i].total;
        params.totalRake = params.totalRake + result[i].totalRake;
      }
      console.log(
        'result after calculation of Vip Points and total rake-->',
        params,
        '\n',
      );
      delete params.query;
      delete params.skip;
      delete params.limit;
      return params;
    } else {
      throw new BadRequestException('Unable to calculate total VIP Points');
    }
  }
}
