import { PartialType } from '@nestjs/swagger';
import { CreatePalyerBankDetailDto } from './create-palyer-bank-detail.dto';

export class UpdatePalyerBankDetailDto extends PartialType(CreatePalyerBankDetailDto) {}
