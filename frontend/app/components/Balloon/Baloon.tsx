'use client';
import React from 'react';

interface BalloonProps {
  children: React.ReactNode;
  type: 'user' | 'app';
}

const Balloon = ({children, type}: BalloonProps) => {
  return (
    <div
      className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`rounded-lg shadow-md p-4 max-w-[80%] ${
          type === 'user'
            ? 'bg-[#1E1E1E] text-white'
            : 'bg-[#F5F5F5] text-black'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Balloon;
