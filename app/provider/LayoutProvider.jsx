'use client'
import { usePathname } from 'next/navigation';
import React, { createContext } from 'react'
import Navbar from '../conponents/Nav/Navbar.';
const LayoutContext = createContext();
const LayoutProvider = ({ children }) => {
    const skipHeader =["/","/login"]
    const pathname = usePathname();
    let skip = skipHeader.filter(f=>f === pathname)
    return (
        <LayoutContext.Provider
        value={{ }}
      >
   
        {skip.length === 0 && <Navbar />}
        {children}
   
      </LayoutContext.Provider>
    )
}
export const useVerifyUser = () => {
    return useContext(LayoutContext);
  };

export default LayoutProvider