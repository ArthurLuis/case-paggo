'use client';
import {useRouter} from 'next/navigation'; // Atualizando para usar next/navigation
import React, {useEffect, ReactNode, useState} from 'react';

const AuthRedirect: React.FC<{children: ReactNode}> = ({children}) => {
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
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
      router.replace('/dashboard'); // Redireciona sem permitir voltar
      return; // Early return para evitar execução do resto do código
    }

    setIsCheckingAuth(false); // Permite que o conteúdo seja renderizado quando não houver token
  }, [router]);

  if (isCheckingAuth) {
    return <p>Carregando...</p>; // Retorna JSX corretamente
  }

  return <>{children}</>;
};

export default AuthRedirect;
