'use client';import Link from 'next/link';
import React from 'react';

interface AppButtonTypes {
  title: string;
  href?: string;
  bgColor?: string;
  textColor?: string;
  onClick?: () => void;
  disabled?: boolean;
  maxWidth?: number;
}

const AppButton = ({
  title,
  href,
  bgColor = 'bg-purple-600',
  textColor = 'text-white',
  onClick,
  disabled = false,
  maxWidth = 120,
}: AppButtonTypes) => {
  const baseClasses = `flex items-center justify-center px-6 py-2 rounded-lg font-normal text-xl shadow-md transition duration-200 w-full ${
    disabled
      ? 'bg-gray-400 cursor-not-allowed opacity-50'
      : `${bgColor} cursor-pointer hover:shadow-lg`
  } ${textColor}`;

  const style = {maxWidth: `${maxWidth}px`};

  const buttonContent = (
    <div
      className={baseClasses}
      onClick={!disabled ? onClick : undefined}
      style={style}
    >
      {title}
    </div>
  );

  return href && !disabled ? (
    <Link className={baseClasses} href={href} style={style}>
      {buttonContent}
    </Link>
  ) : (
    buttonContent
  );
};

export default AppButton;
