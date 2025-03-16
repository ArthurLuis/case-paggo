import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class GetAiMessageDTO {
  @IsString()
  @IsNotEmpty() 
  promt: string;

  @IsString()
  @IsOptional()
  sessionId?: string;
}
