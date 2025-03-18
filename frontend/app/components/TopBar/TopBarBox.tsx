'use client';
import Link from 'next/link';
import React from 'react';

interface TopBarBoxProps {
  href: string;
  icon: React.ReactNode; // Agora esperamos um React node para o ícone
  active?: boolean;
}

const TopBarBox = ({href, icon, active}: TopBarBoxProps) => {
  return (
    <Link
      href={href}
      className={`flex justify-center items-center w-12 h-12 rounded-md transition-all duration-200 ease-in-out 
        ${active ? 'bg-gray-300 shadow-lg' : 'bg-'} 
        hover:bg-gray-700 hover:scale-110`}
    >
      <span className={`${active ? 'text-[#141316]' : 'text-gray-300'}`}>
        {icon}
      </span>
    </Link>
  );
};

export default TopBarBox;
