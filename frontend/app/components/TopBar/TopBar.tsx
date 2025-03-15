import React from 'react';
import Paggo from '../../../public/images/paggo.jpg';
import Image from 'next/image';

// interface TopBarTypes {}

const TopBar = () => {
  return (
    <>
      <div className='flex bg-[#141316] w-full h-20 shadow-md fixed top-0 left-0 items-center justify-center z-50'>
        <Image
          className='ml-10'
          src={Paggo}
          alt='Company Symbol'
          width={69}
          height={59}
        />
        <div className='flex pr-10 ml-auto items-center justify-center'>
          <p className='mr-3 text-white'>Arthur</p>
          <div className='w-10 h-10 bg-[#1b2b21] text-white flex items-center justify-center rounded-full'>
            <p className='text-white font-medium text-[22px] '>A</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopBar;
