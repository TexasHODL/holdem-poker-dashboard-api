import { PartialType } from '@nestjs/swagger';
import { CreatePullChipDto } from './create-pull-chip.dto';

export class UpdatePullChipDto extends PartialType(CreatePullChipDto) {}
