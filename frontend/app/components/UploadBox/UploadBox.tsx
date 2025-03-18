'use client';
import {useDropzone} from 'react-dropzone';

interface UploadBoxProps {
  onFileSelect: (file: File) => void;
}

const UploadBox: React.FC<UploadBoxProps> = ({onFileSelect}) => {
  const {getRootProps, getInputProps} = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]; // Pega o primeiro arquivo
      if (file) {
        onFileSelect(file);
      }
    },
    accept: {
      'image/jpeg': ['.jpg'],
      'image/png': ['.png'],
    },
  });

  return (
    <div>
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
