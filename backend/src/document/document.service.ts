/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { PrismaService } from 'src/database/prisma.service';
import { OcrService } from './ocr.service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FileDto } from './dto/file.dto';
import { LlmResponseService } from '../llm-response/llm-response.service'; // Importando o LlmResponseService
import { GeminiService } from 'src/gemini/gemini.service';

@Injectable()
export class DocumentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ocrService: OcrService,
    private readonly llmResponseService: LlmResponseService,
    private readonly geminiService: GeminiService,
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

      if (!publicData) {
        throw new Error('Error getting public URL: No public data returned');
      }

      return publicData.publicUrl; // Retorna o URL público do arquivo
    } catch (err) {
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

    if (!fileUrl) {
      throw new Error('File URL is undefined. Upload may have failed.');
    }

    // Extração de texto do arquivo usando OCR
    const extractedText = await this.ocrService.extractTextFromImage(fileUrl);

    const promt = {
      promt: `
      Você é um assistente que analisa documentos e extrai informações contextuais. 
      O usuário enviou um documento e queremos que você interprete o significado das informações extraídas e forneça um contexto geral sobre o conteúdo. 
      Aqui está o texto extraído do documento:
      
      "${extractedText}"
      
      Por favor, forneça um resumo do conteúdo, identificando os principais pontos de interesse e possíveis interpretações.
    `,
    };

    const geminiResponse = await this.geminiService.generateText(promt);

    if (!geminiResponse) {
      throw new Error('Falha ao obter resposta do Gemini.');
    }

    const { result, sessionId } = geminiResponse;

    const document = await this.prisma.document.create({
      data: {
        fileUrl,
        extractedText,
        userId: req.sub.sub,
        sessionId,
      },
    });

    await this.llmResponseService.create(
      {
        userQuery: extractedText,
        llmAnswer: result,
      },
      document.id,
    );

    return {
      ...document,
      aiResponse: result,
    };
  }

  async askQuestion(documentId: string, question: string) {
    console.log('Função askQuestion foi chamada com documentId:', documentId); // Adicionando log inicial

    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      select: { id: true, sessionId: true }, // Incluindo o userSession
    });

    if (!document) {
      console.log('Documento não encontrado.');
      throw new Error('Documento não encontrado.');
    }

    console.log('Session ID:', document.sessionId); // Adicionando o log

    const prompt = {
      promt: question,
      sessionId: document.sessionId || '',
    };
    const geminiResponse = await this.geminiService.generateText(prompt);

    if (!geminiResponse) {
      throw new Error('Falha ao obter resposta do Gemini.');
    }

    const { result } = geminiResponse;

    await this.llmResponseService.create(
      {
        userQuery: question,
        llmAnswer: result,
      },
      document.id,
    );

    return { response: result };
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
