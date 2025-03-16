/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ChatSession,
  GenerativeModel,
  GoogleGenerativeAI,
} from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetAiMessageDTO } from './model/get-ai-responde.dto';
import { v4 } from 'uuid';

const GEMINI_MODEL = 'gemini-1.5-flash';

@Injectable()
export class GeminiService {
  private readonly googleAi: GoogleGenerativeAI;
  private readonly model: GenerativeModel;
  private readonly chatSessions: { [sessionId: string]: ChatSession } = {};

  constructor(configService: ConfigService) {
    const geminiApiKey = configService.get('GEMINI_API_KEY');
    this.googleAi = new GoogleGenerativeAI(geminiApiKey);
    this.model = this.googleAi.getGenerativeModel({ model: GEMINI_MODEL });
  }

  private getChatSession(sessionId?: string) {
    const sessionIdToUse = sessionId ?? v4();
    let result = this.chatSessions[sessionIdToUse];
    if (!result) {
      result = this.model.startChat();
      this.chatSessions[sessionIdToUse] = result;
    }
    return {
      sessionId: sessionIdToUse,
      chatSession: result,
    };
  }
  async generateText(data: GetAiMessageDTO) {
    try {
      const { sessionId, chatSession } = this.getChatSession(data.sessionId);
      const result = await chatSession.sendMessage(data.promt);
      return {
        result: result.response.text(),
        sessionId,
      };
    } catch (error) {
      console.log('Error generating text', error);
    }
  }
}
