'use client';
import React, {ChangeEvent} from 'react';

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
            className={`w-full p-3 bg-gray-100 rounded-lg text-gray-700 focus:outline-none resize-none`}
            style={{height: height ? `${height}px` : '100px'}}
            value={value}
            onChange={onChangeMultiline}
          />
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            className='w-full p-3 bg-gray-100 rounded-lg text-gray-700 focus:outline-none'
            value={value}
            onChange={onChange}
          />
        )}
      </div>
    </div>
  );
};

export default AppInput;
