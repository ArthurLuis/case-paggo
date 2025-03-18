'use client';
import React, {useState} from 'react';

interface ImageModalProps {
  src: string;
  alt: string; 
  width?: string; 
  height?: string;
}

const ImageModal = ({
  src,
  alt,
  width = '100px',
  height = '100px',
}: ImageModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleImageClick = () => {
    setIsOpen(true); 
  };

  const handleClose = () => {
    setIsOpen(false); 
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose(); 
    }
  };

  return (
    <div>
      <img
        src={src}
        alt={alt}
        className='cursor-pointer'
        style={{width, height}}
        onClick={(e) => {
          e.stopPropagation();
          handleImageClick(); 
        }}
      />

      {isOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50'
          onClick={handleOutsideClick}
        >
          <div className='relative'>
            <img src={src} alt={alt} className='max-w-full max-h-full' />
            <button
              onClick={(e) => {
                e.stopPropagation(); 
                handleClose();
              }}
              className='absolute top-4 right-4 text-white text-3xl bg-black p-2 rounded-full hover:bg-gray-600'
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageModal;
