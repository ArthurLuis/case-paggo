'use client';
import React, {useState, useEffect, useRef} from 'react';
import Balloon from '../Balloon/Baloon';
import AppInput from '../AppInput/AppInput';
import AppButton from '../AppButton/AppButton';
import axios from 'axios';
import Loading from '../Loading/Loading';
import DownloadButton from '../DownloadButton/DownloadButton'; // Importando o DownloadButton
import ImageModal from '../ImageModal/ImageModal';

interface ChatProps {
  aiResponse: string;
  photo: string;
  documentId: string;
  extractedText: string;
}

interface Interaction {
  userQuery: string;
  llmAnswer: string;
}

const getTokenFromCookies = (): string | null => {
  const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
    const [name, value] = cookie.split('=');
    acc[name] = value;
    return acc;
  }, {} as {[key: string]: string});

  return cookies.authToken || null; 
};

const Chat = ({aiResponse, photo, documentId, extractedText}: ChatProps) => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = async () => {
    if (userInput.trim() === '') return; 

    const authToken = getTokenFromCookies();
    if (!authToken) {
      console.error('Token JWT não encontrado nos cookies.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/document/${documentId}`,
        {question: userInput},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setInteractions((prev) => [
        ...prev,
        {userQuery: userInput, llmAnswer: response.data.response},
      ]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setInteractions((prev) => [
        ...prev,
        {userQuery: userInput, llmAnswer: 'Erro ao obter resposta.'},
      ]);
    } finally {
      setLoading(false);
      setUserInput('');
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
    }
  }, [interactions]);

  return (
    <div className='flex flex-col justify-between relative bg-white rounded-lg shadow-md pr-20 pt-14 pl-10 max-w-[1200px] mx-auto mt-20 h-[calc(100vh-200px)] overflow-y-auto'>
      <div>
        <Balloon type='user'>
          <ImageModal src={photo} alt='Documento' width='150px' height='150px'></ImageModal>
        </Balloon>
        <Balloon type='app'>{extractedText}</Balloon>
        <Balloon type='app'>{aiResponse}</Balloon>
        {interactions.map((interaction, index) => (
          <div key={index}>
            <Balloon type='user'>{interaction.userQuery}</Balloon>

            <Balloon type='app'>  
              {interaction.llmAnswer === '...' ? (
                <Loading isLoading />
              ) : (
                interaction.llmAnswer
              )}
            </Balloon>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className='absolute left-4 top-4'>
        <DownloadButton documentId={documentId} documentTitle='Documento' />
      </div>

      <div className='flex sticky bottom-0 left-0 right-0 bg-white p-4 justify-center gap-4'>
        <AppInput
          type='text'
          placeholder='Faça uma pergunta...'
          width={500}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={loading}
        />
        <AppButton
          title={loading ? 'Enviando...' : 'Enviar'}
          bgColor='bg-gray-800'
          onClick={handleSendMessage}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default Chat;
