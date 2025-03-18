'use client';import React, {useState} from 'react';
import {FaTrash} from 'react-icons/fa';

interface DeleteButtonProps {
  documentId: string;
  documentName: string;
  authToken?: string | null;
  onDeleteSuccess: (documentId: string) => void; // Nova prop
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  documentId,
  documentName,
  authToken,
  onDeleteSuccess, // Receber a função de callback
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede a propagação do clique
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!authToken) {
      console.error('Token de autenticação não encontrado');
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/document/${documentId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) throw new Error('Erro ao deletar o documento');

      // Chama a função de callback para remover o documento da lista
      onDeleteSuccess(documentId);

      // Fechar o modal após a exclusão
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao deletar documento:', error);
    }
  };

  return (
    <div>
      <button
        onClick={handleDeleteClick}
        className='p-2 bg-gray-800 text-white rounded-lg hover:scale-95 hover:bg-red-800 transition'
      >
        <FaTrash size={22} />
      </button>

      {isModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
            <h3 className='text-lg font-semibold'>
              Tem certeza que quer deletar o documento {documentName}?
            </h3>
            <div className='flex justify-end gap-4 mt-4'>
              <button
                onClick={handleCancel}
                className='px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400'
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className='px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-red-600'
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteButton;
