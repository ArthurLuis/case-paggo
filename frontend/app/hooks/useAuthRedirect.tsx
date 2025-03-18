'use client';
import {useRouter} from 'next/navigation';
import React, {useEffect, ReactNode, useState} from 'react';
import Loading from '../components/Loading/Loading';

const AuthRedirect: React.FC<{children: ReactNode}> = ({children}) => {
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const cookies = document.cookie
      .split('; ')
      .reduce<{[key: string]: string}>((acc, cookie) => {
        const [name, value] = cookie.split('=');
        acc[name] = value;
        return acc;
      }, {});

    if (cookies.authToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setTimeout(() => {
        router.replace('/login'); // Evita redirecionamento antes da renderização inicial
      }, 100);
    }

    setIsCheckingAuth(false); // Finaliza o carregamento
  }, [router]);

  if (isCheckingAuth) {
    return <Loading isLoading />;
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default AuthRedirect;
