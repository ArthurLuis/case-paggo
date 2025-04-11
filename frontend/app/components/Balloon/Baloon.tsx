'use client';import React from 'react';
import {motion} from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface BalloonProps {
  children: React.ReactNode;
  type: 'user' | 'app';
}

const Balloon = ({children, type}: BalloonProps) => {
  const content = typeof children === 'string' ? children : '';

  return (
    <motion.div
      initial={{scale: 0.7, opacity: 0}}
      animate={{scale: 1, opacity: 1}}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 10,
        delay: type === 'app' ? 0.5 : 0,
      }}
      className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          rounded-lg shadow-md p-4 mb-6
          max-w-full sm:max-w-[80%]
          break-words
          ${
            type === 'user'
              ? 'bg-[#1E1E1E] text-white'
              : 'bg-[#F5F5F5] text-black'
          }
        `}
      >
        {content ? <ReactMarkdown>{content}</ReactMarkdown> : children}
      </div>
    </motion.div>
  );
};

export default Balloon;
