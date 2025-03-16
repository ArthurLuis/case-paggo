import { Module } from '@nestjs/common';
import { LlmResponseService } from './llm-response.service';
import { LlmResponseController } from './llm-response.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [LlmResponseController],
  providers: [LlmResponseService],
  exports: [LlmResponseService],
})
export class LlmResponseModule {}
