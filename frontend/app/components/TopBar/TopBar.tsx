'use client';
import React, {useEffect, useState} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import Image from 'next/image';
import {FaHome, FaFileAlt, FaSignOutAlt} from 'react-icons/fa';

import Paggo from '../../../public/images/paggo.jpg';
import TopBarBox from './TopBarBox';

const TopBar = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [showLogout, setShowLogout] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se o código está sendo executado no lado do cliente
    if (typeof window !== 'undefined') {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('authToken='))
        ?.split('=')[1];
      setAuthToken(token || null);
    }
  }, []);

  useEffect(() => {
    if (!authToken) return;

    const fetchUserData = async () => {
      try {
        const authResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          {
            headers: {Authorization: `Bearer ${authToken}`},
          }
        );

        if (!authResponse.ok) throw new Error('Erro ao buscar ID do usuário');

        const {userId} = await authResponse.json();

        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`,
          {
            headers: {Authorization: `Bearer ${authToken}`},
          }
        );

        if (!userResponse.ok)
          throw new Error('Erro ao buscar detalhes do usuário');

        const userData = await userResponse.json();
        setUserName(userData.name || 'Usuário');
      } catch (error) {
        console.error('Erro ao buscar nome do usuário:', error);
        setUserName('Usuário');
      }
    };

    fetchUserData();
  }, [authToken]);

  const initial = userName ? userName.charAt(0).toUpperCase() : 'U';

  const handleLogout = () => {
    document.cookie = 'authToken=; Max-Age=0; path=/';
    router.push('/login');
  };

  return (
    <div className='flex bg-[#141316] w-full h-20 shadow-md fixed top-0 left-0 items-center justify-between z-50 px-4'>
      <Image
        className='ml-10'
        src={Paggo}
        alt='Company Symbol'
        width={69}
        height={59}
      />

      <div className='flex items-center justify-center gap-8 flex-grow'>
        <TopBarBox
          href='/dashboard'
          icon={<FaHome size={24} />}
          active={pathname === '/dashboard' || pathname === '/'}
        />
        <TopBarBox
          href='/documents'
          icon={<FaFileAlt size={24} />}
          active={pathname === '/documents'}
        />
      </div>

      <div className='flex pr-10 ml-auto items-center justify-center relative'>
        <p className='mr-3 text-white'>{userName}</p>
        <div
          className='w-10 h-10 bg-gray-600 text-white flex items-center justify-center rounded-full cursor-pointer'
          onClick={() => setShowLogout((prev) => !prev)}
        >
          <p className='text-white font-medium text-[22px]'>{initial}</p>
        </div>

        {showLogout && (
          <div className='absolute right-0 top-12 bg-black text-white shadow-lg rounded-md p-2'>
            <button
              onClick={handleLogout}
              className='flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-800 transition duration-300'
            >
              <FaSignOutAlt size={20} />
              <span>Logoff</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
