import { InjectDBModel } from './../../database/connections/db';
import { PokerDBModel } from '@/database/connections/constants';
import { CrudService } from '@/core/services/crud/crud.service';
import { HttpException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class ChatService extends CrudService<any>{
  constructor(
    @InjectDBModel(PokerDBModel.PlayerChat)
    protected readonly model: Model<any>,
  ) {
    super(model);
  }

  async getPlayerChat(params: any) {
    let query = { playerName: eval('/^' + params.playerName + '$/i') };
    const result = (await this.findAll(query)).map(item => item.toObject());
    if (!!result && result.length > 0) {
      return result;
    } else {
      throw new HttpException('No player chat found', 404);
    }
  }

  async countChatHistory(params: any) {
    if (!params.channelId || params.channelId == null || params.channelId == undefined) {
      throw new HttpException('Table not found !!', 404);
    } else {
      let startDate, endDate;
      let query: any = {};
      // if (!params.startDate && !params.endDate) {
      //   endDate = Number(new Date());
      //   startDate = endDate - (24 * 60 * 60 * 1000);
      //   query.time = { $gte: startDate, $lt: endDate };
      // }
      if (params.startDate && params.endDate) {
        query.time = { $gte: params.startDate, $lt: params.endDate };
      }
      if (params.startDate && !params.endDate) {
        query.time = { $gte: params.startDate };
      }
      if (!params.startDate && params.endDate) {
        query.time = { $lt: params.endDate };
      }
      query.channelId = params.channelId;
      console.log(query)
      const result = await this.count(query);
      console.log(result)
      if (result) {
        return result
      } else {
        throw new HttpException('No records found!!', 404);
      }
    }
  }
  async listChatHistory(params){
    console.log("inside listChatHistory: ", params);
    let startDate, endDate;
    let query: any = {};
    // if (!params.startDate && !params.endDate) {
    //   endDate = Number(new Date());
    //   startDate = endDate - (24 * 60 * 60 * 1000);
    //   query.time = { $gte: startDate, $lt: endDate };
    // }
    if (params.startDate && params.endDate) {
      query.time = { $gte: params.startDate, $lt: params.endDate };
    }
    if (params.startDate && !params.endDate) {
      query.time = { $gte: params.startDate };
    }
    if (!params.startDate && params.endDate) {
      query.time = { $lt: params.endDate };
    }
    if (params.channelId) {
      query.channelId = params.channelId;
    }
    let skip = params.skip || 0;
    let limit = params.limit || 0;
    console.log("list chat db query -->", query);
    const result = await this.findAll(query).limit(limit).skip(skip);
    if (result) {
      return result
    } else {
      throw new HttpException('No records found!!', 404);
    }
    // if (!params.channelId || params.channelId == null || params.channelId == undefined) {
    //   // throw new HttpException('Table not found !!', 404);
    // } else {
    //   let startDate, endDate;
    //   let query: any = {};
    //   // if (!params.startDate && !params.endDate) {
    //   //   endDate = Number(new Date());
    //   //   startDate = endDate - (24 * 60 * 60 * 1000);
    //   //   query.time = { $gte: startDate, $lt: endDate };
    //   // }
    //   if (params.startDate && params.endDate) {
    //     query.time = { $gte: params.startDate, $lt: params.endDate };
    //   }
    //   if (params.startDate && !params.endDate) {
    //     query.time = { $gte: params.startDate };
    //   }
    //   if (!params.startDate && params.endDate) {
    //     query.time = { $lt: params.endDate };
    //   }
    //   query.channelId = params.channelId;
    //   let skip = params.skip || 0;
    //   let limit = params.limit || 0;
    //   console.log("list chat db query -->", query);
    //   const result = await this.findAll(query).limit(limit).skip(skip);
    //   if (result) {
    //     return result
    //   } else {
    //     throw new HttpException('No records found!!', 404);
    //   }
    // }
  }
}
