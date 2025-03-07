import React, { createContext, useState, useContext, useEffect } from 'react';
const MyContext = createContext<any>(null);

export const MyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  return (
    <MyContext.Provider value={{ isAuthenticated, setIsAuthenticated,setIsAdminAuthenticated,isAdminAuthenticated}}>
      {children}
    </MyContext.Provider>
  );
};


export const useMyContext = () => {
  return useContext(MyContext);
};
