import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { getAllModules, getModuleListAdmin } from '@/v1/controller/modules/moduleAdmin';
import {
  checkUserSessionInDb,
  countUsers,
  createUser,
  listUser,
  removeLoggedInAffiliates,
} from '@/v1/controller/auth/userController';
import { CheckUserSessionDto } from './dto/CheckUserSessionDto';
import { ListUsersDto } from './dto/ListUsersDto';
import { GetListUserDto } from './dto/getUserListDto';
@ApiTags('User Management')
@ApiBearerAuth()
@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('getModuleList')
  getModuleList() {
    return getAllModules();
  }

  @Post('getModuleListAdmin')
  getModuleListAdmin() {
    return getModuleListAdmin();
  }

  @Post('checkUserSessionInDb')
  checkUserSessionInDb(@Req() req, @Body() dto: CheckUserSessionDto) {
    return checkUserSessionInDb(req);
  }

  @Post('createUser')
  createUser (@Req() req, @Body() dto: CreateUserDto) {
    return createUser(req);
  }

  @Post('listUser')
  listUser(@Req() req, @Body() dto: ListUsersDto) {
    return listUser(req);
  }

  @Post('countUsers')
  countUsers(@Req() req, @Body() dto: ListUsersDto) {
    return countUsers(req);
  }

  @Post('getUserList')
  getUserList(@Body() dto: GetListUserDto) {
    return this.userService
      .getUserList(dto, dto.currentpage, dto.pagelimit)
      .then((result) => ({ data: result }));
  }

  @Post('countUserList')
  countUserList(@Body() dto: any) {
    return this.userService.count(dto);
  }

  @Post('updateuserdata')
  updateuserdata(@Body() dto: any) {
    const { playerId, ...body } = dto;
    return this.userService.updateUser({ playerId }, body);
  }
  @Post('disableOrEnablePlayerChat')
  disableOrEnablePlayerChat(@Body() dto: any) {
    const { ...body } = dto;
    let updateData = {};
    if(body.adminChat != "" || body.adminChat != null){
      updateData["settings.adminChat"] = body.adminChat;
    }
    return this.userService.updateUser({ _id: body.id }, updateData);
  }

}
