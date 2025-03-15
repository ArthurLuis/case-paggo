'use client';
import React from 'react';
import {useSession} from 'next-auth/react';

import {signIn, signOut} from '@/auth/helpers';

const AuthButtonClient = () => {
  const {data: session, status} = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return session?.user ? (
    <div
      onClick={async () => {
        await signOut();
        await signIn();
      }}
      className={`flex items-center justify-center px-6 py-1 rounded-lg cursor-pointer font-normal text-xl shadow-md hover:shadow-lg transition duration-200 max-w-[120px]`}
    >
      SignOut
    </div>
  ) : (
    <div
      onClick={async () => {
        await signIn();
      }}
      className={`flex items-center justify-center px-6 py-1 rounded-lg cursor-pointer font-normal text-xl shadow-md hover:shadow-lg transition duration-200 max-w-[120px]`}
    >
      Login
    </div>
  );
};

export default AuthButtonClient;
