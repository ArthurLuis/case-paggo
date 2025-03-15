import { LlmResponse } from '../../llm-response/entities/llm-response.entity';

export class Document {
  id: string; // ID do documento
  userId: string; // ID do usuário que enviou o documento
  fileUrl: string; // URL do arquivo armazenado
  extractedText: string; // Texto extraído pelo OCR
  llmResponses?: LlmResponse[]; // Lista de respostas do LLM associadas ao documento
  createdAt: Date; // Data de criação do documento
  updatedAt: Date; // Última atualização do documento
}
