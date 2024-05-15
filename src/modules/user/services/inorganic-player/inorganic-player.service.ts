import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { UserService } from '../../user.service';
import * as uuid from 'uuid';
import { encrypt } from '@/v1/helpers/crypto';
// import { BonusDataService } from '@/modules/bonus-chips/services/bonus-data/bonus-data.service';
import popupTextManager from '@/configs/error-message';
import { FriendService } from '../friend/friend.service';
import { Model } from 'mongoose';
import { InjectDBModel } from '@/database/connections/db';
import { PokerDBModel } from '@/database/connections/constants';

@Injectable()
export class InorganicPlayerService {
  constructor(
    private readonly userService: UserService,
    // private readonly bonusDataService: BonusDataService,
    private readonly friendService: FriendService,
    @InjectDBModel(PokerDBModel.BonusData)
    private readonly bonusData: Model<any>,
  ) {}
  createUniqueId(length) {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  async insertDefaultdataInFriens(playerId) {
    const data = {
      playerId,
      requestReceived: [],
      friends: [],
      requestSent: [],
    };
    return await this.friendService.create(data);
    // db.insertFriendsData(data, function (err, result) {
    //   console.log('friends data inserted -> ', err, result);
    // });
  }

  /**
   * newUser method creates new inorganic player and assigns them default data
   * @method newUser
   */
  async newUser(filter) {
    console.log("filternewUser ", filter);
    const dataOfUser = await this.createDataForUser(filter);
    const emailVerificationToken = this.createUniqueId(10);
    dataOfUser.emailVerificationToken = emailVerificationToken;
    console.log("dataOfUser: ", dataOfUser);
    const user = await this.userService.create(dataOfUser);
    // if (err) {
    //   console.log('error in creating user document in db');
    //   cb({
    //     success: false,
    //     isRetry: false,
    //     isDisplay: false,
    //     channelId: '',
    //     info: popupTextManager.dbQyeryInfo.DB_ERROR_CREATE_USERDOCUMENT,
    //   });
    // }
    if (user) {
      console.log(
        'new user created is in createProfile in dbRemote is - ' +
          JSON.stringify(user),
      );
      const bonusDataofThisUser: any = {};
      bonusDataofThisUser.playerId = dataOfUser.playerId;
      bonusDataofThisUser.bonus = [];
      const resultBonusData = await this.bonusData.create(bonusDataofThisUser);
      if (resultBonusData) {
        const res = await this.insertDefaultdataInFriens(dataOfUser.playerId);
        if (!res) {
          throw new HttpException('Player create failed', 500);
        }
        return user;
        // return cb(null, {
        //   success: true,
        //   info: 'Player created successfully!',
        // });
      } else {
        throw new HttpException('Bonus data create failed', 500);
      }
    }
    throw new HttpException(
      popupTextManager.dbQyeryInfo.DB_ERROR_CREATE_USERDOCUMENT,
      500,
    );
    // else {
    //   cb({
    //     success: false,
    //     isRetry: false,
    //     isDisplay: false,
    //     channelId: '',
    //     info: popupTextManager.dbQyeryInfo.DB_ERROR_CREATE_USERDOCUMENT,
    //   });
    // }
  }

  createDataForUser(dataOfUser) {
    console.log(
      'data of user in createDataForUser from client - ' +
        JSON.stringify(dataOfUser),
    );
    if (!dataOfUser.password) {
      dataOfUser.password = this.createUniqueId(8); // A compulsory password - randomly generated
    }
    const userObject: any = {};
    const address = {
      pincode: '',
      city: '',
      state: '',
      address2: '',
      address1: ''
    };
    const statistics = {
      bestHand: '',
      handsPlayedRM: 0,
      handsPlayedPM: 0,
      handsWonRM: 0,
      handsWonPM: 0,
      handsLost: 0,
      megaPoints: 0,
      megaPointLevel: 1,
      countPointsToChips: 0,
      countPointsForBonus: 0
    };
    const prefrences = {
      tableLayout: '',
      autoBuyIn: '',
      autoBuyInAmountInPercent: '',
      cardColor: false
    };
    const settings = {
      seatPrefrence: 1,
      seatPrefrenceTwo: 1,
      seatPrefrenceSix: 1,
      muteGameSound: false,
      dealerChat: true,
      playerChat: true,
      adminChat: true,
      runItTwice: false,
      avatarId: 1,
      tableColor: 3
    };
    const chipsManagement = {
      deposit: 0,
      withdrawl: 0,
      withdrawlPercent: 5,
      withdrawlCount: 0,
      withdrawlDate: Number(new Date())
    };
    const buildAccess = {
      androidApp: true,
      iosApp: true,
      mac: true,
      browser: true,
      windows: true,
      website: true
    };
    const encryptPass = encrypt(dataOfUser.password);
    if (encryptPass.success) {
      userObject.password = encryptPass.result;
    } else {
      // cb({ success: false });
      // return;
      throw new BadRequestException('Invalid password');
    }
    userObject.firstName = dataOfUser.firstName;
    userObject.lastName = dataOfUser.lastName;
    userObject.gender = '';
    userObject.dateOfBirth = dataOfUser.dob;
    userObject.emailId = dataOfUser.emailId;
    userObject.mobileNumber = dataOfUser.mobileNumber
      ? dataOfUser.mobileNumber
      : '';
    userObject.userName = dataOfUser.userName;
    userObject.isOrganic = false;
    userObject.ipV4Address = '';
    userObject.ipV6Address = '';
    userObject.profileImage = '6';
    userObject.deviceType = '';
    userObject.loginMode = '';
    userObject.googleObject = '';
    userObject.facebookObject = '';
    userObject.isParent = dataOfUser.isParent || '';
    userObject.isParentUserName = dataOfUser.isParentUserName || '';
    userObject.parentType = dataOfUser.parentType || '';
    userObject.playerId = uuid.v4();
    userObject.createdAt = Number(new Date());
    userObject.address = address;
    userObject.statistics = statistics;
    userObject.prefrences = prefrences;
    userObject.settings = settings;
    userObject.buildAccess = buildAccess;
    userObject.isEmailVerified = false;
    userObject.isMobileNumberVerified = true;
    userObject.isNewUser = true;
    userObject.isBlocked = false;
    userObject.status = 'Active';
    userObject.isMuckHand = false;
    userObject.dailyBonusCollectionTime = Number(new Date());
    userObject.previousBonusCollectedTime = 0;
    userObject.lastLogin = Number(new Date());
    userObject.profilelastUpdated = '';
    userObject.freeChips = 5000;
    userObject.realChips = 0;
    userObject.instantBonusAmount = 0;
    userObject.claimedInstantBonus = 0;
    userObject.passwordResetToken = '';
    userObject.isResetPasswordTokenExpire = '';
    userObject.emailVerificationToken = false;
    userObject.isEmailVerificationTokenExpire = false;
    userObject.loyalityRakeLevel = 0;
    userObject.isBot = !!dataOfUser.isBot;
    userObject.offers = [false, false];
    userObject.tournaments = [false, false];
    userObject.letter = [false, false];
    userObject.anouncement = [false, false];
    userObject.chipsManagement = chipsManagement;
    userObject.rakeBack = dataOfUser.rakeBack || 0;
    userObject.createdBy = dataOfUser.createdBy;
    userObject.sponserId = dataOfUser.sponserId || "";
    userObject.tournamentsPlayed = 0;
    userObject.tournamentsEarnings = 0;
    userObject.unclamedBonus = dataOfUser.unclamedBonus || 0;
    userObject.cashoutGamePlay = this.checkParentType(dataOfUser);
    userObject.totalLeaderboardWinnings = dataOfUser.totalLeaderboardWinnings || 0
    console.log('format data for userObject is ', JSON.stringify(userObject));
    // cb({ success: true, result: userObject });
    return userObject;
  }

  checkParentType (data) {
    if (data.parentType.toUpperCase() == 'AGENT' || data.parentType.toUpperCase() == 'SUB-AGENT') {
      return true
    } else {
      return false
    }
  }
}
