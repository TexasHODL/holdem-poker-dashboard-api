import { Test, TestingModule } from '@nestjs/testing';
import { VipReleaseService } from './vip-release.service';

describe('VipReleaseService', () => {
  let service: VipReleaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VipReleaseService],
    }).compile();

    service = module.get<VipReleaseService>(VipReleaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
