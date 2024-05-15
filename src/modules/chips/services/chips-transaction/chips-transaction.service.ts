import { AffiliateService } from '@/modules/user/services/affiliate/affiliate.service';
import { UserService } from '@/modules/user/user.service';
import { Injectable } from '@nestjs/common';

import { stateOfX } from '@/configs/stateOfX';

@Injectable()
export class ChipsTransactionService {
  constructor(
    private readonly affiliateService: AffiliateService,
    private readonly userService: UserService,
  ) {}
  getUseroleList(params) {
    console.log('get req data on affiliate.js' + JSON.stringify(params));
    const data: any = {},
      userdata: any = {};
    if (params.role !== 'admin') {
      data.isParent = params.loggedinUserid;
      userdata.isParent = params.loggedinUserid;
    }
    if (
      params.userrole === 'affiliate' ||
      params.userrole === 'sub-affiliate'
    ) {
      // display all the affiliate & sub affilite
      data.role = params.userrole;
      return this.affiliateService.findAll(data);
    } else {
      // display all the user
      return this.userService.findAll(userdata, {
        sort: {
          userName: 1,
        },
      });
    }
  }

  getcurrentbal(params) {
    const data: any = {};
    if (params.poker_role === 'admin') {
      data.role = 'company';
      return this.affiliateService.findOne(data);
    } else {
      data.affiliateid = params.loggedinUserid;
      return this.affiliateService.findOne(data);
    }
  }

  getWithdrawlProfile(params) {
    console.log('get withdrawl profile lines 885', JSON.stringify(params));
    // get affiliate & sub affiliate payment option
    const userId = params.fundWithdrawlByUserid;
    if (
      params.fundWithdrawlByRole === stateOfX.role.affiliate ||
      params.fundWithdrawlByRole === stateOfX.role.subaffiliate
    ) {
      return this.affiliateService.getWithdrawlProfileforAffiliate(userId);
    } else {
      // user withdrawl process
      return this.userService.getWithdrawlProfileforPlayer(userId);
    }
  }
}
