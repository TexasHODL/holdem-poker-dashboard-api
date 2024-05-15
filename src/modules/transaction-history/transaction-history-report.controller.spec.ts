import { Test, TestingModule } from "@nestjs/testing";
import { TransactionHistoryReportController } from "./transaction-history-report.controller";

describe("TransactionHistoryReportController", () => {
  let controller: TransactionHistoryReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionHistoryReportController],
    }).compile();

    controller = module.get<TransactionHistoryReportController>(
      TransactionHistoryReportController
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
