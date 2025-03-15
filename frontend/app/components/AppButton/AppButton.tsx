'use client';
import Link from 'next/link';
import React from 'react';

interface AppButtonTypes {
  title: string;
  href?: string;
  bgColor?: string;
  textColor?: string;
  onClick?: () => void;
}

const AppButton = ({
  title,
  href,
  bgColor = 'bg-purple-600',
  textColor = 'text-white',
  onClick,
}: AppButtonTypes) => {
  const buttonContent = (
    <div
      className={`flex items-center justify-center px-6 py-1 ${bgColor} ${textColor} rounded-lg cursor-pointer font-normal text-xl shadow-md hover:shadow-lg transition duration-200 max-w-[120px]`}
      onClick={onClick}
    >
      {title}
    </div>
  );

  return href ? (
    <Link
      className={`flex items-center justify-center px-6 py-1 ${bgColor} ${textColor} rounded-lg cursor-pointer font-normal text-xl shadow-md hover:shadow-lg transition duration-200 max-w-[120px]`}
      href={href}
    >
      {buttonContent}
    </Link>
  ) : (
    buttonContent
  );
};

export default AppButton;
