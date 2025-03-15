import { Test, TestingModule } from '@nestjs/testing';
import { LlmResponseService } from './llm-response.service';

describe('LlmResponseService', () => {
  let service: LlmResponseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LlmResponseService],
    }).compile();

    service = module.get<LlmResponseService>(LlmResponseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
