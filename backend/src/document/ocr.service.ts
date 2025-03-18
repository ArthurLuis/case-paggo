import { Injectable } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';
import { PSM, OEM } from 'tesseract.js';

@Injectable()
export class OcrService {
  async extractTextFromImage(fileUrl: string): Promise<string> {
    try {
      const worker = await Tesseract.createWorker('eng+por');

      await worker.setParameters({
        tessedit_pageseg_mode: PSM.AUTO_OSD,
        tessedit_ocr_engine_mode: OEM.LSTM_ONLY,
        user_defined_dpi: '300',
      });

      const { data } = await worker.recognize(fileUrl);
      await worker.terminate();

      return data.text.trim();
    } catch (error) {
      console.error('Erro ao processar a imagem', error);
      throw new Error('OCR falhou');
    }
  }
}
