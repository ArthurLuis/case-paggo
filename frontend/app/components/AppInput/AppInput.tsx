'use client';import React, {ChangeEvent} from 'react';

interface AppInputTypes {
  type: 'text' | 'password' | 'number';
  label?: string;
  placeholder?: string;
  width?: number;
  height?: number;
  multiline?: boolean;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeMultiline?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean; // Nova prop para desabilitar o input
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
  disabled = false, // Default: false
}: AppInputTypes) => {
  return (
    <div
      className='flex flex-col w-full'
      style={{
        width: width ? `${width}px` : undefined,
        height: height && !multiline ? `${height}px` : undefined,
      }}
    >
      {label && <label className='text-sm font-normal mb-1'>{label}</label>}
      <div className='relative'>
        {multiline ? (
          <textarea
            placeholder={placeholder}
            className={`w-full p-3 bg-gray-100 rounded-lg text-gray-700 focus:outline-none resize-none ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{height: height ? `${height}px` : '100px'}}
            value={value}
            onChange={onChangeMultiline}
            disabled={disabled}
          />
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            className={`w-full p-3 bg-gray-100 rounded-lg text-gray-700 shadow-sm focus:outline-none ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
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
