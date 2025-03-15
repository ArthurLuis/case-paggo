import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { PrismaService } from 'src/database/prisma.service';
import { OcrService } from './ocr.service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FileDto } from './dto/file.dto'; // Importe seu DTO de arquivo

@Injectable()
export class DocumentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ocrService: OcrService,
  ) {}

  private async uploadFile(file: FileDto): Promise<string> {
    try {
      const supabaseUrl = 'https://bqrvhsomwtjkwvzmfcwh.supabase.co';
      const supabaseKey =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxcnZoc29td3Rqa3d2em1mY3doIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjAxODYxMCwiZXhwIjoyMDU3NTk0NjEwfQ.Ofdj4r4jfq58gCoHNsnbiAHr3ssTXeI_RzbhZ-h1BPM';
      const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
        },
      });

      // Realiza o upload no Supabase Storage
      const { data, error } = await supabase.storage
        .from('paggo')
        .upload(file.originalname, file.buffer, { upsert: true });

      if (error) {
        throw new Error(`Error uploading file: ${error.message}`);
      }

      // Obtém o URL público do arquivo
      const { data: publicData } = supabase.storage
        .from('paggo')
        .getPublicUrl(data?.path);

      console.log('Public URL:', publicData.publicUrl); // <-- Adicione esse log aqui

      if (!publicData) {
        throw new Error('Error getting public URL: No public data returned');
      }

      return publicData.publicUrl; // Retorna o URL público do arquivo
    } catch (err) {
      // Captura qualquer erro e lança de forma mais clara
      throw new Error(
        `Error during file upload: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
    }
  }

  async create(
    createDocumentDto: CreateDocumentDto,
    req: { sub: { sub: string } },
    file: FileDto,
  ) {
    const fileUrl = await this.uploadFile(file);

    console.log('File uploaded successfully. URL:', fileUrl); // <-- Adicione esse log

    // Teste se a URL está correta abrindo no navegador
    if (!fileUrl) {
      throw new Error('File URL is undefined. Upload may have failed.');
    }

    // Extração de texto do arquivo usando OCR
    const extractedText = await this.ocrService.extractTextFromImage(fileUrl);

    return await this.prisma.document.create({
      data: {
        fileUrl,
        extractedText,
        userId: req.sub.sub,
      },
    });
  }

  // Função para buscar todos os documentos
  async findAll() {
    return await this.prisma.document.findMany({
      include: { llmResponses: true },
    });
  }

  // Função para buscar um documento específico
  async findOne(id: string) {
    return await this.prisma.document.findUnique({
      where: { id },
      include: { llmResponses: true },
    });
  }

  // Função para atualizar um documento
  async update(id: string, updateDocumentDto: UpdateDocumentDto) {
    return await this.prisma.document.update({
      where: { id },
      data: updateDocumentDto,
    });
  }

  // Função para remover um documento
  async remove(id: string) {
    return await this.prisma.document.delete({
      where: { id },
    });
  }
}
