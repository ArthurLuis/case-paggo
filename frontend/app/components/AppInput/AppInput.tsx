'use client';
import React, {ChangeEvent} from 'react';

interface AppInputTypes {
  type: 'text' | 'password' | 'number';
  label?: string;
  placeholder?: string;
  width?: number; // largura desejada em px (máximo)
  height?: number; // altura fixa em px
  multiline?: boolean;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeMultiline?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
}

const AppInput = ({
  type,
  label,
  placeholder,
  width,
  height,
  multiline = false,
  value,
  onChange,
  onChangeMultiline,
  disabled = false,
}: AppInputTypes) => {
  const responsiveStyle: React.CSSProperties = {
    // se width definido, tenta width(px), senão 100% do container
    width: width ? `${width}px` : '100%',
    // mas nunca excede 100% do container
    maxWidth: '100%',

    // altura fixa para input; para textarea, limitamos só o máximo
    height: !multiline && height ? `${height}px` : undefined,
    maxHeight: multiline && height ? `${height}px` : undefined,
  };

  return (
    <div className='flex flex-col w-full'>
      {label && <label className='text-sm font-normal mb-1'>{label}</label>}

      <div className='relative w-full'>
        {multiline ? (
          <textarea
            placeholder={placeholder}
            className={`
              w-full p-3 bg-gray-100 rounded-lg
              text-gray-700 focus:outline-none resize-none
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            style={responsiveStyle}
            value={value}
            onChange={onChangeMultiline}
            disabled={disabled}
          />
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            className={`
              w-full p-3 bg-gray-100 rounded-lg
              text-gray-700 shadow-sm focus:outline-none
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            style={responsiveStyle}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
};

export default AppInput;
