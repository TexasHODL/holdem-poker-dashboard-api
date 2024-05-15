import { app } from "@/configs/app";
import { CrudService } from "@/core/services/crud/crud.service";
import { InMemoryDBModel, LogDBModel } from "@/database/connections/constants";
import { DBModel, InjectDBModel } from "@/database/connections/db";
import { InjectInMemoryModel } from "@/database/connections/in-memory-db";
import { parseStringToObjectId } from "@/shared/helpers/mongoose";
import { MailService } from "@/shared/services/mail/mail.service";
import { SocketClientService } from "@/shared/services/socket-client/socket-client.service";
import { BadRequestException, HttpException, Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { CreateTableDto } from "./dto/create-table.dto";
import { ListTableDto } from "./dto/listTableDto";
import { UpdateTableDto } from "./dto/update-table.dto";
import { tools } from "@/configs/tools";
import { InjectLogModel } from "@/database/connections/log-db";
import pomelo_client from "pomelo-node-client-websocket";
import { RequestDataService } from "@/shared/services/request-data/request-data.service";
import axios from "axios";

@Injectable()
export class TableService extends CrudService {
  constructor(
    @InjectDBModel(DBModel.Table)
    protected readonly model: Model<any>,
    @InjectInMemoryModel(InMemoryDBModel.Table)
    protected readonly inMemoryModel: Model<any>,
    protected socket: SocketClientService,
    protected requestData: RequestDataService,
    @InjectLogModel(LogDBModel.TableUpdateRecord)
    protected readonly logTableUpdateRecordModel: Model<any>,
    @InjectLogModel(LogDBModel.HandHistory)
    protected readonly logTableHanHistoryModel: Model<any>
  ) {
    super(model);
  }

  async createTable(params: any) {
    console.log("inside createTable: ", params);
    params.isActive = true;
    params.channelType = "NORMAL";
    params.isPotLimit = JSON.parse(params.isPotLimit);
    params.isRealMoney = JSON.parse(params.isRealMoney);
    params.isStraddleEnable = JSON.parse(params.isStraddleEnable);
    params.totalGame = 0;
    params.totalPot = 0;
    params.avgPot = 0;
    params.totalPlayer = 0;
    params.totalFlopPlayer = 0;
    params.avgFlopPercent = 0;
    params.totalStack = 0;
    params.blindMissed = app.BLIND_MISSED;
    params.gameInfoString = params.gameInfoString;
    params.createdAt = Number(new Date());
    console.log("paramscreateTable", params);
    const res = await this.model.create(params);
    this.informPlayer(res, "addTable");
    return {
      authToken: params.authToken,
      table: res,
    };
    // this.model.create(
    //   params,
    //   function (err, result) {
    //     console.log(
    //       "created table is - ",
    //       JSON.stringify(result)
    //     );
    //     if (err) {
    //       console.log(err);
    //       return res.json({
    //         success: false,
    //         info: "Something went wrong!! unable to create",
    //         rTL: false,
    //         authToken: req.params.authToken,
    //       });
    //     } else {
    //       informPlayer(result.ops[0], "addTable");
    //       return res.json({
    //         success: true,
    //         info: "Successfully created !!",
    //         rTL: false,
    //         authToken: req.params.authToken,
    //         table: result.ops[0],
    //       });
    //     }
    //   }
    // );
  }

  async updateTable(params, ip, userAgent) {
    console.log("updateTable: ", params);
    params.updatedByRole = JSON.parse(params.updatedByRole);
    params.updatedFromIp = ip;
    // params.updatedFromIp = req.connection.remoteAddress.substring(
    //      req.connection.remoteAddress.lastIndexOf(":") + 1
    // );
    // params.updatedFromDevice = req.header("user-agent");
    params.updatedFromDevice = userAgent;

    await this.checkRunningTable(params);
    await this.findExistingTableData(params);
    await this.updateTableDataAndBroadcast(params);
    await this.removeTableFromImdb(params);
    await this.getNewTableData(params);
    const data = await this.assignRemainingKeys(params);
    return await this.saveUpdateRecord(data);
    // async.waterfall(
    //   [
    //     async.apply(checkRunningTable, params),
    //     findExistingTableData,
    //     updateTableDataAndBroadcast,
    //     removeTableFromImdb,
    //     getNewTableData,
    //     assignRemainingKeys,
    //     saveUpdateRecord,
    //   ],
    //   function (err, result) {
    //     if (err) {
    //       console.log("err in updateTable ", err);
    //       res.send({ success: false, info: err.info });
    //     } else {
    //       console.log("result in updateTable ", result);
    //       res.send({ success: true, result: result });
    //     }
    //   }
    // );
  }

  async checkRunningTable(params) {
    const query: any = {};
    query.channelId = params._id.toString();
    const res = await this.inMemoryModel.find(query);
    if (res && res.length > 0) {
      throw new BadRequestException("Game is running on this table!");
    }
    return res;
    // imdb.findRunningTable(query, function (err, result) {
    //      if (!err && result) {
    //           if (result.length > 0) {
    //                cb({
    //                     success: false,
    //                     info: "Game is running on this table!",
    //                     rTL: false,
    //                     authToken: params.authToken,
    //                });
    //           } else {
    //                cb(null, params);
    //           }
    //      } else {
    //           cb({ success: false, info: "Unable to fetch data from IMDB" });
    //      }
    // });
  }

  async findExistingTableData(params) {
    const res = await this.findById(parseStringToObjectId(params._id));
    params.existingTableData = res;
    return res;
    // db.findTableById(params._id, function (err, result) {
    //   if (!err && result) {
    //     params.existingTableData = result;
    //     cb(null, params);
    //   } else {
    //     cb({
    //       success: false,
    //       info: "Unable to find existing table data!",
    //     });
    //   }
    // });
  }

  async updateTableDataAndBroadcast(params) {
    console.log("\n\n\nInside updateTableDataAndBroadcast ", params);
    const id = params._id;
    delete params._id;
    params.isPotLimit = JSON.parse(params.isPotLimit);
    params.isRealMoney = JSON.parse(params.isRealMoney);
    params.isStraddleEnable = JSON.parse(params.isStraddleEnable);
    params.blindMissed = app.BLIND_MISSED;
    params.gameInfoString = params.gameInfoString;
    params.updatedAt = Number(new Date());
    await this.model.updateOne(
      { _id: parseStringToObjectId(id) },
      { $set: params }
    );
    params._id = id;

    console.log("co qua day khong");

    // this.informPlayer(params, 'tableUpdate');
    return params;
    // validateKeySets(
    //   "Request",
    //   "table",
    //   "updateTable",
    //   params,
    //   function (validated) {
    //     if (validated.success) {
    //       var id = params._id;
    //       delete params._id;
    //       params.isPotLimit = JSON.parse(
    //         params.isPotLimit
    //       );
    //       params.isRealMoney = JSON.parse(
    //         params.isRealMoney
    //       );
    //       params.isStraddleEnable = JSON.parse(
    //         params.isStraddleEnable
    //       );
    //       params.blindMissed = configConstants.BLIND_MISSED;
    //       params.gameInfoString = params.gameInfoString;
    //       params.updatedAt = Number(new Date());
    //       db.updateTable(
    //         id,
    //         params,
    //         function (err, result) {
    //           console.log(
    //             "update table log line 152==",
    //             err,
    //             result
    //           );
    //           if (err) {
    //             console.log(err);
    //             cb({
    //               success: false,
    //               info: "Something went wrong!! unable to update",
    //               rTL: false,
    //               authToken: params.authToken,
    //             });
    //           } else {
    //             params._id = id;
    //             informPlayer(
    //               params,
    //               "tableUpdate"
    //             );
    //             cb(null, params);
    //           }
    //         }
    //       );
    //     } else {
    //       cb({
    //         success: false,
    //         info: validated.info,
    //         rTL: false,
    //         authToken: params.authToken,
    //       });
    //     }
    //   }
    // );
  }

  removeTableFromImdb(params) {
    const query: any = {};
    query.channelId = params._id.toString();
    return this.inMemoryModel.remove(query);
    // imdb.removeTable(query, function (err, result) {
    //      cb(null, params);
    // });
  }

  async getNewTableData(params) {
    const res = await this.model.findById(params._id);
    if (!res) {
      throw new BadRequestException("Unable to find existing table data!");
    }
    params.updateTableData = res;
    // return res;
    // db.findTableById(params._id, function (err, result) {
    //   if (!err && result) {
    //     cb(null, params);
    //   } else {
    //     cb({
    //       success: false,
    //       info: "Unable to find existing table data!",
    //     });
    //   }
    // });
  }

  assignRemainingKeys(params) {
    console.log("\n\n\ninside assignRemainingKeys ", params);
    const data: any = {};
    data.existingTableData = params.existingTableData;
    data.updateTableData = params.updateTableData;
    data.channelId = params.updateTableData._id.toString();
    data.createdAt = Number(new Date());
    data.updatedBy = params.updateTableData.updatedBy;
    data.updatedByRole = params.updatedByRole;
    data.updatedFromIp = params.updatedFromIp;
    data.updatedFromDevice = params.updatedFromDevice;
    let updateFieldsString = "";

    if (
      params.existingTableData["channelName"] !=
      params.updateTableData["channelName"]
    ) {
      updateFieldsString = updateFieldsString + "Table Name, ";
    }
    if (
      params.existingTableData["channelVariation"] !=
      params.updateTableData["channelVariation"]
    ) {
      updateFieldsString = updateFieldsString + "Game Variation, ";
    }
    if (
      params.existingTableData["isRunItTwice"] !=
      params.updateTableData["isRunItTwice"]
    ) {
      updateFieldsString = updateFieldsString + "Is Run It Twice, ";
    }
    if (
      params.existingTableData["isRealMoney"] !=
      params.updateTableData["isRealMoney"]
    ) {
      updateFieldsString = updateFieldsString + "Chips Type, ";
    }
    if (
      params.existingTableData["isPotLimit"] !=
      params.updateTableData["isPotLimit"]
    ) {
      updateFieldsString = updateFieldsString + "Stakes, ";
    }
    if (
      params.existingTableData["smallBlind"] !=
      params.updateTableData["smallBlind"]
    ) {
      updateFieldsString = updateFieldsString + "Small Blind, ";
    }
    if (
      params.existingTableData["bigBlind"] != params.updateTableData["bigBlind"]
    ) {
      updateFieldsString = updateFieldsString + "Big Blind, ";
    }
    if (
      params.existingTableData.rake.rakePercentTwo !=
      params.updateTableData.rake.rakePercentTwo
    ) {
      updateFieldsString = updateFieldsString + "Rake (%) 2 Player, ";
    }
    if (
      params.existingTableData.rake.rakePercentThreeFour !=
      params.updateTableData.rake.rakePercentThreeFour
    ) {
      updateFieldsString = updateFieldsString + "Rake (%) 3-4 Player, ";
    }
    if (
      params.existingTableData.rake.rakePercentMoreThanFive !=
      params.updateTableData.rake.rakePercentMoreThanFive
    ) {
      updateFieldsString = updateFieldsString + "Rake (%) 5+ Player, ";
    }
    if (
      params.existingTableData.rake.capTwo != params.updateTableData.rake.capTwo
    ) {
      updateFieldsString = updateFieldsString + "Cap 2 players, ";
    }
    if (
      params.existingTableData.rake.capThreeFour !=
      params.updateTableData.rake.capThreeFour
    ) {
      updateFieldsString = updateFieldsString + "Cap 3-4 players, ";
    }
    if (
      params.existingTableData.rake.capMoreThanFive !=
      params.updateTableData.rake.capMoreThanFive
    ) {
      updateFieldsString = updateFieldsString + "Cap 5+ players, ";
    }
    if (
      params.existingTableData["maxPlayers"] !=
      params.updateTableData["maxPlayers"]
    ) {
      updateFieldsString = updateFieldsString + "Players on table, ";
    }
    if (
      params.existingTableData["minBuyIn"] != params.updateTableData["minBuyIn"]
    ) {
      updateFieldsString = updateFieldsString + "Min. Buy-In, ";
    }
    if (
      params.existingTableData["maxBuyIn"] != params.updateTableData["maxBuyIn"]
    ) {
      updateFieldsString = updateFieldsString + "Max. Buy-In, ";
    }
    if (
      params.existingTableData["isStraddleEnable"] !=
      params.updateTableData["isStraddleEnable"]
    ) {
      updateFieldsString = updateFieldsString + "Straddle, ";
    }
    if (
      params.existingTableData["turnTime"] != params.updateTableData["turnTime"]
    ) {
      updateFieldsString = updateFieldsString + "Turn Time(sec.), ";
    }
    if (
      params.existingTableData["isPrivateTabel"] !=
      params.updateTableData["isPrivateTabel"]
    ) {
      updateFieldsString = updateFieldsString + "Private Table, ";
    }

    data.updateFieldsString = updateFieldsString.substring(
      0,
      updateFieldsString.length - 2
    );
    return data;
  }

  async saveUpdateRecord(data) {
    const res = await this.logTableUpdateRecordModel.create(data);
    if (!res) {
      throw new HttpException("Unable to save table update record", 500);
    }
    return res;
    // logdb.saveTableUpdateRecord(data, function (err, result) {
    //   if (!err && result) {
    //     cb(null, data);
    //   } else {
    //     cb({
    //       success: false,
    //       info: "Unable to save table update record",
    //     });
    //   }
    // });
  }

  cashGamesChangedData(data) {
    return {
      _id: data._id,
      updated: {
        isRealMoney: data.isRealMoney,
        channelName: data.channelName,
        turnTime: data.turnTime,
        maxPlayers: data.maxPlayers,
        smallBlind: data.smallBlind,
        bigBlind: data.bigBlind,
        minBuyIn: data.minBuyIn,
        maxBuyIn: data.maxBuyIn,
        channelVariation: data.channelVariation,
        minPlayers: data.minPlayers,
        favourite: data.favourite,
        channelType: data.channelType,
        isPrivateTabel: data.isPrivateTabel,
        isRunItTwice: data.isRunItTwice || false,
        avgStack: data.avgStack || 0,
        flopPercent: data.flopPercent || 0,
        isPotLimit: data.isPotLimit,
        playingPlayers: data.playingPlayers || 0,
        queuePlayers: data.queuePlayers || 0,
      },
      event: tools.event.cashGameTableChange,
    };
  }

  informPlayer(data, route) {
    const table = this.cashGamesChangedData(data);
    return this.requestData
      .requestData("POST", "/broadcastToCreateTable", {
        data: table,
        route: route,
      })
      .then((response: any) => {
        console.log("response: ", response);
        if (JSON.parse(response.result).success === true) {
          return true;
        }
      });
    // return this.socket.send(route, table);
    // console.log("data in informPlayer is - " + JSON.stringify(data));
    // console.log("rootTools.connectorHost - " + rootTools.connectorHost);
    // pomelo.init(
    //   {
    //     host: rootTools.connectorHost,
    //     port: rootTools.connectorPort,
    //     log: true,
    //   },
    //   function () {
    //     var table = cashGamesChangedData(data);
    //     console.log("tournament data is - " + JSON.stringify(table));
    //     pomelo.request(
    //       "connector.entryHandler.broadcastPlayers",
    //       { data: table, route: route },
    //       function (err, data) {
    //         console.log("line 301", err, data);
    //         pomelo.disconnect();
    //       }
    //     );
    //   }
    // );
  }

  async disableTable(params: any) {
    console.log("Inside disableTable", JSON.stringify(params));
    const query: any = {};
    query.channelId = params.id.toString();
    const res = await this.inMemoryModel.find(query);
    if (res && res.length > 0) {
      throw new BadRequestException("Game is running on this table!");
    }

    const id = params.id;
    delete params.id;
    await this.model.updateOne(
      { _id: parseStringToObjectId(id) },
      { $set: params }
    );

    if (params.isActive) {
      console.log("going to activate table");
      const table = await this.model.findById(id);
      if (table) {
        return {
          info: "Successfully updated !!",
          table: table,
        };
      }
      throw new BadRequestException("Something wrong in getting table from db");
    } else {
      this.disableTableBroadcast({
        route: "removeTable",
        tableId: query.channelId,
        event: "DISABLETABLE",
      });
      return {
        success: true,
        info: "Successfully updated !!",
        // rTL: false,
        // authToken: params.authToken,
      };
      // return res.json({
      //   success: true,
      //   info: "Successfully updated !!",
      //   rTL: false,
      //   authToken:
      //     params
      //       .authToken,
      // });
    }

    // imdb.findRunningTable(query, function (err, result) {
    //   console.log("err, result in imdb disable====", err, result);
    //   if (!err && result) {
    //     if (result.length > 0) {
    //       return res.json({
    //         success: false,
    //         info: "Game is running on this table!",
    //         rTL: false,
    //         authToken: params.authToken,
    //       });
    //     } else {
    //       validateKeySets(
    //         "Request",
    //         "table",
    //         "disableTable",
    //         params,
    //         function (validated) {
    //           if (validated.success) {
    //             var id = params.id;
    //             delete params.id;
    //             db.updateTable(
    //               id,
    //               params,
    //               function (err, result) {
    //                 if (err) {
    //                   console.log(err);
    //                   return res.json({
    //                     success: false,
    //                     info: "Something went wrong!! unable to update",
    //                     rTL: false,
    //                     authToken:
    //                       params.authToken,
    //                   });
    //                 } else {
    //                   if (params.isActive) {
    //                     console.log(
    //                       "going to activate table"
    //                     );
    //                     db.findTableById(
    //                       params.id,
    //                       function (
    //                         err,
    //                         table
    //                       ) {
    //                         console.log(
    //                           "getting table from db is - " +
    //                           JSON.stringify(
    //                             table
    //                           )
    //                         );
    //                         if (
    //                           !err &&
    //                           !!table
    //                         ) {
    //                           console.log(
    //                             table
    //                           );
    //                           informPlayer(
    //                             table,
    //                             "addTable"
    //                           );
    //                           return res.json(
    //                             {
    //                               success: true,
    //                               info: "Successfully updated !!",
    //                               rTL: false,
    //                               authToken:
    //                                 req
    //                                   .body
    //                                   .authToken,
    //                               table: table,
    //                             }
    //                           );
    //                         } else {
    //                           return res.json(
    //                             {
    //                               success: false,
    //                               info: "Something wrong in getting table from db",
    //                               rTL: false,
    //                               authToken:
    //                                 req
    //                                   .body
    //                                   .authToken,
    //                             }
    //                           );
    //                         }
    //                       }
    //                     );
    //                   } else {
    //                     disableTableBroadcast({
    //                       route: "removeTable",
    //                       tableId: query.channelId,
    //                       event: "DISABLETABLE",
    //                     });
    //                     return res.json({
    //                       success: true,
    //                       info: "Successfully updated !!",
    //                       rTL: false,
    //                       authToken:
    //                         params
    //                           .authToken,
    //                     });
    //                   }
    //                 }
    //               }
    //             );
    //           } else {
    //             return res.json({
    //               success: false,
    //               info: validated.info,
    //               rTL: false,
    //               authToken: params.authToken,
    //             });
    //           }
    //         }
    //       );
    //     }
    //   } else {
    //     return res.json({
    //       success: false,
    //       info: validated.info,
    //       rTL: false,
    //       authToken: params.authToken,
    //     });
    //   }
    // });
  }

  disableTableBroadcast(broadcastData) {
    return this.socket.send(broadcastData.route, {
      event: broadcastData.event,
      _id: broadcastData.tableId,
    });
  }

  async listTable(params: any) {
    console.log("inside listTable: ", params);
    let query: any = {};
    if (params.channelVariation) {
      query = {
        channelType: params.channelType,
        channelVariation: params.channelVariation,
      };
    } else {
      query = {
        channelType: params.channelType,
        channelVariation: {
          $ne: "Open Face Chinese Poker",
        },
      };
    }
    if (params._id) {
      query._id = parseStringToObjectId(params._id);
    }
    if (params.channelName) {
      query.channelName = eval("/" + params.channelName + "/i");
    }
    if (params.channelVariation) {
      query.channelVariation = params.channelVariation;
    }
    if (
      params.isPrivateTabel === true ||
      (params.isPrivateTabel === false && params.isPrivateTabel !== "All")
    ) {
      query.isPrivateTabel = params.isPrivateTabel;
    }
    if (params.isActive != undefined) {
      query.isActive = params.isActive;
    }
    // if (params.chipsType != undefined) {
    //   query.isRealMoney = params.isRealMoney;
    // }

    if (params.minSmallBlind && !params.maxSmallBlind) {
      query.smallBlind = { $gte: params.minSmallBlind };
    }

    if (!params.minSmallBlind && params.maxSmallBlind) {
      query.smallBlind = { $lte: params.maxSmallBlind };
    }

    if (params.minSmallBlind && params.maxSmallBlind) {
      query.smallBlind = {
        $gte: params.minSmallBlind,
        $lte: params.maxSmallBlind,
      };
    }

    if (params.minBuyInMin && !params.minBuyInMax) {
      query.minBuyIn = { $gte: params.minBuyInMin };
    }

    if (!params.minBuyInMin && params.minBuyInMax) {
      query.minBuyIn = { $lte: params.minBuyInMax };
    }

    if (params.minBuyInMin && params.minBuyInMax) {
      query.minBuyIn = {
        $gte: params.minBuyInMin,
        $lte: params.minBuyInMax,
      };
    }

    if (params.minPlayerLimit && !params.maxPlayerLimit) {
      query.maxPlayers = { $gte: params.minPlayerLimit };
    }

    if (!params.minPlayerLimit && params.maxPlayerLimit) {
      query.maxPlayers = { $lte: params.maxPlayerLimit };
    }

    if (params.minPlayerLimit && params.maxPlayerLimit) {
      query.maxPlayers = {
        $gte: params.minPlayerLimit,
        $lte: params.maxPlayerLimit,
      };
    }
    if (params.turnTime) {
      query.turnTime = params.turnTime;
    }
    if (params.isRealMoney != undefined) {
      query.isRealMoney = params.isRealMoney;
    }

    // query.skip = params.skip;
    // query.limit = params.limit;
    console.log("lines 386", JSON.stringify(query));

    if (query.channelType == "TOURNAMENT") {
      // mongodb.db.collection('tournamentroom').find(query).skip(skip).limit(limit).toArray(function (err, result) {
      //     callback(err, result);
      // });
      return [];
    } else {
      // return this.model
      //   .find(query)
      //   .skip(params.skip || 0)
      //   .limit(params.limit || 0)
      //   .sort({ createdAt: -1 });
      // mongodb.db.collection('tables').find(query).skip(skip).limit(limit).toArray(function (err, result) {
      //     callback(err, result);
      // });
      const table = await this.model
        .find(query)
        .skip(params.skip || 0)
        .limit(params.limit || 0)
        .sort({ createdAt: -1 })
        .exec();
      return await this.checkLastPlayed(table);
    }
    // db.listTable(query, function (err, result) {
    //   if (err) {
    //     console.log(err);
    //     return res.json({
    //       success: false,
    //       info: "Something went wrong!! unable to get table",
    //       rTL: false,
    //       authToken: params.authToken,
    //     });
    //   } else {
    //     return res.json({
    //       success: true,
    //       result: result,
    //       rTL: false,
    //       authToken: params.authToken,
    //     });
    //   }
    // });
  }

  async checkLastPlayed(table: any) {
    const data = [];
    for (const item of table) {
      const findTableById: any = await this.model.findById(item._id);
      if (
        findTableById.isPrivateTabel === "true" ||
        findTableById.isPrivateTabel === true
      ) {
        const checkTableRunning = await this.logTableHanHistoryModel.aggregate([
          {
            $match: { channelId: findTableById._id.toString() },
          },
          { $sort: { finishedAt: -1 } },
          { $group: { _id: "$channelId", data: { $first: "$$ROOT" } } },
          { $replaceRoot: { newRoot: "$data" } },
        ]);

        if (checkTableRunning.length > 0) {
          var dataTable = await this.checkTheExpiredTableISO(
            checkTableRunning[0].finishedAt,
            item
          );
          if (dataTable) {
            const dataPush = {
              ...item._doc,
              lastPlayed: checkTableRunning[0].finishedA,
            };
            data.push(dataPush);
          }
        } else {
          var dataTable = await this.checkTheExpiredTableString(
            item.createdAt,
            item
          );
          if (dataTable) {
            const dataPush = { ...item._doc, lastPlayed: item.createdAt };
            data.push(dataPush);
          }
        }
      } else {
        const dataPush = { ...item._doc, lastPlayed: findTableById.createdAt };
        data.push(dataPush);
      }
    }
    return data;
  }

  async formatDateDifferenceString(dateString, table) {
    const date: any = new Date(dateString);

    const currentDate: any = new Date();

    const timeDifference = currentDate - date;

    if (timeDifference > 3600000) {
      console.log("True");
      const removeTable = await this.model.findByIdAndDelete(table._id).exec();
      if (removeTable) {
        return {};
      }
    } else {
      console.log("False");
      return table;
    }
  }

  async lastPlayedString(dateString, table) {
    const dateDifference = await this.formatDateDifferenceString(
      dateString,
      table
    );
    return dateDifference;
  }

  async checkTheExpiredTableString(dateString, table) {
    var checkDate = await this.lastPlayedString(dateString, table);
    return checkDate;
  }

  async checkTheExpiredTableISO(dateString, table) {
    var checkDate = await this.lastPlayedISO(dateString, table);
    return checkDate;
  }

  async lastPlayedISO(dateString, table) {
    var dateDifference = await this.formatDateDifferenceISO(dateString, table);
    return dateDifference;
  }

  async formatDateDifferenceISO(dateString, table) {
    const date: any = new Date(dateString);

    const currentDate: any = new Date();

    const timeDifference = currentDate - date;

    if (timeDifference > 3600000) {
      console.log("True");
      const removeTable = await this.model.findByIdAndRemove(table._id).exec();
      if (removeTable) {
        return {};
      }
    } else {
      console.log("False");
      return table;
    }
  }

  countlistTable(params) {
    let query: any = {};
    if (params.channelVariation) {
      query = {
        channelType: params.channelType,
        channelVariation: params.channelVariation,
      };
    } else {
      query = {
        channelType: params.channelType,
        channelVariation: {
          $ne: "Open Face Chinese Poker",
        },
      };
    }
    if (params._id) {
      query._id = parseStringToObjectId(params._id);
    }
    if (params.channelName) {
      query.channelName = eval("/" + params.channelName + "/i");
    }
    if (params.channelVariation) {
      query.channelVariation = params.channelVariation;
    }
    if (
      params.isPrivateTabel ||
      (params.isPrivateTabel === false && params.isPrivateTabel !== "All")
    ) {
      query.isPrivateTabel = params.isPrivateTabel;
    }
    if (params.isActive) {
      if (params.isActive == "true") {
        query.isActive = true;
      }
      if (params.isActive == "false") {
        query.isActive = false;
      }
    }

    if (params.minSmallBlind && !params.maxSmallBlind) {
      query.smallBlind = { $gte: params.minSmallBlind };
    }

    if (!params.minSmallBlind && params.maxSmallBlind) {
      query.smallBlind = { $lte: params.maxSmallBlind };
    }

    if (params.minSmallBlind && params.maxSmallBlind) {
      query.smallBlind = {
        $gte: params.minSmallBlind,
        $lte: params.maxSmallBlind,
      };
    }

    if (params.minBuyInMin && !params.minBuyInMax) {
      query.minBuyIn = { $gte: params.minBuyInMin };
    }

    if (!params.minBuyInMin && params.minBuyInMax) {
      query.minBuyIn = { $lte: params.minBuyInMax };
    }

    if (params.minBuyInMin && params.minBuyInMax) {
      query.minBuyIn = {
        $gte: params.minBuyInMin,
        $lte: params.minBuyInMax,
      };
    }

    if (params.minPlayerLimit && !params.maxPlayerLimit) {
      query.maxPlayers = { $gte: params.minPlayerLimit };
    }

    if (!params.minPlayerLimit && params.maxPlayerLimit) {
      query.maxPlayers = { $lte: params.maxPlayerLimit };
    }

    if (params.minPlayerLimit && params.maxPlayerLimit) {
      query.maxPlayers = {
        $gte: params.minPlayerLimit,
        $lte: params.maxPlayerLimit,
      };
    }

    if (params.turnTime) {
      query.turnTime = params.turnTime;
    }
    if (params.isRealMoney) {
      query.isRealMoney = JSON.parse(params.isRealMoney);
    }

    console.log("lines 481", JSON.stringify(query));
    return this.model.count(query);
    // db.countlistTable(query, function (err, result) {
    //   if (err) {
    //     console.log(err);
    //     return res.json({
    //       success: false,
    //       info: "Something went wrong!! unable to get table",
    //       rTL: false,
    //       authToken: params.authToken,
    //     });
    //   } else {
    //     return res.json({
    //       success: true,
    //       result: result,
    //       rTL: false,
    //       authToken: params.authToken,
    //     });
    //   }
    // });
  }

  // findAll() {
  //   return `This action returns all table`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} table`;
  // }

  // update(id: number, updateTableDto: UpdateTableDto) {
  //   return `This action updates a #${id} table`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} table`;
  // }

  getPlayerTotalChipsOnTable(query) {
    console.log("Inside getPlayerTotalChipsOnTable db query -->", query);
    return this.inMemoryModel.aggregate([
      { $unwind: "$players" },
      {
        $group: {
          _id: "_id",
          totalChips: { $sum: "$players.chips" },
          totalInstantChips: { $sum: "$players.instantBonusAmount" },
        },
      },
    ]);
  }

  getPotAmountOnAllTables(query) {
    console.log("Inside getPotAmountOnAllTables db query -->", query);
    return this.inMemoryModel.aggregate([
      { $unwind: "$pot" },
      {
        $group: {
          _id: "_id",
          totalPotAmountOnAllTables: { $sum: "$pot.amount" },
        },
      },
    ]);
  }

  getTotalRoundBetAmountInGame(query) {
    console.log("Inside getTotalRoundBetAmountInGame db query -->", query);
    return this.inMemoryModel.aggregate([
      { $unwind: "$roundBets" },
      { $group: { _id: "_id", totalRoundBets: { $sum: "$roundBets" } } },
    ]);
  }

  revertTable(params) {
    console.log("Inside revertTable1141111", JSON.stringify(params));
    let apiRoute = "";
    if (params.revertAndRemove) {
      apiRoute = "room.channelHandler.revertLockedTableAndRemove";
    } else {
      apiRoute = "room.channelHandler.revertLockedTable";
    }
    let dataSend = {
      apiRoute,
      channelId: params._id,
      force: true,
      isAutoMove: params.isAutoMove,
    };
    // return this.socket.send(apiRoute, { channelId: params._id, force: true });
    return this.requestData
      .requestData("POST", "/revert", dataSend)
      .then((response: any) => {
        const responseData = JSON.parse(response.result);
        if (responseData.success === true) {
          console.log("responseData.data: ", responseData.data);
          return responseData.data;
        } else {
          return false;
        }
      })
      .catch((err) => {
        console.log("err", err);
        return false;
      });

    // let pomelo = pomelo_client.create();
    // pomelo.init(
    //   {
    //     host: "localhost",
    //     port: 4005,
    //     log: true,
    //   },
    //   function () {
    //     console.log(" params is - " + JSON.stringify(params));
    //     var apiRoute = "";
    //     if (params.revertAndRemove) {
    //       apiRoute = "room.channelHandler.revertLockedTableAndRemove";
    //     } else {
    //       apiRoute = "room.channelHandler.revertLockedTable";
    //     }
    //     pomelo.request(
    //       apiRoute,
    //       { channelId: params._id, force: true },
    //       function (data) {
    //         console.log("response data", data);
    //         pomelo.disconnect();
    //         res.json(data);
    //       }
    //     );
    //   }
    // );
  }

  async findTableUpdateRecords(params: any) {
    console.log("\n\n\nInside findTableUpdateRecords ", params);
    // if (!params.startDate || !params.endDate || !params.channelId) {
    //   throw new BadRequestException('Missing keys');
    // }
    let query: any = {};
    query.channelId = params.channelId;
    if (!!query.startDate && !!query.endDate) {
      query.createdAt = { $gte: params.startDate, $lt: params.endDate };
    }
    // query.skip = params.skip;
    // query.limit = params.limit;
    return this.logTableUpdateRecordModel
      .find(query)
      .skip(params.skip || 0)
      .limit(params.limit || 0);
    // logdb.getTableUpdateRecords(query, function (err, result) {
    //   console.log("err, result ", err, result);
    //   if (!err && result) {
    //     if (result.length > 0) {
    //       res.send({ success: true, result: result });
    //     } else {
    //       res.send({ success: false, info: "No data found" });
    //     }
    //   } else {
    //     res.send({ success: false, info: "Error getting data" });
    //   }
    // });
  }

  findTableRecords(params) {
    console.log("inside findTableRecords", params);

    let query: any = {};
    query._id = params._id;

    return this.logTableUpdateRecordModel.find(query);
  }

  countTableUpdateRecords(params) {
    console.log("\n\n\nInside countTableUpdateRecords ", params);
    // if (!params.startDate || !params.endDate || !params.channelId) {
    //   throw new BadRequestException('Missing keys');
    // }
    const query: any = {};
    query.channelId = params.channelId;
    if (!!query.startDate && !!query.endDate) {
      query.createdAt = { $gte: params.startDate, $lt: params.endDate };
    }
    return this.logTableUpdateRecordModel.count(query);
    // logdb.getTableUpdateRecordsCount(query, function (err, result) {
    //      if (!err && result) {
    //           res.send({ success: true, result: result });
    //      } else {
    //           res.send({ success: false, info: "Error getting data count" });
    //      }
    // });
  }
  async getAllCashTables(query) {
    let skip = query.skip || 0;
    let limit = query.limit || 0;
    delete query.skip;
    delete query.limit;
    return this.model.find(query).skip(skip).limit(limit).sort({ _id: -1 });
  }

  findTable(query) {
    var skip = query.skip || 0;
    var limit = query.limit || 0;
    delete query.skip;
    delete query.limit;
    return this.model.find(query).skip(skip).limit(limit).sort({ _id: -1 });
  }
}
