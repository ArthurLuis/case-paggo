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
      <div
        className={`
          mt-20
          sm:mt-24
          md:mt-28
          lg:mt-32 lg:ml-44 lg:mr-10

          px-4 pt-4 pb-8
          sm:px-6 sm:pt-6 sm:pb-10
          md:px-8 md:pt-8 md:pb-12
          lg:px-0 lg:pt-0 lg:pb-0
        `}
      >
        {children}
      </div>
    </>
  );
};

export default AppScreen;
