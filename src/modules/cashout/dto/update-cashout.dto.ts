import { PartialType } from '@nestjs/swagger';
import { CreateCashoutDto } from './create-cashout.dto';

export class UpdateCashoutDto extends PartialType(CreateCashoutDto) {}
