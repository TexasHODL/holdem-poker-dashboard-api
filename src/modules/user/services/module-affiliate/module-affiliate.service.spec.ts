import { Test, TestingModule } from '@nestjs/testing';
import { ModuleAffiliateService } from './module-affiliate.service';

describe('ModuleAffiliateService', () => {
  let service: ModuleAffiliateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModuleAffiliateService],
    }).compile();

    service = module.get<ModuleAffiliateService>(ModuleAffiliateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
