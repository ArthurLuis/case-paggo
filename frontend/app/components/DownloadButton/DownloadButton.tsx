import React from 'react';
import axios from 'axios';
import {GrDocumentDownload} from 'react-icons/gr';

interface DownloadButtonProps {
  documentId: string;
  documentTitle: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  documentId,
  documentTitle,
}) => {
  // Função para baixar o PDF
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/document/pdf/${documentId}`,
        null,
        {
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${documentTitle}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Erro ao baixar o documento:', error);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className='p-2 bg-gray-800 text-white rounded-lg hover:scale-95 hover:bg-gray-600 transition flex items-center justify-center'
    >
      <GrDocumentDownload size={24} />
    </button>
  );
};

export default DownloadButton;
