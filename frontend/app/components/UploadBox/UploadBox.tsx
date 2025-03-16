'use client';
import {useState} from 'react';
import {useDropzone} from 'react-dropzone';

interface UploadBoxProps {
  onFileSelect: (file: File) => void; // Define a função para passar o arquivo ao componente pai
}

const UploadBox: React.FC<UploadBoxProps> = ({onFileSelect}) => {
  const [filePreview, setFilePreview] = useState<string | null>(null); // Estado para armazenar a URL da imagem
  const {getRootProps, getInputProps} = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]; // Pega o primeiro arquivo
      if (file) {
        // Cria uma URL temporária para a imagem
        const previewUrl = URL.createObjectURL(file);
        setFilePreview(previewUrl); // Armazena a URL no estado

        // Chama a função onFileSelect para passar o arquivo ao componente pai
        onFileSelect(file);
      }
    },
    accept: {
      'image/jpeg': ['.jpg'],
      'image/png': ['.png'],
    }, // Só aceita arquivos de imagem
  });

  return (
    <div>
      {/* Área de arrastar e soltar */}
      <div
        {...getRootProps({className: 'dropzone'})}
        style={{
          border: '2px dashed #ccc',
          padding: '20px',
          textAlign: 'center',
          height: '400px',
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
        }}
      >
        <input {...getInputProps()} />
        <p style={{fontSize: '24px'}}>
          Arraste e solte uma imagem ou clique para selecionar
        </p>
      </div>
    </div>
  );
};

export default UploadBox;
