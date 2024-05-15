import { CrudService } from '@/core/services/crud/crud.service';
import {
  AdminDBModel,
  InjectAdminModel,
} from '@/database/connections/admin-db';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserService } from '../user/user.service';
import { CreatePlayerPassbookDto } from './dto/create-player-passbook.dto';
import { UpdatePlayerPassbookDto } from './dto/update-player-passbook.dto';
import { PassbookData } from './entities/player-passbook.entity';

@Injectable()
export class PlayerPassbookService extends CrudService {
  constructor(
    @InjectAdminModel(AdminDBModel.Passbook)
    protected readonly model: Model<any>,
    @Inject(UserService)
    protected readonly userService: UserService,
  ) {
    super(model);
  }

  // query to create passbook entry of particular player
  createPassbookEntry(query, data: PassbookData) {
    return this.model
      .update(query, { $push: { history: data } }, { upsert: true })
      .exec();
  }

  getPlayerPassbookCount(query: any) {
    console.log("inside getPlayerPassbookCount: ", JSON.stringify(query));

    return this.model.aggregate([{
      $match: { "playerId": query.playerId }
    },
    {
      $project: {
        history: {
          $filter: {
            input: "$history",
            as: "item",
            cond: {
              $and: query.queryCond
            }
          }
        },
        "playerId": 1
      }
    }
    ])
  }

  async checkPlayerWithUsername(params) {
    try {
      if (!params.userName) {
        throw new HttpException('Kindly provide player username to search!!', 404);
      } else {
        const query = { userName: eval('/^' + params.userName + '$/i') }
        const result = await this.userService.findOne(query);
        if (result) {
          params.playerId = result.playerId;
          params.playerUserName = result.userName;
          return params;
        } else {
          throw new HttpException('No Such Player Exist!', 404);
        }
      }
    } catch (e) {
      throw new HttpException('No Such Player Exist!', 404);
    }
  }
  async countAndListDataForPlayerPassbook(params) {
    console.log("Inside countAndListDataForPlayerPassbook params-->", params);
    let query: any = {};
    if (params.playerId) {
      query.playerId = params.playerId;
    }
    query.startDate = params.startDate;
    query.endDate = params.endDate;
    query.queryCond = [{ $gte: ["$$item.time", query.startDate] }, { $lte: ["$$item.time", query.endDate] }];
    if (params.tableName) query.queryCond.push({ $eq: [params.tableName, "$$item.tableName"] });
    if (params.transactionCategory) query.queryCond.push({ $eq: [params.transactionCategory, "$$item.category"] });
    if (params.transactionSubCategory) query.queryCond.push({ $eq: [params.transactionSubCategory, "$$item.subCategory"] });
    console.log("query123-->", query);
    const countRecords = await this.getPlayerPassbookCount(query);
    if (countRecords?.length > 0) {
      console.log("countRecords-->", countRecords);
      if (params.playerUserName) {
        console.log("vao day ===========");
        
        countRecords[0].userName = params.playerUserName;
      }
      console.log("countRecordsRéult ", countRecords);
      return countRecords;
    } else {
      throw new HttpException('No data found', 404);
    }
  }

  async countDataForPlayerPassbook(params) {
    await this.checkPlayerWithUsername(params);
    const result = await this.countAndListDataForPlayerPassbook(params);
    return result;
  }
}
