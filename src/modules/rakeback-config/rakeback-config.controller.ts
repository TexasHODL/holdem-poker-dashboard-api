import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { RakebackConfigService } from './rakeback-config.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('')
export class RakebackConfigController {
    constructor(private readonly rakebackConfigService: RakebackConfigService) {}

    @Get('listRakeBack')
    listRakeBack() {
       return this.rakebackConfigService.listRakeBack() 
    }

    @Post('editRakeback')
    editRakeback (@Body() dto: any) {
        return this.rakebackConfigService.editRakeback(dto)
    }
}