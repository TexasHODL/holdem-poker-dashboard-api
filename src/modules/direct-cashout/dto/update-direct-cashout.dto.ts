import { PartialType } from '@nestjs/swagger';
import { CreateDirectCashoutDto } from './create-direct-cashout.dto';

export class UpdateDirectCashoutDto extends PartialType(
  CreateDirectCashoutDto,
) {}
