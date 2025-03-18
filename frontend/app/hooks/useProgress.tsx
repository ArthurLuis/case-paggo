import {useState} from 'react';import axios from 'axios';

const useProgress = () => {
  const [progress, setProgress] = useState(0);

  const instance = axios.create();

  instance.interceptors.request.use((config) => {
    setProgress(10); // Começa com 10% para evitar 0%
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      setProgress(100); // Quando a resposta chega, define como 100%
      setTimeout(() => setProgress(0), 500); // Reseta após um tempo curto
      return response;
    },
    (error) => {
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
      return Promise.reject(error);
    }
  );

  return {instance, progress, setProgress};
};

export default useProgress;
