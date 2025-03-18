import { IsOptional, IsString } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @IsOptional() 
  fileUrl?: string;
}
