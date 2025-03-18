'use client';
import React, {useEffect, useState} from 'react';
import AppScreen from '../components/AppScreen/AppScreen';
import UploadBox from '../components/UploadBox/UploadBox';
import Chat from '../components/Chat/Chat';
import Loading from '../components/Loading/Loading';
import useProgress from '@/app/hooks/useProgress';

export default function Dashboard() {
  const [isFileSelected, setIsFileSelected] = React.useState<boolean>(false);
  const [userDocument, setUserDocument] = React.useState<any>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [documentId, setDocumentId] = useState<string>('');
  const [aiResponse, setAiResponse] = React.useState<string>('');
  const [fileData, setFileData] = React.useState<any>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>(''); // Estado para armazenar o texto extraído

  const {instance, progress, setProgress} = useProgress();

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
    if (!authToken) {
      console.error('Token de autenticação não encontrado');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      setLoading(true);
      setProgress(10); // Inicia com 10%

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/document`;

      const response = await instance.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authToken}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percentCompleted);
        },
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percentCompleted);
        },
      });


      setDocumentId(response.data.id);

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
      setExtractedText(extractedText); 
      setUserDocument(fileUrl);
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const onFileSelectFunction = (file: any) => {
    setIsFileSelected(true);
    uploadFile(file);
  };

  return (
    <AppScreen>
      {!isFileSelected && (
        <UploadBox onFileSelect={(file) => onFileSelectFunction(file)} />
      )}
      {loading && <Loading isLoading={loading} progress={progress} />}
      {isFileSelected && !loading && fileData && aiResponse && (
        <Chat
          aiResponse={aiResponse}
          photo={userDocument}
          documentId={documentId}
          extractedText={`Texto extraido da imagem: ${extractedText}`} 
        />
      )}
    </AppScreen>
  );
}
