import { Test, TestingModule } from '@nestjs/testing';
import { BroadcastController } from './broadcast.controller';
import { BroadcastService } from './broadcast.service';

describe('BroadcastController', () => {
  let controller: BroadcastController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BroadcastController],
      providers: [BroadcastService],
    }).compile();

    controller = module.get<BroadcastController>(BroadcastController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
