import { IsOptional, IsString } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @IsOptional() // Torna o fileUrl opcional no DTO
  fileUrl?: string;
}
