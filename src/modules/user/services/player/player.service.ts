import { FundrakeService } from '@/modules/finance/services/fundrake/fundrake.service';
import { parseStringToObjectId } from '@/shared/helpers/mongoose';
import { encrypt } from '@/v1/helpers/crypto';
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { UserService } from '../../user.service';
import { AffiliateService } from '../affiliate/affiliate.service';
import { InorganicPlayerService } from '../inorganic-player/inorganic-player.service';
import { PlayerBlockedRecordService } from '../player-blocked-record/player-blocked-record.service';
import { PlayerParentHistoryService } from '../player-parent-history/player-parent-history.service';

@Injectable()
export class PlayerService {
  constructor(
    private readonly affiliateService: AffiliateService,
    private readonly userService: UserService,
    private readonly fundrakeService: FundrakeService,
    private readonly playerBlockedRecordService: PlayerBlockedRecordService,
    private readonly playerParentHistoryService: PlayerParentHistoryService,
    private readonly inorganicPlayerService: InorganicPlayerService,
  ) {}
  async updatePlayer(params: any) {
    console.log('Inside updatePlayer =======', JSON.stringify(params));
    const result = await this.checkAffiliateExists(params);
    await this.checkPlayerExists(params, result);
    await this.createDataForBlockedReport(params);
    await this.updatePlayerInfo(params);
    await this.createPlayerParentHistory(params);
    return params;
    // async.waterfall([
    //   async.apply(checkAffiliateExists, params),
    //   checkPlayerExists,
    //   createDataForBlockedReport,
    //   updatePlayerInfo,
    //   createPlayerParentHistory
    // ], function (err, result) {
    //   if (!err && result) {
    //     return res.json({ success: true, result: result });
    //   } else {
    //     return res.json({ success: false, info: err.info });
    //   }
    // });
  }

  async checkAffiliateExists(params: any) {
    console.log('params = ====', params);
    const query2 = {
      userName: eval('/^' + params.isParentUserName + '$/i'),
    };
    const result: any = await this.affiliateService.findOne(query2);

    // if (!result) {
    //   throw new BadRequestException('Affiliate not found');
    // }
    console.log('@!@!@!@!@!', result);
    if (!params.isParentUserName) {
      params.parentType = '';
    }
    if (result != null) {
      if (result.rakeCommision <= params.rakeBack) {
        throw new BadRequestException('Rake Back is greater/equal to Parent');
        // return cb({ success: false, info: 'Rake Back is greater/equal to Parent' });
      }
      // if (
      //   result.role.level > 0 ||
      //   result.status != 'Active' ||
      //   result.role.level >= params.userRole.level
      // ) {
      //   console.log('Affiliate not found !!!!!!!!');
      //   if (result.userName != params.loggedInUser) {
      //     throw new BadRequestException('Affiliate/Sub-Affiliate not found');
      //   }
      // }
      if (
        result.role.level > 0 ||
        result.status != 'Active'
      ) {
        console.log('Affiliate not found !!!!!!!!');
        if (result.userName != params.loggedInUser) {
          throw new BadRequestException('Affiliate/Sub-Affiliate not found');
        }
      }
      if (result.role.level == 0) {
        params.parentType =
          result.role.name == 'newaffiliate' ? 'AFFILIATE' : 'AGENT';
      }
      if (result.role.level == -1) {
        params.parentType =
          result.role.name == 'newsubAffiliate' ? 'SUB-AFFILIATE' : 'SUB-AGENT';
        }
      // if (result.role.level == -1 && params.userRole.level == 0) {
      //   if (result.parentUser != params.loggedInUser) {
      //     console.log('Sub-Affiliate has different parent.');
      //     throw new BadRequestException('Affiliate/Sub-Affiliate not found');
      //     // return cb({ success: false, info: 'Affiliate/Sub-Affiliate not found' });
      //   }
      //   params.parentType =
      //     result.role.name == 'newsubAffiliate' ? 'SUB-AFFILIATE' : 'SUB-AGENT';
      // }
      if (result.role.level == -1) {
        // if (result.parentUser != params.loggedInUser) {
        //   console.log('Sub-Affiliate has different parent.');
        //   throw new BadRequestException('Affiliate/Sub-Affiliate not found');
        //   // return cb({ success: false, info: 'Affiliate/Sub-Affiliate not found' });
        // }
        params.parentType =
          result.role.name == 'newsubAffiliate' ? 'SUB-AFFILIATE' : 'SUB-AGENT';
      }
    }
    return result;
  }

  async checkPlayerExists(params, result) {
    console.log('========================', params);
    const query = { userName: eval('/^' + params.userName + '$/i') };
    const id = params._id;
    let isSendMail = false;
    console.log(' in findPlayer=====', query);
    const data = await this.userService.findOne(query);
    if (!data) {
      throw new BadRequestException('Unable to get user data!');
    }

    if (data && id != data._id.toString()) {
      throw new BadRequestException('Email ID or Mobile No. already exists!');
    } else {
      params.playerParentHistoryData = {};
      params.playerParentHistoryData.createParentHistory = false;
      if (
        params.isParentUserName &&
        params.isParentUserName != data.isParentUserName
      ) {
        console.log(
          '\n\n\n\n\n\n**********************************************',
          params.isParentUserName,
          isSendMail,
        );
        isSendMail = true;
        params.isSendMail = isSendMail;
        params.affiliateEmail = result.email;
        params.affiliateMobile = result.mobile;
      }
      if (!params.isParentUserName) {
        params.affiliateEmail = '';
        params.affiliateMobile = '';
      }
      params.isParentUserName = result ? result.userName : '';
      if (
        (!params.isParentUserName && data.isParentUserName) ||
        (params.isParentUserName && !data.isParentUserName) ||
        (params.isParentUserName &&
          data.isParentUserName &&
          params.isParentUserName != data.isParentUserName)
      ) {
        params.playerParentHistoryData.createParentHistory = true;
        params.playerParentHistoryData.newParent = params.isParentUserName;
        params.playerParentHistoryData.newParentType = params.parentType;
        params.playerParentHistoryData.oldParent = data.isParentUserName;
        params.playerParentHistoryData.oldParentType = data.parentType;
      }
      return result;
    }
  }

  async createDataForBlockedReport(params, player = null) {
    console.log("paramscreateDataForBlockedReport ", params);
    const query: any = {};
    query.userName = params.userName;

    const result = player ? player : await this.userService.findOne(query);
    if (!result) {
      throw new BadRequestException('Unable to get user data!');
    }

    if (result.status != params.status) {
      const result = await this.prepareDataForBlockedReport(params);
      if (result) {
        // result.reasonForBan = params.reasonForBan;
        console.log("result==== ", result);
        const res =
          await this.playerBlockedRecordService.insertBlockedPlayerData(result);
        console.log("res==== ", res);
        if (!res) {
          throw new HttpException('Unable to insert Data for Report', 500);
        }
      } else {
        throw new HttpException('Unable to insert Data for Report', 500);
      }
    }
  }

  async updatePlayerInfo(params: any) {
    console.log('------------ naman', params);
    const id = params._id;
    delete params._id;
    delete params.parent;
    delete params.datenew;
    delete params.mobileNumberNew;
    const isSendMail = params.isSendMail;
    delete params.isSendMail;
    console.log('id is ', id);
    params.password = encrypt(params.password).result;
    await this.userService.updatePlayer(id, params);
    params.isSendMail = isSendMail;
  }

  async createPlayerParentHistory(params: any) {
    console.log('-------inside createPlayerParentHistory ', params);
    if (params.playerParentHistoryData.createParentHistory) {
      const parantRole: any = await this.affiliateService.findOne({ userName: params.playerParentHistoryData.newParent })
      console.log("parantRole: ", parantRole);
      const parentHistoryData: any = {};
      parentHistoryData.updatedAt = Number(new Date());
      parentHistoryData.userName = params.userName;
      parentHistoryData.playerId = params.playerId;
      parentHistoryData.newParent = params.playerParentHistoryData.newParent;
      parentHistoryData.newParentType =
        params.playerParentHistoryData.newParentType;
      parentHistoryData.oldParent = params.playerParentHistoryData.oldParent;
      parentHistoryData.oldParentType =
        params.playerParentHistoryData.oldParentType;
      parentHistoryData.updatedBy = params.loggedInUser;
      parentHistoryData.updatedByRole =
        parantRole?.role?.name == 'affiliate'
          ? 'AGENT'
          : parantRole?.role?.name == 'newaffiliate'
          ? 'AFFILIATE'
          : parantRole?.role?.name == 'newsubAffiliate'
          ? 'SUB-AFFILIATE'
          : parantRole?.role?.name == 'subAffiliate'
          ? 'SUB-AGENT'
          : parantRole?.role?.name;
      const result = await this.playerParentHistoryService.create(
        parentHistoryData,
      );
      if (!result) {
        throw new HttpException(
          'Unable to save player updated parent details!!',
          500,
        );
      }
      return result;
    }
  }

  async prepareDataForBlockedReport(params: any) {
    const data: any = {};
    data.createdAt = Number(new Date());
    data.userName = params.userName;
    if (params.status == 'Block') {
      data.status = 'Block';
      data.reasonForBan = params.reasonForBan;
    } else {
      data.status = 'Active';
    }
    data.freeChipsBalance = params.freeChips;
    data.realChipsBalance = params.realChips;
    data.megaPoints = params.statistics.megaPoints;
    data.megaCircle = params.statistics.megaPointLevel;
    data.handsPlayed = params.statistics.handsPlayedRM;
    data.totalWinnings = params.realChips - params.chipsManagement.deposit;
    if (data.totalWinnings < 0) {
      data.totalWinnings = 0;
    }
    data.playerJoinedAt = params.createdAt;
    data.parent = params.isParentUserName;
    data.parentType = params.parentType;
    const result = await this.fundrakeService.findTotalRakeGenerated(
      { rakeByUsername: params.userName },
      '$rakeByUsername',
      '$amount',
    );
    if (!result || result.length == 0 || result.length == undefined) {
      data.totalRake = 0;
    } else {
      data.totalRake = result[0].amount;
    }
    return data;
  }

  countlistPlayer(params: any) {
    console.log('Inside countlistPlayer ********', JSON.stringify(params));

    return this.userService.getPlayersCount(params);
  }
  async createPlayer(params: any) {
    console.log('createPlayer hit == ', params);
    if (!params.password) {
      params.password = '111111';
    }
    await this.checkAllKeys(params);
    await this.checkUserAlreadyExists(params);
    await this.checkAdminUserAlreadyExists(params);
    await this.checkAffiliateOrSubAffiliate(params);
    return await this.inorganicPlayerService.newUser(params);
    // async.waterfall([
    //   async.apply(checkAllKeys, params),
    //   checkUserAlreadyExists,
    //   checkAdminUserAlreadyExists,
    //   checkAffiliateOrSubAffiliate,
    //   createInorganicPlayer.newUser

    // ], function (err, result) {
    //   console.log(err, result);
    //   if (err) {
    //     return res.json(err);
    //   } else {
    //     result.success = true;
    //     console.log('the final result is ', JSON.stringify(result));
    //     return res.json(result);
    //   }
    // });
  }

  /**
   * This method gets called when we create the player. In this method all the fields get validated
   * which is going to be used in creating a player.
   * @method checkAllKeys
   * @param  {Object}     params [query object containing player data]
   * @param  {Function}   cb     [callback as a response containing success: Boolean, info: String
   *                             params: Object]
   */
  checkAllKeys(params: any) {
    console.log('checkAllKeys hit!!', params);
    if (
      // !params.emailId ||
      // !params.mobileNumber ||
      !params.firstName ||
      !params.lastName ||
      !params.userName 
    ) {
      console.log(' hit!!', params);
      throw new BadRequestException(
        'One of the field is empty or all field empty!! Please check.',
      );
      // return cb({ success: false, info: 'One of the field is empty or all field empty!! Please check.' });
    }

    params.userName = params.userName.trim();
    return params;
    // cb(null, params);
  }

  /**
   * This method checks that the player which is going to be created is already existing or not on
   * the basis of the username and email id of the player.
   *
   * @method checkUserAlreadyExists
   * @param  {Object}               params [query obect containing player data]
   * @param  {Function}             cb     [callback as a response]
   */
  async checkUserAlreadyExists(params: any) {
    console.log('checkUserAlreadyExists hit!!', params);
    var filter: any = {
      userName: eval('/^' + params.userName + '$/i'),
    };
    const data = (
      await this.userService.findOne({ userName: filter.userName })
    )?.toObject();
    if (data) {
      var count = 0;
      var info = '';
      if (data.userName.toUpperCase() === params.userName.toUpperCase()) {
        info += ++count + '. Login Id already exist!! ';
      }
      throw new BadRequestException(info);
    }
    const res1 = await this.userService.findOne({
      emailId: eval('/^' + params.emailId + '$/i'),
    });
    if (res1) {
      throw new BadRequestException('Email Id already exists');
    }

    const res2 = await this.userService.findOne({
      mobileNumber: params.mobileNumber,
    });
    if (res2) {
      throw new BadRequestException('Mobile Number already exists');
    }
    return params;
  }

  /**
   * This method checks that is Admin User is already existing or not on
   * the basis of the username and email id of the User.
   *
   * @method checkAdminUserAlreadyExists
   */
  async checkAdminUserAlreadyExists(params: any) {
    console.log('checkAdminUserAlreadyExists hit!!', params);
    var query: any = {}; // getUser
    query.userName = eval('/^' + params.userName + '$/i');
    const data: any = await this.affiliateService.findOne({
      userName: query.userName,
    });
    if (data) {
      var count = 0;
      var info = '';
      if (data.userName.toUpperCase() === params.userName.toUpperCase()) {
        info += ++count + '. Login Id already exist!! ';
      }
      throw new BadRequestException(info);
    }

    const aff = await this.affiliateService.findOne({
      emailId: eval('/^' + params.emailId + '$/i'),
    });
    if (aff) {
      throw new BadRequestException('Email Id already exists');
    }
    return params;
    // admindb.findUserOrOperation(query, function (err, data) {
    //   console.log('findUser-=--=-=', err, data);
    //   if (!err) {
    //     if (!data) {
    //       admindb.getUser({ emailId: eval('/^' + params.emailId + '$/i') }, function (err, data) {
    //         if (!err && !data) {
    //           cb(null, params);
    //         } else {
    //           cb({ success: false, info: 'Email Id already exists' });
    //         }
    //       })
    //     } else {
    //       var count = 0;
    //       var info = '';
    //       if (data.userName.toUpperCase() === params.userName.toUpperCase()) { info += ++count + '. Login Id already exist!! '; }
    //       cb({ success: false, info: info });
    //     }
    //   } else {
    //     cb({ success: false, info: 'Error in finding existing user.' });
    //   }
    // });
  }

  /**
   * This method checks that the affiliate or subaffiliate is already existing or not, whether the
   * affiliate/sub-affiliates fall under the logged in use or not & can the player be assigned to the
   * specific affiliate/sub-affiliate.
   *
   * @method checkAffiliateOrSubAffiliate
   */
  async checkAffiliateOrSubAffiliate(params: any) {
    console.log('checkAffiliateOrSubAffiliate == ', params);
    if (params.isParentUserName) {
      const result: any = await this.affiliateService.findOne({
        userName: eval('/^' + params.isParentUserName + '$/i'),
      });
      console.log("result============== ", result);
      if (result && result.status == 'Active') {
        if (result.role.level > 0) {
          throw new BadRequestException('Affiliate not found');
          // return cb({ success: false, info: 'Affiliate not found' });
        }
        if (params.rakeBack >= result.rakeCommision) {
          // throw new BadRequestException('Data invalid of rake');
          throw new BadRequestException(`Rake is invalid, Player rake should be small than your rake. Your existing rake is ${result.rakeCommision}`);
          // return cb({ success: false, info: 'Data invalid of rake' });
        }
        if (params.parentUserRole.level > 0) {
          if (result.role.level == -1) {
            params.parentType =
              result.role.name == 'newsubAffiliate'
                ? 'SUB-AFFILIATE'
                : 'SUB-AGENT';
            params.isParentUserName = result.userName;
            params.isParent = result.parentUser;
            // cb(null, params);
            return params;
          } else if (result.role.level == 0) {
            params.parentType =
              result.role.name == 'newaffiliate' ? 'AFFILIATE' : 'AGENT';
            params.isParentUserName = result.userName;
            params.isParent = '';
            // cb(null, params);
            return params;
          }
        } else if (params.parentUserRole.level == 0) {
          if (result.role.level == -1) {
            if (result.parentUser === params.loggedInUser) {
              params.parentType =
                result.role.name == 'newsubAffiliate'
                  ? 'SUB-AFFILIATE'
                  : 'SUB-AGENT';
              params.isParentUserName = result.userName;
              params.isParent = result.parentUser;
              // cb(null, params);
              return params;
            } else {
              throw new BadRequestException(
                'Entered sub-affiliate does not come under the logged in affiliate!',
              );
              // cb({ success: false, info: 'Entered sub-affiliate does not come under the logged in affiliate!' });
            }
          } else if (result.role.level == 0) {
            // if affiliate/agent has been logged in dashboard
            if (result.userName === params.loggedInUser) {
              params.parentType =
                result.role.name == 'newaffiliate' ? 'AFFILIATE' : 'AGENT';
              params.isParentUserName = result.userName;
              params.isParent = '';
              // cb(null, params);
              return params;
            } else {
              // cb({ success: false, info: 'An affiliate cannot create player for any other affiliate!' });
              throw new BadRequestException(
                'An affiliate cannot create player for any other affiliate!',
              );
            }
          }
        } else if (params.parentUserRole.level < 0) {
          // if sub affiliate/ sub agent has been logged in dashboard
          params.parentType =
            result.role.name == 'newsubAffiliate'
              ? 'SUB-AFFILIATE'
              : 'SUB-AGENT';
          params.isParentUserName = result.userName;
          params.isParent = result.parentUser;
          // cb(null, params);
          return params;
        } else {
          // cb({ success: false, info: 'Entered Affiliate ID does not belong to any affiliate or sub-affiliate!' });
          throw new BadRequestException(
            'Entered Affiliate ID does not belong to any affiliate or sub-affiliate!',
          );
        }
      } else {
        // cb({ success: false, info: 'Affiliate or sub-affiliate not found!' });
        throw new BadRequestException('Affiliate or sub-affiliate not found!');
      }
    } else {
      if (params.parentUserRole.level > 0) {
        // cb(null, params);
        return params;
      } else {
        // cb({ success: false, info: 'Please enter an affiliate ID!' });
        throw new BadRequestException('Please enter an affiliate ID!');
      }
    }
  }

  listPlayers(params) {
    console.log('Inside listPlayers ********', JSON.stringify(params));
    return this.findAllPlayers(params);
  }

  findAllPlayers(query: any) {
    console.log('inside findAllPlayers ------ ', query);
    var newQuery: any = {};
    var skip = query.skip || 0;
    var limit = query.limit || 0;

    if (query._id) {
      newQuery._id = parseStringToObjectId(query._id);
    }
    if (query.userName && !query._id) {
      newQuery.isParentUserName = eval('/^' + query.userName + '$/i');
    }

    if (query.userId) {
      newQuery.userName = eval('/^' + query.userId + '$/i');
    }
    if (query.promoBonusAwarded == true) {
      newQuery.promoBonusAwarded = query.promoBonusAwarded;
    }
    if (query.promoBonusAwarded == false) {
      newQuery.promoBonusAwarded = null;
    }
    if (query.emailId) {
      newQuery.emailId = eval('/' + query.emailId + '/i');
    }
    if (query.parent) {
      newQuery.isParentUserName = eval('/^' + query.parent + '$/i');
    }

    if (query.isOrganic) {
      newQuery.isOrganic = query.isOrganic;
    }
    if (query.status) {
      newQuery.status = query.status;
    }
    if (newQuery.isOrganic == 'All') {
      delete newQuery.isOrganic;
    }
    console.log('newQuery in list player', newQuery);
    return this.userService
      .findAll(newQuery)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }
}
