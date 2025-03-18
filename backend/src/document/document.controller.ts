/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileDto } from './dto/file.dto';
import { PdfService } from './pdf.service';
import { PrismaService } from 'src/database/prisma.service';
import { join } from 'path';
import { Response } from 'express';

@Controller('document')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly pdfService: PdfService,
    private readonly prisma: PrismaService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file')) 
  async uploadFile(
    @UploadedFile() file: FileDto,
    @Body() createDocumentDto: CreateDocumentDto,
    @Request() req: { user: { sub: string } }, 
  ) {
    return this.documentService.create(createDocumentDto, req, file);
  }

  @UseGuards(AuthGuard)
  @Post(':id')
  async askQuestion(
    @Param('id') id: string,
    @Body() body: { question: string },
  ) {
    return this.documentService.askQuestion(id, body.question);
  }

  @UseGuards(AuthGuard)
  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.documentService.findByUserId(userId);
  }

  @Post('pdf/:documentId')
  async savePdf(@Param('documentId') documentId: string, @Res() res: Response) {
    try {
      const document = await this.prisma.document.findUnique({
        where: { id: documentId },
        include: { llmResponses: true },
      });

      if (!document) {
        return res.status(404).json({ message: 'Documento não encontrado' });
      }

      const documentName =
        document.name &&
        typeof document.name === 'string' &&
        document.name.trim() !== ''
          ? document.name.trim()
          : `documento_${documentId}`;

      const filePath = await this.pdfService.generatePdf(
        documentName,
        document.llmResponses,
      );

      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${documentName}.pdf"`,
      );
      res.setHeader('Content-Type', 'application/pdf');

      res.sendFile(join(filePath));
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      res.status(500).json({ message: 'Erro ao gerar PDF' });
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.documentService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentService.update(id, updateDocumentDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentService.remove(id);
  }
}
