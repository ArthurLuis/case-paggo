/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';
import axios from 'axios';

@Injectable()
export class OcrService {
  // Função para testar se a URL da imagem é acessível
  private async testImageUrl(url: string) {
    try {
      const response = await axios.get(url);
      console.log('Imagem acessada com sucesso:', response.status);
    } catch (error) {
      console.error('Erro ao acessar a imagem:', error);
      throw new Error('URL da imagem não acessível');
    }
  }

  async extractTextFromImage(fileUrl: string): Promise<string> {
    try {
      // Testar se a URL da imagem é acessível
      await this.testImageUrl(fileUrl);

      // Baixar a imagem como ArrayBuffer
      const response = await axios.get<ArrayBuffer>(fileUrl, {
        responseType: 'arraybuffer',
      });
      const imageBuffer = Buffer.from(response.data);

      // Processar a imagem com Tesseract diretamente do buffer
      const {
        data: { text },
      } = await Tesseract.recognize(imageBuffer, 'eng', {
        logger: (m) => console.log(m),
      });

      return text;
    } catch (error) {
      console.error('Erro ao processar a imagem', error);
      throw new Error('OCR falhou');
    }
  }
}
