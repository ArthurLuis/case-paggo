'use client'; // Marca o componente como cliente

import React from 'react';
import {usePathname} from 'next/navigation'; // Importa usePathname do Next.js 13+
import Link from 'next/link'; // Importa o componente Link

import SideMenuBox from './SideMenuBox/SideMenuBox';

import cat from '../../../public/images/sideMenu/cat.svg';
import home from '../../../public/images/sideMenu/home.svg';
import menu from '../../../public/images/sideMenu/menu.svg';

const SideMenu = () => {
  const pathname = usePathname(); // Usa o hook usePathname para acessar a rota atual

  return (
    <div className='flex flex-col bg-[#141316] w-24 h-[300px] fixed top-24 left-4 rounded-lg shadow-lg items-center gap-10 z-50'>
      <div className='mt-7 mb-7'>
        <Link href='/Dashboard'>
          <SideMenuBox icon={menu} href='/dashboard' />
        </Link>
      </div>
      <Link href='/dashboard'>
        <SideMenuBox
          icon={home}
          href='/dashboard'
          active={pathname === '/dashboard' || pathname === '/'}
        />
      </Link>
      <Link href='/viewDocuments'>
        <SideMenuBox
          icon={cat}
          href='/viewDocuments'
          active={pathname === '/viewDocuments'}
        />
      </Link>
    </div>
  );
};

export default SideMenu;
