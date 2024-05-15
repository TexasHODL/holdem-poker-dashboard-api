import { CrudService } from '@/core/services/crud/crud.service';
import {
  AdminDBModel,
  InjectAdminModel,
} from '@/database/connections/admin-db';
import { DBModel, InjectDBModel } from '@/database/connections/db';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { AffiliateService } from '../user/services/affiliate/affiliate.service';
import { CreateDirectCashoutDto } from './dto/create-direct-cashout.dto';
import { UpdateDirectCashoutDto } from './dto/update-direct-cashout.dto';

@Injectable()
export class DirectCashoutService extends CrudService {
  constructor(
    @InjectAdminModel(AdminDBModel.DirectCashout)
    protected readonly model: Model<any>,
    @InjectAdminModel(AdminDBModel.DirectCashoutHistory)
    protected readonly directCashoutHistory: Model<any>,
    protected readonly affiliateService: AffiliateService,
  ) {
    super(model);
  }

  getSubAgentPendingCashoutsToAgent(query) {
    console.log('Inside getSubAgentPendingCashoutsToAgent db query -->', query);
    return this.model.aggregate([
      { $match: query },
      { $group: { _id: '$type', amount: { $sum: '$amount' } } },
    ]);
  }

  getPlayerPendingCashoutsToAgent(query) {
    console.log('Inside getPlayerPendingCashoutsToAgent db query -->', query);
    return this.model.aggregate([
      { $match: query },
      {
        $group: {
          _id: '_id',
          requestedAmount: { $sum: '$requestedAmount' },
          amount: { $sum: '$amount' },
        },
      },
    ]);
  }

  checkAffiliateSubAffiliate(params) {
    console.log(
      'Inside checkAffiliateSubAffiliate ********',
      JSON.stringify(params),
    );
    if (params.role.level == 0) {
      params.isAffiliateLogin = true;
    }
    return params;
  }

  async findAllSubAffiliates(params) {
    console.log(
      'Inside findAllSubAffiliates ************',
      JSON.stringify(params),
    );
    if (params.isAffiliateLogin) {
      var query: any = {};
      query.parentUser = params.userName;
      const result: any[] = await this.affiliateService.findAll(query);
      if (result) {
        var subAffArray = [];
        if (params.affiliateId) {
          for (var i = 0; i < result.length; i++) {
            if (result[i].userName == params.affiliateId) {
              subAffArray[i] = result[i].userName;
            }
          }
        } else {
          for (var i = 0; i < result.length; i++) {
            subAffArray[i] = result[i].userName;
          }
        }

        params.subAffArray = subAffArray;
        return params;
      } else {
        throw new BadRequestException('Error in finding subaffiliates');
      }
    } else {
      return params;
    }
  }

  countUsersInDirectCashoutHistory(params) {
    console.log(
      'Inside countUsersInDirectCashoutHistory *************',
      JSON.stringify(params),
    );
    var query: any = {};
    if (params.referenceNo) {
      query.referenceNumber = params.referenceNo;
    }
    if (params.userNameFilter) {
      query.userName = eval('/^' + params.userNameFilter + '$/i');
    }
    if (params.statusFilter) {
      query.status = eval('/^' + params.statusFilter + '$/i');
    }
    if (params.userTypeFilter) {
      query.profile = eval('/^' + params.userTypeFilter + '$/i');
    }
    if (params.startDate && params.endDate) {
      query.actionTakenAt = { $gte: params.startDate, $lte: params.endDate };
    }
    if (params.startDate && !params.endDate) {
      query.actionTakenAt = { $gte: params.startDate };
    }
    if (!params.startDate && params.endDate) {
      query.actionTakenAt = { $lte: params.endDate };
    }
    if (params.isAffiliateLogin) {
      query['$or'] = [
        {
          affilateId: params.userName,
          profile: 'Player',
        },
        {
          affilateId: params.userName,
          profile: 'subAffiliate',
        },
        {
          affiliateId: params.userName,
        },
      ];
    } else {
      query['$or'] = [
        {
          userName: params.userName,
        },
        {
          affilateId: params.userName,
        },
        {
          affiliateId: params.userName,
        },
      ];
    }
    return this.model.count(query);
  }

  async countDataForCashoutHistory(params) {
    console.log('countDataForCashout hit ********* ', params);
    await this.checkAffiliateSubAffiliate(params);
    await this.findAllSubAffiliates(params);
    return await this.countUsersInDirectCashoutHistory(params);
  }

  /**
   * findDataForCashoutHistory method finds cashout history data based on filters
   * @method findDataForCashoutHistory
   */
  async findDataForCashoutHistory(params) {
    console.log('findDataForCashoutHistory hit ********* ', params);
    await this.checkAffiliateSubAffiliate(params);
    await this.findAllSubAffiliates(params);
    await this.calculateTotalApprovedOrRejectedAmount(params);
    const result = await this.findUsersFromCashoutDataHistory(params);
    return {
      result: result,
      totalApprovedAmount: params.totalApprovedAmount,
    };
  }

  async calculateTotalApprovedOrRejectedAmount(params) {
    console.log(
      'Inside calculateTotalApprovedOrRejectedAmount ********',
      JSON.stringify(params),
    );
    var query: any = {};
    params.totalApprovedAmount = 0;
    if (params.referenceNo) {
      query.referenceNumber = params.referenceNo;
    }
    if (params.userNameFilter) {
      query.userName = eval('/^' + params.userNameFilter + '$/i');
    }
    if (params.statusFilter) {
      query.status = eval('/^' + params.statusFilter + '$/i');
    }
    if (params.userTypeFilter) {
      query.profile = eval('/^' + params.userTypeFilter + '$/i');
    }
    if (params.startDate && params.endDate) {
      query.actionTakenAt = { $gte: params.startDate, $lte: params.endDate };
    }
    if (params.startDate && !params.endDate) {
      query.actionTakenAt = { $gte: params.startDate };
    }
    if (!params.startDate && params.endDate) {
      query.actionTakenAt = { $lte: params.endDate };
    }
    if (params.isAffiliateLogin) {
      query['$or'] = [
        {
          affilateId: params.userName,
          profile: 'Player',
        },
        {
          affilateId: params.userName,
          profile: 'subAffiliate',
        },
        {
          affiliateId: params.userName,
        },
      ];
    } else {
      query['$or'] = [
        {
          affiliateId: params.userName,
        },
        {
          userName: params.userName,
        },
        {
          affilateId: params.userName,
        },
      ];
    }
    const result = await this.assignTotalApprovedTotalRejectedAmount(query);
    if (result) {
      console.log(
        'Inside assignTotalApprovedTotalRejectedAmount resullt -->',
        result,
      );
      for (var i = 0; i < result.length; i++) {
        console.log("result==== ", result);
        console.log("(result[i]._id: ", (result[i]._id));
        if (result[i]._id != null && result[i]._id.toUpperCase() == 'APPROVED') {
          params.totalApprovedAmount = parseInt(
            result[i].totalAmount + result[i].totalRequestedAmount,
          );
        }
      }
      return params;
    } else {
      throw new BadRequestException(
        'unable to calculate total Approved or total Rejected Amount',
      );
    }
  }

  assignTotalApprovedTotalRejectedAmount(query) {
    console.log(
      'Inside assignTotalApprovedTotalRejectedAmount db query -->',
      query,
    );
    return this.directCashoutHistory.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          totalAmount: { $sum: '$amount' },
          totalRequestedAmount: { $sum: '$requestedAmount' },
        },
      },
    ]);
  }

  findUsersFromCashoutDataHistory(params) {
    console.log('Inside findUsersCashoutData ********', JSON.stringify(params));
    var query: any = {};

    if (params.referenceNo) {
      query.referenceNumber = params.referenceNo;
    }
    if (params.userNameFilter) {
      query.userName = eval('/^' + params.userNameFilter + '$/i');
    }
    if (params.statusFilter) {
      query.status = eval('/^' + params.statusFilter + '$/i');
    }
    if (params.userTypeFilter) {
      query.profile = eval('/^' + params.userTypeFilter + '$/i');
    }
    if (params.startDate && params.endDate) {
      query.actionTakenAt = { $gte: params.startDate, $lte: params.endDate };
    }
    if (params.startDate && !params.endDate) {
      query.actionTakenAt = { $gte: params.startDate };
    }
    if (!params.startDate && params.endDate) {
      query.actionTakenAt = { $lte: params.endDate };
    }
    if (params.isAffiliateLogin) {
      query['$or'] = [
        {
          affilateId: params.userName,
          profile: 'Player',
        },
        {
          affilateId: params.userName,
          profile: 'subAffiliate',
        },
        {
          affiliateId: params.userName,
        },
      ];
    } else {
      query['$or'] = [
        {
          affiliateId: params.userName,
        },
        {
          userName: params.userName,
        },
        {
          affilateId: params.userName,
        },
      ];
    }
    query.skip = params.skip;
    query.limit = params.limit;
    return this.getAllFromDirectCashoutHistory(query);
  }

  getAllFromDirectCashoutHistory(query) {
    console.log('inside getAllFromDirectCashoutHistory ------ ', query);
    var skip = query.skip || 0;
    var limit = query.limit || 0;
    delete query.skip;
    delete query.limit;
    return this.directCashoutHistory
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ actionTakenAt: -1 });
  }

  /**
   * countDataForCashout method counts data for cashout
   * @method countDataForCashout
   */
  async countDataForCashout(params) {
    console.log('countDataForCashout hit ********* ', params);
    await this.checkAffiliateSubAffiliate(params);
    await this.findAllSubAffiliates(params);
    return await this.countUsers(params);
  }

  /**
   * findDataForCashout method counts data for cashout
   * @method findDataForCashout
   */
  async findDataForCashout(params) {
    console.log('findDataForCashout hit ********* ', params);
    await this.checkAffiliateSubAffiliate(params);
    return await this.findUsersCashoutData(params);
  }

  findUsersCashoutData(params) {
    console.log('Inside findUsersCashoutData ********', JSON.stringify(params));
    var query: any = {};
    if (params.isAffiliateLogin) {
      query['$or'] = [
        {
          affilateId: params.userName, // for sub-affiliates
        },
        {
          affiliateId: params.userName, // for listing players under affiliate
        },
      ];
    } else {
      query['$or'] = [
        {
          affiliateId: params.userName, // for listing all the cashout request for players under that Affiliate
        },
        {
          userName: params.userName, // for listing subAffiliate own request
        },
        {
          affilateId: params.userName,
        },
      ];
    }
    const skip = params.skip;
    const limit = params.limit;
    return this.model.find(query).skip(skip).limit(limit);
  }

  countUsers(params) {
    console.log('Inside countUsers *************', JSON.stringify(params));
    console.log(
      'Inside countUsers !!!!!!!!!!!!!!!!!!!!!!',
      JSON.stringify(params),
    );
    var query: any = {};
    if (params.isAffiliateLogin) {
      query['$or'] = [
        {
          affilateId: params.userName,
          // for listing all the cashout request of the sub affiliates
        },
        {
          affiliateId: params.userName, // listing all the cashout request of the players under that affiliate
        },
      ];
    } else {
      console.log('Affiliate is not loggedin my be sub affiliate loggedin');
      query['$or'] = [
        {
          affiliateId: params.userName,
        },
        {
          userName: params.userName,
        },
        {
          affilateId: params.userName,
        },
      ];
    }
    return this.model.count(query);
  }
}
