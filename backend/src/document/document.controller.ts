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
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileDto } from './dto/file.dto';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file')) // Interceptor para lidar com o upload do arquivo
  async uploadFile(
    @UploadedFile() file: FileDto,
    @Body() createDocumentDto: CreateDocumentDto,
    @Request() req: { sub: { sub: string }; cookies: string }, // Recebe os cookies da requisição
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
