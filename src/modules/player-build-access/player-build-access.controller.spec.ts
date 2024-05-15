import { Test, TestingModule } from '@nestjs/testing';
import { PlayerBuildAccessController } from './player-build-access.controller';

describe('PlayerBuildAccessController', () => {
  let controller: PlayerBuildAccessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerBuildAccessController],
    }).compile();

    controller = module.get<PlayerBuildAccessController>(
      PlayerBuildAccessController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
