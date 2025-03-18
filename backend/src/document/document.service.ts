/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase URL ou Key não estão definidos.');
      }

      const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      });

      const { data, error } = await supabase.storage
        .from('paggo')
        .upload(file.originalname, file.buffer, { upsert: true });

      if (error) {
        throw new Error(`Erro ao enviar o arquivo: ${error.message}`);
      }

      const { data: publicData } = supabase.storage
        .from('paggo')
        .getPublicUrl(data?.path);

      if (!publicData) {
        throw new Error('Erro ao obter o URL público.');
      }

      return publicData.publicUrl;
    } catch (err) {
      throw new Error(
        `Erro no upload: ${err instanceof Error ? err.message : 'Erro desconhecido'}`,
      );
    }
  }

  async create(
    createDocumentDto: CreateDocumentDto,
    req: { user: { sub: string } },
    file: FileDto,
  ) {
    const fileUrl = await this.uploadFile(file);

    if (!fileUrl) {
      throw new Error('File URL is undefined. Upload may have failed.');
    }

    const extractedText = await this.ocrService.extractTextFromImage(fileUrl);

    const prompt = {
      promt: `
      Você é um assistente que analisa documentos e extrai informações contextuais.
      O usuário enviou um documento e queremos que você interprete o significado das informações
      extraídas a partir de um texto gerado por um software de OCR. Então desconsidere erros gramaticais
      e caracteres estranhos no meio, que podem ser ocasionados às vezes pelo software.
      Durante a conversa com o usuario, aja como um assistente de ler imagens e não desconsidere esse prompt
      na hora de escrever as respostas, foque em ajudar o usuario com o documento e não com o prompt.

      Aqui está o texto extraído do documento:
      "${extractedText}"

      1. Resuma o conteúdo, destacando os pontos principais, mas lembre é uma conversa, não precisa ficar enorme.
      2. Sugira um título curto e descritivo para este documento usando a língua original do texto (máximo 6 palavras).

      Retorne a resposta no seguinte formato JSON:
      {
        "summary": "<resumo>",
        "title": "<nome do documento>"
      }
    `,
    };

    const geminiResponse = await this.geminiService.generateText(prompt);

    if (!geminiResponse) {
      throw new Error('Falha ao obter resposta do Gemini.');
    }

    const { result, sessionId } = geminiResponse;

    let title = 'Documento sem título';
    let summary = '';

    let cleanResult = result.trim();

    if (cleanResult.startsWith('```json')) {
      cleanResult = cleanResult.replace(/```json|```/g, '').trim();
    }

    try {
      const parsedResponse = JSON.parse(cleanResult);
      title = parsedResponse.title || title;
      summary = parsedResponse.summary || '';
    } catch (error) {
      console.error('Erro ao interpretar resposta do Gemini:', error);
    }

    const document = await this.prisma.document.create({
      data: {
        fileUrl,
        extractedText,
        userId: req.user.sub,
        sessionId,
        name: title,
      },
    });

    await this.llmResponseService.create(
      {
        userQuery: extractedText,
        llmAnswer: summary,
      },
      document.id,
    );

    return {
      ...document,
      aiResponse: summary,
    };
  }
  async askQuestion(documentId: string, question: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      select: { id: true, sessionId: true }, 
    });

    if (!document) {
      throw new Error('Documento não encontrado.');
    }

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

  async findByUserId(userId: string) {
    return this.prisma.document.findMany({
      where: { userId },
      select: {
        id: true,
        extractedText: true,
        createdAt: true,
        updatedAt: true,
        fileUrl: true,
        name: true,
      },
      orderBy: {
        createdAt: 'desc',
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
