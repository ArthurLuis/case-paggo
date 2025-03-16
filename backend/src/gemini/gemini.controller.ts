import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { GetAiMessageDTO } from './model/get-ai-responde.dto';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly service: GeminiService) {}

  @Post('')
  @UsePipes(new ValidationPipe({ transform: true }))
  getResponse(@Body() data: GetAiMessageDTO) {
    return this.service.generateText(data);
  }
}
