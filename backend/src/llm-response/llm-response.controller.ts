import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LlmResponseService } from './llm-response.service';
import { CreateLlmResponseDto } from './dto/create-llm-response.dto';
import { UpdateLlmResponseDto } from './dto/update-llm-response.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('llm-response')
export class LlmResponseController {
  constructor(private readonly llmResponseService: LlmResponseService) {}

  @UseGuards(AuthGuard)
  @Post(':documentId')
  create(
    @Param('documentId') documentId: string,
    @Body() createLlmResponseDto: CreateLlmResponseDto,
  ) {
    return this.llmResponseService.create(createLlmResponseDto, documentId);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.llmResponseService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.llmResponseService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLlmResponseDto: UpdateLlmResponseDto,
  ) {
    return this.llmResponseService.update(id, updateLlmResponseDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.llmResponseService.remove(id);
  }
}
