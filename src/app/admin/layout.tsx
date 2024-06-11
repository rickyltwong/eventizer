import React from 'react';
import {Navbar} from './navbar';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      <main style={{ flexGrow: 1 }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
