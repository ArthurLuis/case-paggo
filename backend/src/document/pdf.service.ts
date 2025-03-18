/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as PDFDocument from 'pdfkit';
import { Injectable } from '@nestjs/common';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class PdfService {
  async generatePdf(
    documentName: string,
    llmResponses: any[],
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const safeDocumentName = documentName.replace(/\s+/g, '_');

      const uploadDir = join(__dirname, '../../../uploads');

      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = join(uploadDir, `${safeDocumentName}.pdf`);

      const doc = new PDFDocument();
      const stream = doc.pipe(createWriteStream(filePath));

      doc.fontSize(18).text(documentName, { align: 'center' });
      doc.moveDown();

      llmResponses.forEach((response, index) => {
        const { userQuery, llmAnswer } = response;
        if (index === 0) {
          doc.fontSize(14).text('Texto Extraído:', { underline: true });
          doc.fontSize(12).text(userQuery);
          doc.moveDown();
          doc.fontSize(14).text('Resposta do Gemini:', { underline: true });
          doc.fontSize(12).text(llmAnswer);
          doc.moveDown();
        } else {
          doc.fontSize(16).text(`Outras interações do chat:`, {
            align: 'center',
            underline: true,
          });
          doc.fontSize(14).text(`Usuário:`).fontSize(12).text(userQuery);
          doc.moveDown();
          doc.fontSize(14).text(`Gemini:`).fontSize(12).text(llmAnswer);
          doc.moveDown();
        }
      });

      doc.end();

      stream.on('finish', () => resolve(filePath));

      stream.on('error', (err) => reject(new Error(err)));
    });
  }
}
