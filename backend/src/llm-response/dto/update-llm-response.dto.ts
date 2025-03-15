import { PartialType } from '@nestjs/mapped-types';
import { CreateLlmResponseDto } from './create-llm-response.dto';

export class UpdateLlmResponseDto extends PartialType(CreateLlmResponseDto) {}
