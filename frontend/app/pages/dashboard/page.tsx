'use client';
import React, {useEffect, useState} from 'react';
import AppScreen from '../../components/AppScreen/AppScreen';
import UploadBox from '../../components/UploadBox/UploadBox';
import Chat from '../../components/Chat/Chat';
import Loading from '../../components/Loading/Loading';

export default function Dashboard() {
  const [isFileSelected, setIsFileSelected] = useState<boolean>(false);
  const [userDocument, setUserDocument] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [documentId, setDocumentId] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [fileData, setFileData] = useState<any>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('authToken='))
        ?.split('=')[1];
      setAuthToken(token || null);
    }
  }, []);

  const uploadFile = async (file: File) => {
    if (!authToken) {
      console.error('Token de autenticação não encontrado');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      setLoading(true);

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/document`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      const responseData = await response.json();
      setDocumentId(responseData.id);
      setFileData(responseData);
      setAiResponse(responseData.aiResponse);
      setExtractedText(responseData.extractedText);
      setUserDocument(responseData.fileUrl);
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
    } finally {
      setLoading(false);
    }
  };

  const onFileSelectFunction = (file: any) => {
    setIsFileSelected(true);
    uploadFile(file);
  };

  return (
    <AppScreen>
      {!isFileSelected && <UploadBox onFileSelect={onFileSelectFunction} />}
      {loading && <Loading isLoading={loading} />}
      {isFileSelected && !loading && fileData && aiResponse && (
        <Chat
          aiResponse={aiResponse}
          photo={userDocument}
          documentId={documentId}
          extractedText={`Texto extraído da imagem: ${extractedText}`}
        />
      )}
    </AppScreen>
  );
}
