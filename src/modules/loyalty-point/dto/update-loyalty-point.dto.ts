import { PartialType } from '@nestjs/swagger';
import { CreateLoyaltyPointDto } from './create-loyalty-point.dto';

export class UpdateLoyaltyPointDto extends PartialType(CreateLoyaltyPointDto) {}
