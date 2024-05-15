import { PartialType } from '@nestjs/swagger';
import { CreatePlayerReportDto } from './create-player-report.dto';

export class UpdatePlayerReportDto extends PartialType(CreatePlayerReportDto) {}
