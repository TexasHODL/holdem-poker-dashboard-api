import { Module } from '@nestjs/common';
import { CashoutReportService } from './cashout-report.service';
import { CashoutReportController } from './cashout-report.controller';
import { DirectCashoutModule } from '../direct-cashout/direct-cashout.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    DirectCashoutModule,
    UserModule,
  ],
  controllers: [CashoutReportController],
  providers: [CashoutReportService],
})
export class CashoutReportModule {}
