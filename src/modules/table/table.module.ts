import { Module } from "@nestjs/common";
import { TableService } from "./table.service";
import { TableController } from "./table.controller";
import { DB, DBModel } from "@/database/connections/db";
import { InMemoryDBModel, LogDBModel } from "@/database/connections/constants";
import { TableJoinRecordService } from "./services/table-join-record/table-join-record.service";
import { SharedModule } from "@/shared/shared.module";

@Module({
  imports: [
    SharedModule,
    DB.pokerDbModels([DBModel.Table]),
    DB.inMemoryDbModels([
      InMemoryDBModel.Table,
      InMemoryDBModel.TableJoinRecord,
    ]),
    DB.logDbModels([LogDBModel.TableUpdateRecord, LogDBModel.HandHistory]),
  ],
  controllers: [TableController],
  providers: [TableService, TableJoinRecordService],
  exports: [TableService, TableJoinRecordService],
})
export class TableModule {}
