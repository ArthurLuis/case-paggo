import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLlmResponseDto {
  @IsString()
  @IsNotEmpty()
  userQuery: string; // Pergunta feita pelo usuário

  @IsString()
  @IsNotEmpty()
  llmAnswer: string; // Resposta do LLM
}
