import { CrudService } from '@/core/services/crud/crud.service';
import {
  AdminDBModel,
  InjectAdminModel,
} from '@/database/connections/admin-db';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { TransferToAffiliateHistoryService } from '../transfer-to-affiliate-history/transfer-to-affiliate-history.service';
import { TransferToPlayerHistoryService } from '../transfer-to-player-history/transfer-to-player-history.service';

@Injectable()
export class ChipsTransferHistoryService {
  constructor(
    private readonly transferToPlayerHistoryService: TransferToPlayerHistoryService,
    private readonly transferToAffiliateHistoryService: TransferToAffiliateHistoryService,
  ) {}

  async fundTransferAffiliateHistory(params) {
    console.log(
      'Inside fundTransferAffiliateHistory ********',
      JSON.stringify(params),
    );
    if (params.transferTo) {
      params.transferTo = eval('/' + params.transferTo + '/i');
    }
    if (params.transferBy) {
      params.transferBy = eval('/' + params.transferBy + '/i');
    }
    const res =
      await this.transferToAffiliateHistoryService.findTransferToAffiliateHistory(
        params,
      );
    const result2 = await this.calculateTransferredAmountAgent(params);
    return {
      result: res,
      totalAmount: (result2 && result2.totalAmount) || 0,
    };

    // admindb.findTransferToAffiliateHistory(params, function (err, result) {
    //   if (err) {
    //     console.log('In error !!!!!!!!');
    //     return res.json({success: false, result: err});
    //   } else {
    //     console.log('Successfully found the  fundTransferAffiliateHistory', JSON.stringify(result));
    //     calculateTransferredAmountAgent(params , function(error,result2){
    //         if(error){
    //          return res.json({success: false, result: error});
    //         } else{
    //           return res.json({success: true, result: result ,totalAmount : result2.totalAmount});
    //         }
    //     })
    //   }
    // });
  }

  async calculateTransferredAmountAgent(params) {
    console.log('Inside calculateTransferredAmountAgent function', params);
    const result =
      await this.transferToAffiliateHistoryService.calculateTransferAmountAgent(
        params,
      );
    if (result.length > 0) {
      params.totalAmount = result[0].totalAmount;
    } else {
      params.totalAmount = 0;
    }
    return result.length > 0 ? result[0] : null;
  }

  async fundTransferPlayerHistory(params) {
    console.log('Inside fundTransferPlayerHistory ********', params);
    if (params.transferTo) {
      params.transferTo = eval('/' + params.transferTo + '/i');
    }
    if (params.transferBy) {
      params.transferBy = eval('/' + params.transferBy + '/i');
    }
    const res =
      await this.transferToPlayerHistoryService.findTransferToPlayerHistory(
        params,
      );
    const result2 = await this.calculateTransferredAmountPlayer(params);
    const result3 = this.countTotalAmount(res);
    return {
      result: res,
      totalAmount: (result2 && result2.totalAmount) ? (result2 && result2.totalAmount) : result3,
    };
  }

  async calculateTransferredAmountPlayer(params) {
    console.log('Inside calculateTransferredAmount function', params);
    const result =
      await this.transferToPlayerHistoryService.calculateTransferAmount(params);
    if (result.length > 0) {
      params.totalAmount = result[0].totalAmount;
    } else {
      params.totalAmount = 0;
    }
    return result.length > 0 ? result[0] : null;
  }

  countTotalAmount (params) {
    if (params.length === 0) {
      return 0
    }
    return params.reduce((acc: number, val: any) => acc + val.amount, 0);
  }

  countHistoryAffiliates(params) {
    console.log(
      'Inside countHistoryAffiliates ********',
      JSON.stringify(params),
    );
    if (params.transferTo) {
      params.transferTo = eval('/' + params.transferTo + '/i');
    }
    if (params.transferBy) {
      params.transferBy = eval('/' + params.transferBy + '/i');
    }
    delete params.skip;
    delete params.limit;
    return this.transferToAffiliateHistoryService.countAffiliatesHistory(
      params,
    );
    // admindb.countAffiliatesHistory(params, function (err, result) {
    //   if (err) {
    //     console.log('In error !!!!!!!!');
    //     return res.json({ success: false, result: err });
    //   } else {
    //     console.log('Successfully found the  WithdrawHistory', JSON.stringify(result));
    //     return res.json({ success: true, result: result });
    //   }
    // });
  }
}
