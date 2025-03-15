'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface SideMenuBoxProps {
  href: string;
  icon: string;
  active?: boolean;
}

const SideMenuBox = ({href, icon, active}: SideMenuBoxProps) => {
  return (
    <>
      <Link
        href={href}
        className={`flex justify-center items-center w-10 h-10 rounded-md ${
          active ? 'bg-gray-200' : 'bg-[#141316]'
        }`}
      >
        <Image src={icon} alt='' className='w-20 h-20 fill-white' />
      </Link>
    </>
  );
};

export default SideMenuBox;
