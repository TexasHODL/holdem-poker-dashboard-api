import { Module } from '@nestjs/common';
import { RakeAnalyticsService } from './rake-analytics.service';
import { RakeAnalyticsController } from './rake-analytics.controller';
import { FinanceModule } from '@/modules/finance/finance.module';
import { UserModule } from '@/modules/user/user.module';
import { TableModule } from '../table/table.module';

@Module({
  imports: [
    UserModule,
    FinanceModule,
    TableModule
  ],
  controllers: [RakeAnalyticsController],
  providers: [
    RakeAnalyticsService
  ]
})
export class RakeAnalyticsModule {}
