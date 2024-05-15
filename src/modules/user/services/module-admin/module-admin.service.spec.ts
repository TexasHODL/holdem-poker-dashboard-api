import { Test, TestingModule } from '@nestjs/testing';
import { ModuleAdminService } from './module-admin.service';

describe('ModuleAdminService', () => {
  let service: ModuleAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModuleAdminService],
    }).compile();

    service = module.get<ModuleAdminService>(ModuleAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
