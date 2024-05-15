import { parseStringToObjectId } from '@/shared/helpers/mongoose';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PlayerBuildAccessDto } from './dto/player-build-access.dto';
import { UpdatePlayerBuildAcessDto } from './dto/update-player-build-access.dto';

@Injectable()
export class PlayerBuildAccessService {
  constructor(
    @Inject(UserService)
    protected readonly userService: UserService,
  ) {}

  async listPlayerDetails(params: PlayerBuildAccessDto) {
    console.log('inside listPlayerDetails', params);
    // let query = {};
    // let result = [];
    // if (req.body.userName) {
    //   query.userName = eval('/^' + req.body.userName + '$/i');
    // }
    // if (req.body.email) {
    //   query.emailId = eval('/' + req.body.email + '/i');
    // }
    // if (req.body.mobile) {
    //   query.mobileNumber = req.body.mobile;
    // }
    // console.log("query==========", query);
    // db.findUser(query, function (err, player) {
    //   console.log("err , res--", err, player);
    //   if (!err && player) {
    //     result[0] = player;
    //     if (result[0].status != "Active") return res.json({ success: false, info: "Player has been blocked !!" })
    //     else return res.json({ success: true, result: result });
    //   } else {
    //     if (player == null) return res.json({ success: false, info: "No player found!!" })
    //     else return res.json({ success: false, info: 'Unable to get player details from database' });
    //   }
    // });
    const query: any = {};
    const result: any = [];
    if (params.userName) {
      query.userName = eval('/^' + params.userName + '$/i');
    }
    if (params.email) {
      query.emailId = eval('/' + params.email + '/i');
    }
    if (params.mobile) {
      query.mobileNumber = params.mobile;
    }
    console.log('query==========', query);
    const user = await this.userService.findOne(query);

    if (!user) {
      throw new NotFoundException('No player found!!');
    }
    result[0] = user;

    if (result[0].status !== 'Active') {
      throw new BadRequestException('Player has been blocked !!');
    }

    return result;
  }

  async updatePlayerBuildAccess(params: UpdatePlayerBuildAcessDto) {
    console.log('inside updatePlayerBuildAcess', params);
    // var query = {}, updateQuery = {};

    // query._id = ObjectID(req.body._id);
    // updateQuery.buildAccess = req.body.buildAccess;
    // console.log("query for update ==========", query);
    // if (!req.body._id) {
    //   return res.json({ success: false, info: 'Unable to update player details in database' });
    // }
    // db.updateUser(query, updateQuery, function (err, result) {
    //   console.log("err , res--", err, result);
    //   if (!err) {
    //     return res.json({ success: true, result: result });
    //   } else {
    //     return res.json({ success: false, info: 'Unable to update player details in database' });
    //   }
    // });
    const query: any = {};
    const updateQuery: any = {};
    query._id = parseStringToObjectId(params._id);
    updateQuery.buildAccess = params.buildAccess;
    console.log('query for update ==========', query);
    return await this.userService.updateUser(query, updateQuery);
  }
}
