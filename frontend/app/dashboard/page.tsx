'use client';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import AppScreen from '../components/AppScreen/AppScreen';
import UploadBox from '../components/UploadBox/UploadBox';
import Chat from '../components/Chat/Chat';

export default function Dashboard() {
  const [isFileSelected, setIsFileSelected] = React.useState<boolean>(false);
  const [userDocument, setUserDocument] = React.useState<any>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [aiResponse, setAiResponse] = React.useState<string>('');
  const [fileData, setFileData] = React.useState<any>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    // Acessa o cookie apenas no lado do cliente
    if (typeof window !== 'undefined') {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('authToken='))
        ?.split('=')[1];

      setAuthToken(token || null);
    }
  }, []); 

  const uploadFile = async (file: File) => {
    console.log('Uploading file', file);

    if (!authToken) {
      console.error('Token de autenticação não encontrado');
      return;
    }

    try {
      // Criar um FormData para enviar o arquivo
      const formData = new FormData();
      formData.append('file', file);

      setLoading(true);

      // URL completa da API
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/document`;

      // Enviar para a rota '/document' com o authToken no header
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authToken}`, // Adicionando o token no cabeçalho
        },
      });

      // Processar a resposta da API
      const {
        id,
        userId,
        fileUrl,
        extractedText,
        sessionId,
        createdAt,
        updatedAt,
        aiResponse,
      } = response.data;

      // Atualizar o estado com os dados da resposta
      setFileData({
        id,
        userId,
        fileUrl,
        extractedText,
        sessionId,
        createdAt,
        updatedAt,
      });

      setAiResponse(aiResponse);
      setUserDocument(fileUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  const onFileSelectFunction = (file: any) => {
    console.log('File selected', file);
    setIsFileSelected(true);
    uploadFile(file);
  };

  return (
    <AppScreen>
      {/* INICIO */}

      {!isFileSelected && (
        <UploadBox onFileSelect={(file) => onFileSelectFunction(file)} />
      )}
      {loading && <p>Carregando...</p>}
      {isFileSelected && !loading && fileData && aiResponse && (
        <Chat aiResponse={aiResponse} photo={userDocument} />
      )}
    </AppScreen>
  );
}
