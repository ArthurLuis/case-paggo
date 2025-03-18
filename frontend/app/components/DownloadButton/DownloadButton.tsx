'use client';
import React, {useEffect, useState} from 'react';
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Verifica se o código está sendo executado no lado do cliente
    if (typeof window !== 'undefined') {
      setIsClient(true);
    }
  }, []);

  // Função para baixar o PDF
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isClient) return; // Evita execução no servidor

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
      document.body.removeChild(link); // Remove o link após o clique
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
