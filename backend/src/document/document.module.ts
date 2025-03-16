import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { DatabaseModule } from 'src/database/database.module';
import { OcrService } from './ocr.service';
import { LlmResponseModule } from 'src/llm-response/llm-response.module';
import { GeminiModule } from 'src/gemini/gemini.module';

@Module({
  imports: [DatabaseModule, LlmResponseModule, GeminiModule],
  controllers: [DocumentController],
  providers: [DocumentService, OcrService],
})
export class DocumentModule {}
