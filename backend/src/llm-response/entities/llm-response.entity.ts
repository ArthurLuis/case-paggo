import { Document } from '../../document/entities/document.entity';

export class LlmResponse {
  id: string; // ID da resposta do LLM
  documentId: string; // ID do documento associado
  document?: Document; // Relacionamento opcional com o documento
  userQuery: string; // Pergunta feita pelo usuário
  llmAnswer: string; // Resposta gerada pelo LLM
  createdAt: Date; // Data de criação da resposta
}
