import { Test, TestingModule } from '@nestjs/testing';
import { LlmResponseController } from './llm-response.controller';
import { LlmResponseService } from './llm-response.service';

describe('LlmResponseController', () => {
  let controller: LlmResponseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LlmResponseController],
      providers: [LlmResponseService],
    }).compile();

    controller = module.get<LlmResponseController>(LlmResponseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
