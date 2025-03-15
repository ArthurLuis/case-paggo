import React from 'react';
import TopBar from '../TopBar/TopBar';
import SideMenu from '../SideMenu/SideMenu';

interface AppScreenProps {
  children: React.ReactNode;
}

const AppScreen: React.FC<AppScreenProps> = ({children}) => {
  return (
    <>
      <TopBar />
      <SideMenu />
      <div className='mt-32 ml-44 mr-10'>{children}</div>
    </>
  );
};

export default AppScreen;
