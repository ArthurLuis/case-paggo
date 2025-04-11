'use client';
import React, {ChangeEvent} from 'react';

interface AppInputTypes {
  type: 'text' | 'password' | 'number';
  label?: string;
  placeholder?: string;
  maxWidth?: number;
  height?: number;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const AppInput = ({
  type,
  label,
  placeholder,
  maxWidth = 350,
  height,
  value,
  onChange,
  disabled = false,
}: AppInputTypes) => {
  return (
    <div className='flex flex-col w-full' style={{maxWidth}}>
      {label && <label className='text-sm font-normal mb-1'>{label}</label>}
      <div className='relative'>
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full p-3 bg-gray-100 rounded-lg text-gray-700 shadow-sm focus:outline-none ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={height ? {height} : {}}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default AppInput;
