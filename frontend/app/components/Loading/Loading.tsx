'use client';
import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '@/public/loading.json';

interface LoadingProps {
  isLoading: boolean;
  progress?: number;
  showProgress?: boolean;
}

const Loading = ({
  isLoading,
  progress = 0,
  showProgress = false,
}: LoadingProps) => {
  return (
    isLoading && (
      <div className='flex flex-col items-center justify-center'>
        <div className='w-64 h-64'>
          <Lottie animationData={loadingAnimation} loop autoPlay />
        </div>

        {showProgress && (
          <div className='w-32 h-1 bg-gray-300 mt-2 rounded-full overflow-hidden'>
            <div
              className='h-full bg-black transition-all'
              style={{width: `${progress}%`}}
            />
          </div>
        )}
      </div>
    )
  );
};

export default Loading;
