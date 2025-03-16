'use client';import React, {useState} from 'react';
import Balloon from '../Balloon/Baloon';
import AppInput from '../AppInput/AppInput';
import AppButton from '../AppButton/AppButton';
import Image from 'next/image';

interface ChatProps {
  aiResponse: string;
  photo: string;
}

interface Interaction {
  userQuery: string;
  llmAnswer: string;
}

const Chat = ({aiResponse, photo}: ChatProps) => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [userInput, setUserInput] = useState('');

  const handleSendMessage = async () => {
    if (userInput.trim() === '') return; // Não enviar se estiver vazio

    // Adiciona a mensagem do usuário
    const newInteraction: Interaction = {
      userQuery: userInput,
      llmAnswer: 'resposta do backend',
    };
    // Atualiza o estado com as novas mensagens
    setInteractions((prevInteractions) => [
      ...prevInteractions,
      newInteraction,
    ]);
  };
  return (
    <>
      <div className='flex flex-col justify-between relative bg-white rounded-lg shadow-md pr-20 pt-14 pl-10 max-w-[1200px] mx-auto mt-20 h-[calc(100vh-200px)]  overflow-y-auto'>
        <div>
          <Balloon type='user'>
            <Image
              src={photo}
              alt='Imagem enviada'
              className='max-w-[150px] rounded-lg'
            ></Image>
          </Balloon>
          <Balloon type='app'>{aiResponse}</Balloon>
          {interactions.map((interaction, index) => (
            <div key={index}>
              <Balloon type='user'>{interaction.userQuery}</Balloon>
              <Balloon type='app'>{interaction.llmAnswer}</Balloon>
            </div>
          ))}
        </div>

        {/* Campo de entrada e botão de enviar fixados na parte inferior */}
        <div className='flex sticky bottom-0 left-0 right-0 bg-white p-4 justify-center gap-4'>
          <AppInput
            type='text'
            placeholder='Faça uma pergunta...'
            width={500}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <AppButton
            title='Enviar'
            bgColor='bg-gray-800'
            onClick={handleSendMessage}
          />
        </div>
      </div>
    </>
  );
};

export default Chat;
