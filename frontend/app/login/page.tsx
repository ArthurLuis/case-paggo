import Image from 'next/image';
import React from 'react';
import Paggo from '../../public/images/paggo.jpg';

import AuthButton from '../components/AuthButton/AuthButton.server';

const Login = () => {
  return (
    <>
      <div className='flex h-screen w-screen items-center justify-center'>
        {/* Container central para alinhar verticalmente */}
        <div className='flex w-[894px] h-screen flex-col items-center justify-center gap-4 bg-white '>
          <Image src={Paggo} alt='Company Symbol' width={264} height={226} />
          <h1 className='text-lg text-[24px] leading-[52px] tracking-[0.48px] text-[#1E252B] opacity-100font-nunito font-semibold mb-16'>
            Entrar na Plataforma
          </h1>
          <AuthButton />
        </div>
      </div>
    </>
  );
};

export default Login;
