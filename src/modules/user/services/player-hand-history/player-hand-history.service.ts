import { CrudService } from '@/core/services/crud/crud.service';
import { LogDBModel } from '@/database/connections/constants';
import { InjectLogModel } from '@/database/connections/log-db';
import { parseStringToObjectId } from '@/shared/helpers/mongoose';
import { MailService } from '@/shared/services/mail/mail.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class PlayerHandHistoryService extends CrudService {
  constructor(
    @InjectLogModel(LogDBModel.HandHistory)
    protected readonly model: Model<any>,
    private readonly mailService: MailService,
  ) {
    super(model);
  }

  /**
   * method used to count player hand history records
   * @method countDataInPlayerHandHistory
   */
  countDataInPlayerHandHistory(params) {
    console.log('inside countDataInPlayerHandHistory line929', params);
    const query: any = {};
    if (params.userName) {
      query.players = eval('/^' + params.userName + '$/i');
    }
    if (params.handId) {
      query.handId = params.handId;
    }
    if (params.startDate && params.endDate) {
      query.finishedAt = { $gte: params.startDate, $lt: params.endDate };
    }
    if (params.startDate && !params.endDate) {
      query.finishedAt = { $gte: params.startDate };
    }
    if (!params.startDate && params.endDate) {
      query.finishedAt = { $lt: params.endDate };
    }
    console.log('query==========', query);
    return this.count(query);
    // logdb.countDataInPlayerHandHistory(query, function(err, result){
    //     console.log("err, res--", err, result);
    //   if(!err && result){
    //     return res.json({success: true, result: result});
    //   } else {
    //     return res.json({success: false, info: 'Getting error while fetching player hand history!'});
    //   }
    // });
  }

  /**
   * method used to list player hand history records
   * @method listDataInPlayerHandHistory
   */
  listDataInPlayerHandHistory(params) {
    console.log('inside listDataInPlayerHandHistory line929', params);
    const query: any = {};
    if (params.userName) {
      query.players = eval('/^' + params.userName + '$/i');
    }
    if (params.handId) {
      query.handId = params.handId;
    }
    if (params._id) {
      query._id = parseStringToObjectId(params._id);
    }
    if (params.startDate && params.endDate) {
      query.finishedAt = { $gte: params.startDate, $lt: params.endDate };
    }
    if (params.startDate && !params.endDate) {
      query.finishedAt = { $gte: params.startDate };
    }
    if (!params.startDate && params.endDate) {
      query.finishedAt = { $lt: params.endDate };
    }
    console.log('query==========', query);
    return this.findAll(query)
      .skip(params.skip || 0)
      .limit(params.limit || 0);
    // logdb.listDataInPlayerHandHistory(query, function(err, result){
    //   if(!err && result){
    //   	if(result.length != 0) return res.json({success: true, result: result});
    //   	else return res.json({success: false, info : "No Records Found!!" });
    //   } else {
    //     return res.json({success: false, info: 'Unable to list player hand history!!'});
    //   }
    // });
  }

  /**
   * method used to mail hand history report.
   * @method  sendHandHistoryToMail
   */
  async sendHandHistoryToMail(params) {
    console.log('inside sendHandHistoryToMail', params);
    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (emailRegex.test(params.emailId)) {
      const res = await this.mailService.sendFileViaMail({
        to: params.emailId,
        subject: 'PokerSD hand history Report',
        fileData: params.finalStringFile || '',
        text: '',
      });
      return res;
    } else {
      throw new BadRequestException(
        'Please enter valid email address.For example support@pokersd.com',
      );
    }
  }
}
