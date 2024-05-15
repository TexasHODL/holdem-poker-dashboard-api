import { CrudService } from '@/core/services/crud/crud.service'
import {
  AdminDBModel,
  InjectAdminModel,
} from '@/database/connections/admin-db'
import { parseStringToObjectId } from '@/shared/helpers/mongoose'
import { BadRequestException, Injectable } from '@nestjs/common'
import { FilterQuery, Model } from 'mongoose'
import { encrypt } from '@/v1/helpers/crypto'
import _ from 'underscore'
import { PokerDBModel } from '@/database/connections/constants'
import { InjectDBModel } from '@/database/connections/db'

@Injectable()
export class AffiliateService extends CrudService {
  constructor(
    @InjectAdminModel(AdminDBModel.Affiliates)
    protected readonly model: Model<any>,
    @InjectDBModel(PokerDBModel.User)
    protected readonly user: Model<any>,
  ) {
    super(model)
  }

  addRealChipstoAffiliate(filter: FilterQuery<any>, chips) {
    return this.model.update(filter, { $inc: { realChips: chips } }).exec()
  }

  deductRealChipsFromAffiliateFundTransfer(filter, chips) {
    console.log('filter chips', filter, chips)
    return this.model.updateOne(filter, { $inc: { realChips: -chips } }).exec()
  }

  updateDeposit(params, query) {
    console.log('The params in updateDeposit is------ ', params)
    return this.model.update(params, query).exec()
  }

  getWithdrawlProfileforAffiliate(userId) {
    return this.model.findOne({ _id: parseStringToObjectId(userId) })
  }

  async chkUsername(params) {
    const res = await this.model.count(params)
    return res
  }

  getAffiliateUser(userData) {
    return this.model.find(userData)
  }

  getSubAffiliate(params, pagelimit, currentpage) {
    const query: any = {}
    query.role = 'sub-affiliate'
    if (params.role === 'affiliate') {
      query.isParent = params.isParent
    }
    console.log(
      'in db query role' +
        JSON.stringify(params) +
        'pagelimit' +
        pagelimit +
        'currentpage' +
        currentpage,
    )
    return this.model
      .find(query)
      .skip(pagelimit * (currentpage - 1))
      .limit(pagelimit)
  }

  getAffiliateList(query) {
    return this.model.find(query)
  }

  getAffiliateListSelectedData(query, projectionData) {
    let skip = query.skip
    let limit = query.limit
    delete query.skip
    delete query.limit
    if (query.userName) {
      skip = 0
      limit = 0
    }
    return this.model.find(query, projectionData).skip(skip).limit(limit)
  }

  deleteAffiliate(id) {
    return this.model.deleteOne({ _id: parseStringToObjectId(id) })
  }

  getAdminList() {
    // console.log('get admin list' + JSON.stringify(query));
    return this.model.find({ role: 'admin', adminRoles: { $exists: true } })
  }

  async insertAffiliate(params) {
    console.log('affiliateController.insertAffiliate hit!!', params)
    if (
      !params.email ||
      !params.password ||
      !params.module ||
      !params.role ||
      !params.name
    ) {
      throw new BadRequestException(
        'One of the field is empty or all field empty!! Please check.',
      )
    }
    const encrypted = encrypt(params.password)
    if (encrypted.success) {
      params.password = encrypted.result
      const data = await this.model.findOne({ email: params.email })
      if (data) {
        throw new BadRequestException('Email already exist!!')
      }
      const result = await this.model.create(params)
      return {
        success: true,
        result: result,
        info: 'Successfully create affiliate test',
      }
    } else {
      throw new BadRequestException('Unable to decode password')
    }
  }

  getUserAvailableRakeData(query) {
    console.log('Inside getUserAvailableRakeData db query -->', query)
    return this.model.aggregate([
      {
        $match: {
          $and: [
            { 'role.name': { $ne: 'admin' } },
            { 'role.name': { $ne: 'General Manager' } },
            { 'role.name': { $ne: 'Director' } },
          ],
        },
      },
      {
        $group: { _id: '$role.name', totalAvailableRake: { $sum: '$profit' } },
      },
    ])
  }

  getUsersForRakeGeneratedData(query) {
    console.log('Inside getUsersForRakeGeneratedData db query -->', query)
    return this.model.aggregate([
      {
        $match: {
          $and: [
            { 'role.name': { $ne: 'admin' } },
            { 'role.name': { $ne: 'General Manager' } },
            { 'role.name': { $ne: 'Director' } },
          ],
        },
      },
      { $group: { _id: '$role.name', userDetails: { $push: '$userName' } } },
    ])
  }

  /**
   * this  api is used to update user info
   * @method updateUser
   * @return {object}       a json object with success and user info result
   */
  // userManagementController.updateUser
  async updateUser(params) {
    console.log("inside updateUser ", params)
    if (
      !params.password ||
      !params.role ||
      !params.module ||
      !params.name ||
      !params.reportingTo ||
      !params.userName
    ) {
      // res.json({
      //   success: false,
      //   info: 'One of the field is empty or all field empty!! Please check.',
      // });
      throw new BadRequestException(
        'One of the field is empty or all field empty!! Please check.',
      )
    }
    if (params.module.length == 0) {
      // res.json({
      //   success: false,
      //   info: 'User cannot be created with no module access.',
      // });
      throw new BadRequestException(
        'User cannot be created with no module access.',
      )
    }
    var encrypted = encrypt(params.password)
    if (encrypted.success) {
      params.password = encrypted.result
      const data: any = await this.findOne({
        userName: eval('/^' + params.reportingTo + '$/i'),
      })
      if (!data) {
        throw new BadRequestException('Unable to get reporting manager data.')
      }
      var tempArr = _.intersection(params.module, data.module)
      console.log('line 323== ', tempArr)
      console.log('check==', _.isEqual(tempArr, params.module))

      if (
        params.role.level < data.role.level &&
        (_.isEqual(tempArr, params.module) || data.role.level >= 6)
      ) {
        var id = params._id
        delete params._id

        var query = {
          userName: eval('/^' + params.userName + '$/i'),
        }

        const data: any = (await this.findOne(query))?.toObject()
        if (data && id != data._id.toString()) {
          var count = 0
          var info = ''
          if (data.userName.toUpperCase() === params.userName.toUpperCase()) {
            info += ++count + '. Login Id already exist!! '
          }
          throw new BadRequestException(info)
        } else {
          const data = await this.getAllAffiliates({
            reportingTo: params.userName,
            'role.level': {
              $gte: params.role.level,
            },
          })

          if (data && data.length > 0) {
            throw new BadRequestException(
              'This user already has other users of higher department reporting to him/her. Unable to update',
            )
          } else {
            const result = await this.updateteAffiliate(params, id)
            console.log('Admin Successfully Created')
            return result
          }
        }
      } else {
        throw new BadRequestException(
          'This user cannot be created under the specified reporting manager.',
        )
      }
    } else {
      throw new BadRequestException('Unable to decode password')
    }
  }

  // async updateAffiliate(params) {
  //   console.log("inside updateAffiliate ", params);
  //   if (
  //     !params.password ||
  //     !params.role ||
  //     !params.module ||
  //     !params.name ||
  //     !params.reportingTo ||
  //     !params.userName
  //   ) {
  //     // res.json({
  //     //   success: false,
  //     //   info: 'One of the field is empty or all field empty!! Please check.',
  //     // });
  //     throw new BadRequestException(
  //       'One of the field is empty or all field empty!! Please check.',
  //     );
  //   }
  //   if (params.module.length == 0) {
  //     // res.json({
  //     //   success: false,
  //     //   info: 'User cannot be created with no module access.',
  //     // });
  //     throw new BadRequestException(
  //       'User cannot be created with no module access.',
  //     );
  //   }
  //   var encrypted = encrypt(params.password);
  //   if (encrypted.success) {
  //     params.password = encrypted.result;
  //     const data: any = await this.findOne({
  //       userName: eval('/^' + params.reportingTo + '$/i'),
  //     });
  //     if (!data) {
  //       throw new BadRequestException('Unable to get reporting manager data.');
  //     }
  //     var tempArr = _.intersection(params.module, data.module);
  //     console.log('line 323== ', tempArr);
  //     console.log('check==', _.isEqual(tempArr, params.module));

  //     if (
  //       params.role.level < data.role.level &&
  //       (_.isEqual(tempArr, params.module) || data.role.level >= 6)
  //     ) {
  //       var id = params._id;
  //       delete params._id;

  //       var query = {
  //         userName: eval('/^' + params.userName + '$/i'),
  //       };

  //       const data: any = (await this.findOne(query))?.toObject();
  //       if (data && id != data._id.toString()) {
  //         var count = 0;
  //         var info = '';
  //         if (data.userName.toUpperCase() === params.userName.toUpperCase()) {
  //           info += ++count + '. Login Id already exist!! ';
  //         }
  //         throw new BadRequestException(info);
  //       } else {
  //         const data = await this.getAllAffiliates({
  //           reportingTo: params.userName,
  //           'role.level': {
  //             $gte: params.role.level,
  //           },
  //         });

  //         if (data && data.length > 0) {
  //           throw new BadRequestException(
  //             'This user already has other users of higher department reporting to him/her. Unable to update',
  //           );
  //         } else {
  //           const result = await this.updateteAffiliate(params, id);
  //           console.log('Admin Successfully Created');
  //           return result;
  //         }
  //       }
  //     } else {
  //       throw new BadRequestException(
  //         'This user cannot be created under the specified reporting manager.',
  //       );
  //     }
  //   } else {
  //     throw new BadRequestException('Unable to decode password');
  //   }
  // }

  async getAllAffiliates(query) {
    var skipValue = query.skip || 0
    var limitValue = query.limit || 0
    delete query.skip
    delete query.limit
    const result = await this.model
      .find(query)
      .skip(skipValue)
      .limit(limitValue)
      .sort({ createdAt: -1 })
    return result.map(function (item) {
      if (item.profit) {
        item.profit = parseFloat(item.profit.toFixed(2))
      }
      return item
    })
  }

  updateteAffiliate(userData, userid) {
    return this.update(userid, { $set: userData })
  }

  async updateAffiliate(params) {
    console.log('updateAffiliate ---------hit', params)
    await this.checkAffiliateExists(params)
    await this.checkSubaffiliateRakeCommission(params)
    await this.checkPlayerRakeBack(params)
    return await this.updateAffiliateInfo(params)
    // async.waterfall(
    //   [
    //     async.apply(checkAffiliateExists, req.body),
    //     checkSubaffiliateRakeCommission,
    //     checkPlayerRakeBack,
    //     updateAffiliateInfo,
    //   ],
    //   function (err, result) {
    //     console.log(err, result);
    //     if (err) {
    //       return res.json({ success: false, info: err.info });
    //     } else {
    //       return res.json({
    //         success: true,
    //         info: "Successfully create affiliate test",
    //       });
    //     }
    //   }
    // );
  }

  async checkAffiliateExists(params) {
    var id = params._id
    var query = { userName: eval('/^' + params.userName + '$/i') }
    const data: any = await this.findOne(query)
    if (data && id !== data._id.toString()) {
      var count = 0
      var info = ''
      if (data.userName.toUpperCase() === params.userName.toUpperCase()) {
        info += ++count + '. Login Id already exist!! '
      }
      throw new BadRequestException(info)
      // callback({ success: false, info: info });
    }
  }

  async checkSubaffiliateRakeCommission(params) {
    var query: any = {}
    query.parentUser = eval('/^' + params.userName + '$/i')
    query.rakeCommision = { $gte: params.rakeCommision }
    const result = await this.count(query)
    if (result == 0) {
      return params
    }
    throw new BadRequestException(
      'Rake Commission% is less than/equal to its Sub-affiliates',
    )
  }

  async checkPlayerRakeBack(params) {
    var query: any = {}
    query.isParentUserName = eval('/^' + params.userName + '$/i')
    query.rakeBack = { $gte: params.rakeCommision }
    const result = await this.user.count(query)
    if (result == 0) {
      return params
    } else if (result > 0) {
      throw new BadRequestException(
        'Rake Commission% is less than/equal to its Players',
      )
    }
  }

  async updateAffiliateInfo(params) {
    const id = params._id
    delete params._id
    params.password = encrypt(params.password).result
    console.log('------------------------------------', params)
    const result = await this.updateteAffiliate(params, id)
    return result
    // admindb.updateteAffiliate(params, id, function (err, result) {
    //   if (err) {
    //     callback({
    //       success: false,
    //       info: "Something went wrong!! unable to create admin",
    //     });
    //   } else {
    //     console.log("Admin Successfully Created");
    //     callback(null, params);
    //   }
    // });
  }

  async updateSubAffiliate(params) {
    console.log('affiliateController.updateSubAffiliate hit!!', params)
    var id = params._id
    delete params._id
    params.password = encrypt(params.password).result
    params.parentUser = eval('/^' + params.parentUser + '$/i')
    const result: any = await this.findOne({ userName: params.parentUser })
    console.log("result==== ", result)
    if (!result) {
      throw new BadRequestException('Parent user does not exists.')
    }

    if (params.role.name == 'newsubAffiliate') {
      if (result.role.name == 'affiliate') {
        throw new BadRequestException('Parent must be Affiliate')
      }
    } else {
      if (result.role.name == 'newaffiliate') {
        throw new BadRequestException('Parent must be Agent.')
      }
    }
    params.parentName = result.name
    params.parentUser = result.userName
    if (result.role.level > -1 && result.status == 'Active') {
      if (result.rakeCommision <= params.rakeCommision) {
        throw new BadRequestException(
          'Rake Commission percent of Sub-Affiliate is greater/equal to Affiliate',
        )
      }
      let checkTempArr2nd
      var tempArr = _.intersection(params.module, result.module)
      console.log("tempArr: ", tempArr)
      var difference = _.difference(params.module, result.module)
      if (difference.length > 0) {
        var tempArr2nd = _.intersection(params.module, difference)
        console.log("tempArr2nd: ", tempArr2nd)
        if (tempArr2nd.length > 0) {
          checkTempArr2nd = tempArr2nd
        }
      }
      console.log('difference == ', difference)
      console.log('line 2213== ', tempArr)
      console.log('check==', _.isEqual(tempArr, params.module))
      console.log("_.isEqual(checkTempArr2nd, params.module): ", _.isEqual(checkTempArr2nd, params.module));
      console.log(" tempArr.length > 0: ",  tempArr.length > 0);
      if (
        _.isEqual(tempArr, params.module) ||
        _.indexOf(difference, '2005') > -1 ||
        _.isEqual(checkTempArr2nd, params.module) ||
        tempArr.length > 0
      ) {
        var query: any = {
          userName: eval('/^' + params.userName + '$/i'),
        }

        const data: any = await this.findOne(query)
        console.log("data: ", data);
        if (data && id !== data._id.toString()) {
          var count = 0
          var info = ''
          // if (data.userName.toUpperCase() === params.userName.toUpperCase()) {
          //   info += ++count + '. Login Id already exist!! '
          // }
          // throw new BadRequestException(info)
        }
        var query1: any = {}
        query1.isParentUserName = eval('/^' + params.userName + '$/i')
        query1.rakeBack = {
          $gte: params.rakeCommision,
        }
        console.log('\n\n\n\n\n---------------------------------', query1)

        const result1 = await this.user.count(query1)
        if (result1 > 0) {
          throw new BadRequestException(
            'Rake Commission% is less than/equal to its Players',
          )
        }
        return await this.updateteAffiliate(params, id)
      } else {
        throw new BadRequestException(
          'Sub-affiliate cannot have more access than parent affiliate.',
        )
      }
    } else {
      throw new BadRequestException('Parent not found.')
    }
  }

  getAffiliateCount(query) {
    return this.model.count(query)
  }

  updateteAffiliateCashout(userData, query) {
    return this.model.findOneAndUpdate(query, { $set: userData }, { new: true })
  }

  updateModuleAff(params) {
    return this.model.update({ userName: params.userName }, { $set: { module: params.module } }, { new : true })
  }
}
