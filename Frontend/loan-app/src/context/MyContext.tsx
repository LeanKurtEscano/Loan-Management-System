import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserDetails } from '../services/user/userData';
import { useQuery } from '@tanstack/react-query';
import { UserDetails } from '../constants/interfaces/authInterface';
import { LoanApplicationDetails } from '../constants/interfaces/loanInterface';
const MyContext = createContext<any>(null);
export const MyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [toggleLog, setToggleLog] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    !!localStorage.getItem("admin_token") 
  );

  const [loanApplication, setLoanApplication] = useState<LoanApplicationDetails>({
    idNumber: "",
    employment: "",
    income: "",
  })

  const { data, isLoading, isError, refetch } = useQuery<UserDetails>(
    ["userDetails"],
    getUserDetails,
    {
      onSuccess: (fetchedData) => {
        setUserDetails(fetchedData); 
      },
    }
  );

  console.log(userDetails);
  

  return (
    <MyContext.Provider value={{ isAuthenticated,loanApplication,setLoanApplication, setIsAuthenticated,setIsAdminAuthenticated,isAdminAuthenticated,isVerified, userDetails, setIsVerified,toggleLog, setToggleLog}}>
      {children}
    </MyContext.Provider>
  );
};


export const useMyContext = () => {
  return useContext(MyContext);
};
