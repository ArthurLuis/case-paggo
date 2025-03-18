'use client';import Image from 'next/image';
import React, {useState} from 'react';
import Paggo from '../../../public/images/paggo.jpg';
import AppInput from '../components/AppInput/AppInput';
import axios from 'axios';
import {AxiosError} from 'axios';
import {useRouter} from 'next/navigation';

const loginUser = async (email: string, password: string) => {
  const loginUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`;
  try {
    const response = await axios.post(loginUrl, {email, password});

    if (response.status === 200) {
      document.cookie = `authToken=${response.data.access_token}; max-age=86400; path=/; Secure; SameSite=Strict`;
      return response.data.access_token;
    } else {
      throw new Error('Falha na autenticação');
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return null;
  }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Iniciando o useRouter

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const token = await loginUser(email, password);

      if (token) {
        router.push('/dashboard');
      } else {
        setError('Credenciais inválidas. Tente novamente.');
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          if (error.response.status === 401) {
            setError('Credenciais inválidas. Verifique seu e-mail e senha.');
          } else if (error.response.status === 500) {
            setError('Erro no servidor. Tente novamente mais tarde.');
          } else {
            setError(`Erro desconhecido: ${error.response.status}`);
          }
        } else if (error.request) {
          setError('Erro de conexão. Tente novamente mais tarde.');
        }
      } else {
        setError('Erro ao fazer login. Tente novamente.');
      }
    }
  };

  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <div className='flex w-full max-w-[894px] flex-col items-center justify-center gap-4 bg-white p-8'>
        <Image src={Paggo} alt='Company Symbol' width={264} height={226} />
        <h1 className='text-[24px] leading-[52px] tracking-[0.48px] text-[#1E252B] font-nunito font-semibold mb-16'>
          Entrar na Plataforma
        </h1>

        <form
          className='w-full flex flex-col items-center gap-4'
          onSubmit={handleSubmit}
        >
          <AppInput
            type='text'
            placeholder='Digite seu e-mail'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            width={500}
          />
          <AppInput
            type='password'
            placeholder='Digite sua senha'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            width={500}
          />

          {error && <p className='text-red-500'>{error}</p>}

          <button
            type='submit'
            className='w-1/2 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none'
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
