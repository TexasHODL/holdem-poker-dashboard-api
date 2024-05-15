import { PartialType } from '@nestjs/swagger';
import { CreateCashoutAffiliateDto } from './create-cashout-affiliate.dto';

export class UpdateCashoutAffiliateDto extends PartialType(CreateCashoutAffiliateDto) {}
