import { Test, TestingModule } from '@nestjs/testing';
import { PlayerPassbookController } from './player-passbook.controller';
import { PlayerPassbookService } from './player-passbook.service';

describe('PlayerPassbookController', () => {
  let controller: PlayerPassbookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerPassbookController],
      providers: [PlayerPassbookService],
    }).compile();

    controller = module.get<PlayerPassbookController>(PlayerPassbookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
