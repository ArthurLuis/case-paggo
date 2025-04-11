'use client';
import React, {useEffect, useRef, useState} from 'react';
import AppInput from '../components/AppInput/AppInput';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import Lottie from 'lottie-react';
import {AnimatePresence, motion} from 'framer-motion';
import docAnimated from '@/public/docAnimated.json';
import ocrAnimated from '@/public/ocrAnimated.json';
import chatAnimated from '@/public/chatAnimated.json';
import appLogo from '@/public/images/escaneialogo.png';
import Image from 'next/image';

const animations = [
  {animation: docAnimated, text: 'Envie uma imagem com texto'},
  {animation: ocrAnimated, text: 'O sistema irá extrair o texto da imagem'},
  {animation: chatAnimated, text: 'Converse com a IA para entender o conteúdo'},
];

const loginUser = async (email: string, password: string) => {
  const loginUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`;
  try {
    const response = await axios.post(loginUrl, {email, password});
    if (response.status === 200) {
      document.cookie = `authToken=${response.data.access_token}; max-age=86400; path=/; Secure; SameSite=Strict`;
      return response.data.access_token;
    }
    throw new Error('Falha na autenticação');
  } catch {
    return null;
  }
};

const registerUser = async (name: string, email: string, password: string) => {
  const registerUrl = `${process.env.NEXT_PUBLIC_API_URL}/user`;
  try {
    const response = await axios.post(registerUrl, {name, email, password});
    if (response.status === 201 || response.status === 200) {
      return await loginUser(email, password);
    }
    throw new Error('Falha no registro');
  } catch {
    return null;
  }
};

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    if (!email || !password || (isRegistering && (!name || !passwordConfirm))) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    if (isRegistering && password !== passwordConfirm) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    const token = isRegistering
      ? await registerUser(name, email, password)
      : await loginUser(email, password);

    if (token) {
      router.push('/dashboard');
    } else {
      setError(
        isRegistering
          ? 'Não foi possível registrar. Tente novamente.'
          : 'Credenciais inválidas. Tente novamente.'
      );
      setLoading(false);
    }
  };

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % animations.length);
    }, 15000);
  };

  useEffect(() => {
    resetInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentSlide]);

  return (
    <div className='flex h-screen w-screen items-center justify-center bg-[#060d0d] p-14'>
      <div className='flex w-full h-full bg-[#F2F0EF] rounded-lg'>
        {/* Animações - ocultas em mobile */}
        <div className='hidden md:flex w-1/2 flex-col items-center justify-center p-8 relative'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentSlide}
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.3}}
              className='flex flex-col items-center'
            >
              <Lottie
                animationData={animations[currentSlide].animation}
                loop
                autoPlay
                className='w-[300px] h-[300px]'
              />
              <p className='text-center mt-4 text-[#060d0d] text-lg font-semibold'>
                {animations[currentSlide].text}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className='flex gap-2 mt-6'>
            {animations.map((_, idx) => (
              <button
                key={idx}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  currentSlide === idx
                    ? 'bg-[#060d0d] scale-125'
                    : 'bg-gray-400'
                }`}
                onClick={() => setCurrentSlide(idx)}
              />
            ))}
          </div>
        </div>

        {/* Formulário - ocupa toda largura em mobile */}
        <div className='flex w-full md:w-1/2 flex-col bg-[#060d0d] m-2 rounded-lg justify-center items-center p-8'>
          {/* Título com fade */}
          <div className='transition-opacity duration-500 opacity-100 flex flex-col items-center'>
            <Image
              src={appLogo}
              alt='Logo'
              width={200}
              height={200}
              className='mb-4'
            />

            <h1 className='text-[24px] leading-[52px] tracking-[0.48px] text-[#F2F0EF] font-nunito font-semibold mb-4'>
              {isRegistering ? 'Crie sua Conta' : 'Entrar na Plataforma'}
            </h1>
          </div>

          {/* Form com transições */}
          <form
            onSubmit={handleSubmit}
            className='w-full flex flex-col items-center'
          >
            {/* Campo Nome */}
            <div
              className={`overflow-hidden transition-all duration-500 ${
                isRegistering ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <AppInput
                type='text'
                placeholder='Digite seu nome'
                value={name}
                onChange={(e) => setName(e.target.value)}
                width={300}
              />
            </div>

            {/* Email */}
            <div className='mt-4'>
              <AppInput
                type='text'
                placeholder='Digite seu e-mail'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                width={300}
              />
            </div>

            {/* Espaçamento extra só no registro */}
            <div
              className={`transition-all duration-500 ${
                isRegistering ? 'h-6' : 'h-0'
              }`}
            />

            {/* Senha */}
            <div className='mt-4'>
              <AppInput
                type='password'
                placeholder='Digite sua senha'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                width={300}
              />
            </div>

            {/* Confirmar senha */}
            <div
              className={`overflow-hidden transition-all duration-500 ${
                isRegistering
                  ? 'max-h-40 opacity-100 mt-4'
                  : 'max-h-0 opacity-0'
              }`}
            >
              <AppInput
                type='password'
                placeholder='Confirme sua senha'
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                width={300}
              />
            </div>

            {/* Erro */}
            {error && <p className='text-red-500 mt-2'>{error}</p>}

            {/* Botão */}
            <button
              type='submit'
              disabled={loading}
              className='w-full max-w-[300px] py-3 bg-[#060d0d] border border-solid text-white rounded-md hover:bg-gray-900 focus:outline-none transition-all duration-500 mt-4 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <motion.span
                key={loading ? 'loading' : 'normal'}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.3}}
              >
                {loading
                  ? isRegistering
                    ? 'Registrando...'
                    : 'Entrando...'
                  : isRegistering
                  ? 'Registrar'
                  : 'Entrar'}
              </motion.span>
            </button>
          </form>

          {/* Link alternância */}
          <div className='flex gap-2 mt-4 transition-opacity duration-500'>
            <p className='text-white'>
              {isRegistering ? 'Já tem uma conta?' : 'Não tem uma conta?'}
            </p>
            <p
              className='text-white underline underline-offset-1 hover:underline-offset-4 transition-all duration-300 ease-in-out cursor-pointer'
              onClick={() => {
                if (loading) return;
                setError(null);
                setIsRegistering((prev) => !prev);
              }}
            >
              {isRegistering ? 'Faça Login' : 'Registre-se'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
