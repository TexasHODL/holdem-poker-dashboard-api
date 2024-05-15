import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { ChipsService } from './chips.service';
import { FundTransferAffiliateHistoryDto } from './dto/fundTransferAffiliateHistoryDto';
import { FundTransferPlayerHistoryDto } from './dto/fundTransferPlayerHistoryDto';
import { TransferChipAffiliateToPlayerDto } from './dto/transfer-chip-affilate-to-player-dto';
import { TransferChipDto } from './dto/transfer-chip.dto';
import { TransferFundChipsToAffiliateDto } from './dto/transferFundChipsToAffiliateDto';
import { TransferFundChipsToSubAffiliateDto } from './dto/transferFundChipsToSubAffiliateDto';
import { UpdateChipDto } from './dto/update-chip.dto';
import { WithdrawChipDto } from './dto/withdraw-chip-dto';
import { WithdrawChipAdminDto } from './dto/withdrawChipsAdminDto';
import { ChipsTransferHistoryService } from './services/chips-transfer-history/chips-transfer-history.service';
import { ChipsTransferService } from './services/chips-transfer/chips-transfer.service';
import { TransferToPlayerHistoryService } from './services/transfer-to-player-history/transfer-to-player-history.service';

@ApiTags('Chips Management')
@ApiBearerAuth()
@Controller('')
export class ChipsController {
  constructor(
    private readonly auth: AuthService,
    private readonly chipsService: ChipsService,
    private readonly chipsTransferService: ChipsTransferService,
    private readonly chipsTransferHistoryService: ChipsTransferHistoryService,
    private readonly transferToPlayerHistoryService: TransferToPlayerHistoryService,
  ) {}

  @Post('transferFundChips')
  transferFundChips(@Body() dto: TransferChipDto) {
    return this.chipsTransferService.transferChips(dto);
  }

  @Post('withdrawChips')
  withdrawChips(@Body() dto: WithdrawChipDto) {
    return this.chipsTransferService.withdrawChips(dto);
  }

  @Post('transferChipsByAffiliateToPlayer')
  transferChipsByAffiliateToPlayer(
    @Body() dto: TransferChipAffiliateToPlayerDto,
  ) {
    return this.chipsTransferService.transferChipsByAffiliateToPlayer(dto);
  }

  @Post('fundTransferAffiliateHistory')
  fundTransferAffiliateHistory(@Body() dto: FundTransferAffiliateHistoryDto) {
    return this.chipsTransferHistoryService.fundTransferAffiliateHistory(dto);
  }

  @Post('fundTransferPlayerHistory')
  fundTransferPlayerHistory(@Body() dto: FundTransferPlayerHistoryDto) {
    return this.chipsTransferHistoryService.fundTransferPlayerHistory(dto);
  }

  @Post('withdrawChipsAdmin')
  withdrawChipsAdmin(@Body() dto: WithdrawChipAdminDto) {
    return this.chipsTransferService.withdrawChipsAdmin(dto);
  }

  @Post('transferFundChipsToAffiliate')
  transferFundChipsToAffiliate(@Body() dto: TransferFundChipsToAffiliateDto) {
    return this.chipsTransferService.transferChipsToAffiliate({
      ...dto,
      transferBy: dto.transferBy || this.auth.getCurrentUserName(),
    });
  }

  @Post('transferFundChipsToSubAffiliate')
  transferFundChipsToSubAffiliate(
    @Body() dto: TransferFundChipsToSubAffiliateDto,
  ) {
    return this.chipsTransferService.transferChipsByAffiliateToSubAffiliate(
      dto,
    );
  }

  @Post('countPlayerHistory')
  countPlayerHistory(@Body() dto: any) {
    if (dto.transferTo) {
      dto.transferTo = eval('/' + dto.transferTo + '/i');
    }
    if (dto.transferBy) {
      dto.transferBy = eval('/' + dto.transferBy + '/i');
    }
    delete dto.skip;
    delete dto.limit;
    return this.transferToPlayerHistoryService.countPlayerHistory(dto);
  }
  @Post('countAffiliateHistory')
  countAffiliateHistory(@Body() body: any) {
    return this.chipsTransferHistoryService.countHistoryAffiliates(body);
  }
}
