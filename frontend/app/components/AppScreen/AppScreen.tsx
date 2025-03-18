'use client';
import React, {useEffect, useState} from 'react';
import {useRouter, usePathname} from 'next/navigation';
import TopBar from '../TopBar/TopBar';
import Loading from '../Loading/Loading';

interface AppScreenProps {
  children: React.ReactNode;
}

const AppScreen: React.FC<AppScreenProps> = ({children}) => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie
        .split('; ')
        .reduce<{[key: string]: string}>((acc, cookie) => {
          const [name, value] = cookie.split('=');
          acc[name] = value;
          return acc;
        }, {});

      const isAuthenticated = !!cookies.authToken;
      const isLoginPage = pathname === '/login';

      if (!isAuthenticated && !isLoginPage) {
        router.replace('/login');
      }

      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [router, pathname]);

  if (isCheckingAuth) {
    return <Loading isLoading />;
  }

  return (
    <>
      <TopBar />
      <div className='mt-32 ml-44 mr-10'>{children}</div>
    </>
  );
};

export default AppScreen;
