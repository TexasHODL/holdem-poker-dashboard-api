import {
  affiliateCount,
  createNewAffiliate,
  createSubAffiliate,
  listAffiliate,
  listOneAffiliate,
  listSubAffiliate,
  subAffiliateCount,
  listAffiliateWithUserName
} from '@/v1/controller/auth/userController';
import { getModuleListAff, getModuleListSubAff, getModuleListNewAff, getModuleListNewSupAff, getModuleAff } from '@/v1/controller/modules/moduleAffiliates';
import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { distinct } from 'rxjs';
import { CreateNewAffiliateDto } from './dto/createNewAffiliateDto';
import { CreateSubAffiliateDto } from './dto/createSubAffiliateDto';
import { DeleteAffiliateDto } from './dto/deleteAffiliateDto';
import { GetSubAffiliateUserDto } from './dto/getSubAffiliateUserDto';
import { ListAffiliateDto } from './dto/listAffiliateDto';
import { AffiliateService } from './services/affiliate/affiliate.service';
import { UserService } from './user.service';
@ApiTags('User Management')
@ApiBearerAuth()
@Controller('')
export class AffiliateController {
  constructor(
    private readonly affiliateService: AffiliateService,
    private readonly userService: UserService,
  ) {}

  @Post('getModuleListAff')
  getModuleListAff() {
    return getModuleListAff();
  }

  @Post('getModuleListSubAff')
  getModuleListSubAff () {
    return getModuleListSubAff();
  }

  @Post('getModuleListNewAff')
  getModuleListNewAff () {
    return getModuleListNewAff();
  }

  @Post('getModuleListNewSupAff')
  getModuleListNewSupAff () {
    return getModuleListNewSupAff();
  }

  @Post('getModuleAff')
  getModuleAff () {
    return getModuleAff();
  }

  @Post('createNewAffiliate')
  createNewAffiliate(@Req() req, @Body() dto: CreateNewAffiliateDto) {
    return createNewAffiliate(req);
  }

  @Post('createSubAffiliate')
  createSubAffiliate(@Req() req, @Body() dto: CreateSubAffiliateDto) {
    return createSubAffiliate(req);
  }

  @Post('listAffiliate')
  listAffiliate(@Req() req, @Body() dto: ListAffiliateDto) {
    return listAffiliate(req);
  }

  @Post('listOneAffiliate')
  listOneAffiliate(@Req() req, @Body() dto: ListAffiliateDto) {
    return listOneAffiliate(req);
  }

  @Post('listAffiliateWithUserName')
  listAffiliateWithUserName (@Req() req, @Body() dot: ListAffiliateDto) {
    return listAffiliateWithUserName(req);
  }

  @Post('listOneAgen')
  async listOneAgen (@Body() dto: any) {
    const res = await this.userService.listOneAffiliate(dto)
    return { data: res, result: true };
  }

  @Post('listAgentPlayerChips')
  async listAgentPlayerChips (@Body() dto: any) {
    const res = await this.userService.findAgentPlayerChips(dto);
    return { data: res, result: true };
  }

  @Post('listSubAffiliate')
  listSubAffiliate(@Req() req, @Body() dto: ListAffiliateDto) {
    return listSubAffiliate(req);
  }

  @Post('getAffiliateCount')
  getAffiliateCount(@Req() req, @Body() dto: ListAffiliateDto) {
    return affiliateCount(req);
  }

  @Post('getSubAffiliateCount')
  getSubAffiliateCount(@Req() req, @Body() dto: ListAffiliateDto) {
    return subAffiliateCount(req);
  }

  @Post('chkUsername')
  async chkUsername(@Body() dto: any) {
    const res = await this.affiliateService.chkUsername(dto);
    return { data: res, result: true };
  }

  @Post('getAffiliateUser')
  async getAffiliateUser(@Body() dto: any) {
    const result = await this.affiliateService.chkUsername(dto);
    return { data: result, result: true };
  }

  @Post('getSubAffiliateUser')
  async getSubAffiliateUser(@Body() dto: GetSubAffiliateUserDto) {
    const result = await this.affiliateService.getSubAffiliate(
      dto,
      dto.pagelimit,
      dto.currentpage,
    );
    return result;
  }

  @Post('coutnAffiliate')
  async coutnAffiliate(@Body() dto: any) {
    const result = await this.affiliateService.count(dto);
    return result;
  }

  @Post('deleteAffiliate')
  async deleteAffiliate(@Body() dto: DeleteAffiliateDto) {
    const result = await this.affiliateService.deleteAffiliate(dto._id);
    return { data: result, result: true };
  }

  @Post('getAdminList')
  async getAdminList(@Body() dto: any) {
    const result = await this.affiliateService.getAdminList();
    return result;
  }

  @Post('getaffiliatesubaffiliateList')
  getaffiliatesubaffiliateList() {
    return this.affiliateService.findAll({
      role: { $in: ['affiliate', 'sub-affiliate'] },
    });
  }

  @Post('insertAffiliate')
  insertAffiliate(@Body() dto: CreateNewAffiliateDto) {
    return this.affiliateService.insertAffiliate(dto);
  }

  @Post('updateUserInfo')
  updateUserInfo(@Body() dto: any) {
    return this.affiliateService.updateUser(dto);
  }

  // @Post('updateAffiliate')
  // updateAffiliate(@Body() dto: any) {
  //   return this.affiliateService.updateUser(dto);
  // }

  @Post('updateAffiliate')
  updateAffiliate(@Body() dto: any) {
    return this.affiliateService.updateAffiliate(dto);
  }

  @Post('updateSubAffiliate')
  updateSubAffiliate(@Body() dto: any) {
    return this.affiliateService.updateSubAffiliate(dto);
  }

  @Post('updateModuleAff')
  updateModuleAff (@Body() dto: any) {
    console.log("vao day");
    
    return this.affiliateService.updateModuleAff(dto);
  }
}
