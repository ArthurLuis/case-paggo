import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { PrismaService } from 'src/database/prisma.service';
import { OcrService } from './ocr.service';

@Injectable()
export class DocumentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ocrService: OcrService,
  ) {}

  async create(
    createDocumentDto: CreateDocumentDto,
    req: { sub: { sub: string } },
  ) {
    const fileUrl = '';
    const extractedText = await this.ocrService.extractTextFromImage(fileUrl);

    return await this.prisma.document.create({
      data: {
        fileUrl, // Salve o caminho ou URL do arquivo
        extractedText,
        userId: req.sub.sub,
      },
    });
  }

  async findAll() {
    return await this.prisma.document.findMany({
      include: { llmResponses: true },
    });
  }

  async findOne(id: string) {
    return await this.prisma.document.findUnique({
      where: { id },
      include: { llmResponses: true },
    });
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto) {
    return await this.prisma.document.update({
      where: { id },
      data: updateDocumentDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.document.delete({
      where: { id },
    });
  }
}
