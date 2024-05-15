import { CrudService } from '@/core/services/crud/crud.service';
import { DBModel, InjectDBModel } from '@/database/connections/db';
import {
  AdminDBModel,
  InjectAdminModel,
} from '@/database/connections/admin-db';
import { parseStringToObjectId } from '@/shared/helpers/mongoose';
import { encrypt } from '@/v1/helpers/crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Document, FilterQuery, Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as configConstants from "@/shared/constants/configConstants";
import stateOfX from '@/shared/constants/StateOfX';
import keySets from '@/shared/constants/keysDictionaryWeb';
import popupTextManager from '@/shared/constants/popupTextManager';
import { sendMailWithHtmlVerify } from '@/v1/controller/scratchCard/sendMail';

@Injectable()
export class UserService extends CrudService<any> {
  constructor(
    @InjectDBModel(DBModel.User)
    protected readonly model: Model<any>,
    @InjectAdminModel(AdminDBModel.Affiliates)
    protected readonly adminModel: Model<any>,
  ) {
    super(model);
  }

  addInstantBonusAmount(query, updateData) {
    return this.model
      .findOneAndUpdate(query, updateData, {
        returnOriginal: true,
        projection: {
          isParentUserName: 1,
          userName: 1,
          emailId: 1,
          playerId: 1,
          instantBonusAmount: 1,
          realChips: 1,
          statistics: 1,
          mobileNumber: 1,
        },
      })
      .exec();
  }

  findPlayer (query) {
    console.log("inside findPlayer", query);
    const newQuery: any = {};
    const skip = query.skip || 0;
    const limit = query.limit || 0;

    if (query._id) {
      newQuery._id = parseStringToObjectId(query._id);
    }
    if (query.userName && !query._id) {
      newQuery.isParentUserName = eval('/^' + query.userName + '$/i');
    }

    if (query.userId) {
      newQuery.userName = eval('/^' + query.userId + '$/i');
    }
    if (query.email) {
      newQuery.emailId = eval('/^' + query.email + '$/i');
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
      if (query.status === "all") {
        
      } else {
        newQuery.status = query.status;
      }
    }
    if (newQuery.isOrganic == 'All') {
      delete newQuery.isOrganic;
    }
    if (query.isParentUserName) {
      newQuery.isParentUserName = eval('/^' + query.isParentUserName + '$/i');
    }
    console.log("newQuery: ", newQuery);
    return this.model
      .find(newQuery)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  findAllPlayers(query) {
    console.log('inside findAllPlayers ------ ', query);
    const newQuery: any = {};
    const skip = query.skip || 0;
    const limit = query.limit || 0;

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
      if (query.status === "all") {
        
      } else {
        newQuery.status = query.status;
      }
    }
    if (newQuery.isOrganic == 'All') {
      delete newQuery.isOrganic;
    }
    if (query.isParentUserName) {
      newQuery.isParentUserName = eval('/^' + query.isParentUserName + '$/i');
    }
    console.log("newQuery: ", newQuery);
    return this.model.aggregate([
      { $match: newQuery},
      { $lookup:
        {
          from: 'users',
          localField: 'sponserId',
          foreignField: 'userName',
          as: 'sponser'
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
          $skip: skip
      },
      {
          $limit: limit
      }
    ])
    // return this.model
    //   .find(newQuery)
    //   .skip(skip)
    //   .limit(limit)
    //   .sort({ createdAt: -1 });
  }

  findAllPlayersCount(query) {
    console.log("inside findAllPlayersSelectedData ------ ", query);
    return this.model.count(query);
  }

  updateUser(query, updateKeys) {
    console.log(
      'in update user in dbQuery - ' +
        JSON.stringify(query) +
        JSON.stringify(updateKeys),
    );
    return this.model.updateOne(query, updateKeys);
  }

  addRealChips(filter, chips) {
    let instantIBA = 0;
    if (filter.instantBonusAmount >= 0) {
      instantIBA = filter.instantBonusAmount;
      delete filter.instantBonusAmount;
    }
    console.log(
      'filter--' +
        JSON.stringify(filter) +
        'chips--' +
        chips +
        'instantbonus-' +
        instantIBA,
    );
    return this.model.findOneAndUpdate(
      filter,
      { $inc: { realChips: chips, instantBonusAmount: instantIBA } },
      { new: true, returnOriginal: false },
    );
  }

  addChipsInPlayerDeposit(
    filter: {
      userName: string;
    },
    chips,
  ) {
    return this.model
      .findOneAndUpdate(filter, { $inc: { 'chipsManagement.deposit': chips } })
      .exec();
  }

  deductRealChips(filter: FilterQuery<any>, chips, instantBonusAmount = 0) {
    return this.model.findOneAndUpdate(
      filter,
      { $inc: { realChips: -chips, instantBonusAmount: -instantBonusAmount } },
      { new: true, returnOriginal: false },
    );
  }

  async getWithdrawlProfileforPlayer(userId) {
    return this.model.findOne({ playerId: userId });
  }

  getUserList(query, currentpage, pagelimit) {
    const userdata: any = {};
    if (query.role !== 'admin') {
      userdata.isParent = query.isParent;
    }
    return this.model
      .find({ ...query, ...userdata })
      .skip(pagelimit * (currentpage - 1))
      .sort({ userName: 1 })
      .limit(pagelimit);
  }

  // FIX - play money to real money - DONE // was doubt - difficult to estimate
  // updateUser(query, updateKeys) {
  //   console.log('in update user in dbQuery - ' + JSON.stringify(query) + JSON.stringify(updateKeys));
  //   return this.model.update(query, { $set: updateKeys });
  // }

  updatePlayer(id, data) {
    return this.model.updateOne(
      { _id: parseStringToObjectId(id) },
      { $set: data },
    );
  }

  countPlayers(query) {
    console.log('inside  countPlayer dbQuery ', query);
    const newQuery: any = {};
    if (query.userName) {
      newQuery.userName = query.userName;
    }
    if (query.isParentUserName) {
      newQuery.isParentUserName = query.isParentUserName;
    }
    return this.model.count(newQuery);
  }

  getPlayerTotalRealOrInstantChipsAvailable(query) {
    return this.model.aggregate([
      { $match: query },
      {
        $group: {
          _id: '_id',
          totalPlayerInstantChips: { $sum: '$instantBonusAmount' },
          totalPlayerRealChips: { $sum: '$realChips' },
        },
      },
    ]);
  }

  updateUserBalance(userdata, playerId) {
    return this.model.findOneAndUpdate(
      { playerId: playerId },
      { $inc: { realChips: parseInt(userdata.fundTransferAmount) } },
    );
  }

  findAndModifyUser(query, updateKeys) {
    console.log('query is ', query);
    console.log('updateKeys is ', updateKeys);
    return this.model.findOneAndUpdate(
      query,
      { $set: updateKeys },
      { new: true },
    );
  }

  getPlayersCount(query) {
    console.log('inside get getPlayersCount,,, ', query);
    var newQuery: any = {};
    if (query.parentUserName) {
      newQuery.isParentUserName = eval('/^' + query.parentUserName + '$/i');
      console.log('here in dbquery parentusername-------->', query);
    }

    if (query.userName) {
      newQuery.isParentUserName = query.userName;
    }
    if (query.status) {
      console.log('here 123');
      newQuery.status = query.status;
    }
    if (query.promoBonusAwarded == true) {
      newQuery.promoBonusAwarded = query.promoBonusAwarded;
    }
    if (query.promoBonusAwarded == false) {
      newQuery.promoBonusAwarded = null;
    }
    if (query.userId) {
      newQuery.userName = eval('/^' + query.userId + '$/i');
    }
    if (query.emailId) {
      newQuery.emailId = eval('/' + query.emailId + '/i');
    }
    if (query.email) {
      newQuery.emailId = eval('/' + query.email + '/i');
    }
    if (query.parent) {
      newQuery.isParentUserName = eval('/' + query.parent + '/i');
    }

    if (query.isOrganic) {
      newQuery.isOrganic = query.isOrganic;
    }
    if (newQuery.isOrganic == 'All') {
      delete newQuery.isOrganic;
    }
    if (query.isParentUserName) {
      newQuery.isParentUserName = eval('/' + query.isParentUserName + '/i');
    }

    console.log('newQuery db query in count player ', newQuery);

    return this.model.count(newQuery);
    // mongodb.db.collection('users').count(newQuery, function (err, result) {
    //   console.log(" count of number of players.... ", JSON.stringify(result));
    //   cb(err, result);
    // });
  }

  findAgentPlayerChips (query) {
    console.log('inside findAgentPlayerChips', query);
    return this.model.aggregate([
      { $match: query },
      {
        $group:
          { _id: "_id", totalReal: { $sum: "$realChips" }, totalInstant: { $sum: "$instantBonusAmount" } }
      }]);
  }

  listOneAffiliate (params) {
    console.log("inside listOneAffiliate: ", params);
    var query: any = {};
    if (params.roleName && params.roleName.length > 0) {
      query["role.name"] = params.roleName;
      query["role.level"] = 0;
      query.skip = params.skip;
      query.limit = params.limit;
    }

    if (params.userName) {
      query.userName = params.userName
    }
    
    console.log("query: ", query);
    return this.adminModel.find(query);
  }
}
