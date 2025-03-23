import React, { createContext, useState, useContext, useEffect } from 'react';
import { UserDetails } from '../constants/interfaces/authInterface';
import { LoanApplicationDetails,AdminApprove, LoanSubmission } from '../constants/interfaces/loanInterface';
const MyContext = createContext<any>(null);
export const MyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [toggleLog, setToggleLog] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    !!localStorage.getItem("admin_token") 
  );
  const [approveLoan , setApproveLoan] = useState<AdminApprove>({
    loanAmount:null,
    interest:null,
  })



  const [emailDetails, setEmailDetails] = useState({
    subject:"",
    description:""
  })


  const [loanSubmission, setLoanSubmission] = useState<LoanSubmission>({
   idSelfie: null,
   repayDate:"",
   loanAmount:null,
   cashout: ""
  })


  
  const [ toggle, setToggle] = useState(false);

  const [loanApplication, setLoanApplication] = useState<LoanApplicationDetails>({
    front: null,
    back: null,
    idType: "",
    educationLevel: "",
    employmentStatus: "",
    monthlyIncome: "",
    incomeVariation: "",
    primaryIncomeSource: "",
    otherSourcesOfIncome: [],
    incomeFrequency: "",
    primarySource: "",
    moneyReceive: "",
    totalSpend: "",
    outstanding: "",
    purpose: "",
    explanation: "",
  });
  
  console.log(loanApplication)



  return (
    <MyContext.Provider value={{loanSubmission, setLoanSubmission, toggle,emailDetails,setEmailDetails,approveLoan,setApproveLoan, setToggle,isAuthenticated,loanApplication,setLoanApplication, setIsAuthenticated,setIsAdminAuthenticated,isAdminAuthenticated,isVerified, userDetails, setIsVerified,toggleLog, setToggleLog}}>
      {children}
    </MyContext.Provider>
  );
};


export const useMyContext = () => {
  return useContext(MyContext);
};
