'use client';import React, {useState, useEffect} from 'react';
import Balloon from '../Balloon/Baloon';
import AppInput from '../AppInput/AppInput';
import AppButton from '../AppButton/AppButton';
import Loading from '../Loading/Loading';
import DownloadButton from '../DownloadButton/DownloadButton';
import ImageModal from '../ImageModal/ImageModal';
import {MdArrowDropDown} from 'react-icons/md';
import axios from 'axios';
import DeleteButton from '../DeleteButton/DeleteButton'; // Certifique-se de importar o DeleteButton

interface LlmResponse {
  id: string;
  userQuery: string;
  llmAnswer: string;
  createdAt: string;
}

interface DocumentCardProps {
  documentId: string;
  documentTitle: string;
  extractedText: string;
  llmResponses: LlmResponse[];
  documentImageUrl: string;
  onExpand: (documentId: string) => void;
  isExpanded: boolean;
  loading: boolean;
  authToken: string | null;
  handleDeleteSuccess: (documentId: string) => void;
}

const DocumentCard = ({
  documentId,
  documentTitle,
  extractedText,
  llmResponses,
  documentImageUrl,
  onExpand,
  isExpanded,
  loading,
  authToken,
  handleDeleteSuccess,
}: DocumentCardProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<LlmResponse[]>([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setMessages(llmResponses);
  }, [llmResponses]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    setMessages((prev) => [
      ...prev,
      {
        id: 'loading',
        userQuery: newMessage,
        llmAnswer: '...',
        createdAt: new Date().toISOString(),
      },
    ]);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/document/${documentId}`,
        {question: newMessage},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: authToken ? `Bearer ${authToken}` : '',
          },
        }
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === 'loading'
            ? {
                id: response.data.id,
                userQuery: newMessage,
                llmAnswer: response.data.response,
                createdAt: response.data.createdAt,
              }
            : msg
        )
      );
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === 'loading'
            ? {
                id: 'error',
                userQuery: newMessage,
                llmAnswer: 'Erro ao obter resposta.',
                createdAt: new Date().toISOString(),
              }
            : msg
        )
      );
    } finally {
      setIsSending(false);
      setNewMessage('');
    }
  };

  const fixedHeight = 700;
  const collapsedHeight = 180;

  return (
    <div
      className='document-card bg-white rounded-xl shadow-lg p-4 mb-4 cursor-pointer transition-all duration-300 ease-in-out w-[80%] mx-auto'
      onClick={(e) => {
        e.stopPropagation();
        onExpand(documentId);
      }}
      style={{
        height: isExpanded ? fixedHeight : collapsedHeight,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div className='flex flex-col items-center text-center'>
        <ImageModal
          src={documentImageUrl || '/images/paggo.jpg'}
          alt='Documento'
          width='80px'
          height='80px'
        />
        <h3 className='text-lg font-semibold text-center w-full'>
          {documentTitle}
        </h3>
        {!isExpanded && (
          <div className='mt-2 hover:scale-150 transition-transform duration-300'>
            <MdArrowDropDown size={28} />
          </div>
        )}
      </div>

      {/* Organizando botões em um contêiner flex */}
      <div className='absolute right-4 top-4 flex flex-col gap-4'>
        {/* Botão de Download */}
        <DownloadButton documentId={documentId} documentTitle={documentTitle} />

        {/* Botão de Deletar */}
        <DeleteButton
          documentId={documentId}
          documentName={documentTitle}
          authToken={authToken}
          onDeleteSuccess={handleDeleteSuccess}
        />
      </div>

      {loading && (
        <div className='flex justify-center items-center mt-4'>
          <Loading isLoading />
        </div>
      )}

      {isExpanded && !loading && (
        <div className='mt-4 flex flex-col h-full'>
          <div
            className='flex-1 overflow-y-auto pb-20 pt-4 pr-4 pl-4'
            style={{maxHeight: 'calc(100% - 80px)', minHeight: '150px'}}
          >
            {messages.length === 0 && (
              <Balloon type='app'>{extractedText}</Balloon>
            )}
            {messages.map((message) => (
              <div key={message.id} className='mb-4'>
                <Balloon type='user'>{message.userQuery}</Balloon>
                <Balloon type='app'>
                  {message.llmAnswer === '...' ? (
                    <Loading isLoading />
                  ) : (
                    message.llmAnswer
                  )}
                </Balloon>
              </div>
            ))}
          </div>

          <div
            className='absolute bottom-0 left-0 w-full p-4 bg-white'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-center space-x-4'>
              <AppInput
                type='text'
                placeholder='Digite sua mensagem...'
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={isSending}
                width={350}
              />
              <div>
                <AppButton
                  title={isSending ? 'Enviando...' : 'Enviar'}
                  bgColor='bg-gray-800'
                  onClick={handleSendMessage}
                  disabled={isSending}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentCard;
