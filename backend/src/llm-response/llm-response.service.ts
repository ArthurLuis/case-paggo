import { Inject, Injectable } from '@nestjs/common';
import { UpdateLlmResponseDto } from './dto/update-llm-response.dto';
import { PrismaService } from 'src/database/prisma.service';
import { CreateLlmResponseDto } from './dto/create-llm-response.dto';

@Injectable()
export class LlmResponseService {
  @Inject()
  private readonly prisma: PrismaService;

  async create(createLlmResponseDto: CreateLlmResponseDto, documentId: string) {
    return this.prisma.lLMResponse.create({
      data: {
        userQuery: createLlmResponseDto.userQuery,
        llmAnswer: createLlmResponseDto.llmAnswer,
        document: { connect: { id: documentId } },
      },
    });
  }

  findAll() {
    return this.prisma.lLMResponse.findMany();
  }

  findOne(id: string) {
    return this.prisma.lLMResponse.findUnique({
      where: { id },
    });
  }

  update(id: string, updateLlmResponseDto: UpdateLlmResponseDto) {
    return this.prisma.lLMResponse.update({
      where: { id },
      data: updateLlmResponseDto,
    });
  }

  remove(id: string) {
    return this.prisma.lLMResponse.delete({
      where: { id },
    });
  }
}
