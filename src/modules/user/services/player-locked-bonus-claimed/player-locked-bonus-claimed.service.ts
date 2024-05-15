import { ScheduledExpiryService } from '@/modules/bonus-chips/services/scheduled-expiry/scheduled-expiry.service';
import { MailService } from '@/shared/services/mail/mail.service';
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class PlayerLockedBonusClaimedService implements OnModuleInit {
  private scheduledExpiryService: ScheduledExpiryService;
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly mail: MailService,
  ) {}

  async onModuleInit() {
    this.scheduledExpiryService = await this.moduleRef.get(
      ScheduledExpiryService,
    );
  }
  countLockedClaimedHistory(params) {
    console.log('countLockedClaimedHistory -->', params);
    const query: any = {};
    let startDate, endDate;
    if (params.userName) {
      query.userName = eval('/^' + params.userName + '$/i');
    }
    if (!params.startDate && !params.endDate) {
      endDate = Number(new Date());
      startDate = endDate - 24 * 60 * 60 * 1000;
      query.releasedTime = { $gte: startDate, $lt: endDate };
    }
    if (params.startDate && params.endDate) {
      query.releasedTime = { $gte: params.startDate, $lt: params.endDate };
    }
    if (params.startDate && !params.endDate) {
      query.releasedTime = { $gte: params.startDate };
    }
    if (!params.startDate && params.endDate) {
      query.releasedTime = { $lt: params.endDate };
    }
    query['expireStatus'] = 2;
    console.log('count claim query -->', query);

    return this.scheduledExpiryService.count(query);
    // db.countExpirySlot(query, function (err, result) {
    //     if (err) {
    //     	return res.json({success : false, info : 'Error Occured while getting locked bonus claimed history'});
    //     } else{
    //     	if(result >0) return res.json({success : true , result : result});
    //     	else return res.json({success : false , info : 'No records found!!'});
    //     }
    // });
  }

  /**
   * method used to list records of particular player claimed locked bonus.
   */
  listLockedClaimedHistory(params) {
    console.log('listLockedClaimedHistory -->', params);
    const query: any = {};
    let startDate, endDate;
    if (params.userName) {
      query.userName = eval('/^' + params.userName + '$/i');
    }
    if (!params.startDate && !params.endDate) {
      endDate = Number(new Date());
      startDate = endDate - 24 * 60 * 60 * 1000;
      query.releasedTime = { $gte: startDate, $lt: endDate };
    }
    if (params.startDate && params.endDate) {
      query.releasedTime = { $gte: params.startDate, $lt: params.endDate };
    }
    if (params.startDate && !params.endDate) {
      query.releasedTime = { $gte: params.startDate };
    }
    if (!params.startDate && params.endDate) {
      query.releasedTime = { $lt: params.endDate };
    }
    query['expireStatus'] = 2;

    console.log('list locked claim query -->', query);
    return this.scheduledExpiryService
      .findAll(query)
      .skip(params.skip || 0)
      .limit(params.limit || 0);
  }

  async sendHandHistoryToMail(params) {
    console.log('inside sendHandHistoryToMail', params);
    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (emailRegex.test(params.emailId)) {
      const mailData: any = {};
      mailData.toEmail = params.emailId;
      mailData.msg = '';
      mailData.fileData = params.finalStringFile || '';
      console.log('mailData -->', mailData);
      const result = await this.mail.sendFileViaMail({
        to: params.emailId,
        fileData: params.finalStringFile || '',
        subject: '',
      });
      return result;
      // sendFileToMail.sendFileViaMail(mailData, function (err, result) {
      //   if (err) {
      //     return res.json({ success: false, info: 'Unable to send hand history report!!', result: err });
      //   } else {
      //     return res.json({ success: true, result: result });
      //   }
      // });
    } else {
      throw new BadRequestException(
        'Please enter valid email address.For example support@pokersd.com',
      );
      // return res.json({ success: false, info: 'Please enter valid email address.For example support@pokersd.com' });
    }
  }
}
