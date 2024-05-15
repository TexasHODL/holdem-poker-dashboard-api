import { PartialType } from '@nestjs/swagger';
import { CreateRakeAnalyticDto } from './create-rake-analytic.dto';

export class UpdateRakeAnalyticDto extends PartialType(CreateRakeAnalyticDto) {}
