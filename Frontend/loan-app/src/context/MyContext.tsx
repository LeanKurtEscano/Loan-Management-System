import React, { createContext, useState, useContext, useEffect } from 'react';
import { UserDetails } from '../constants/interfaces/authInterface';
import { LoanApplicationDetails,AdminApprove, LoanSubmission } from '../constants/interfaces/loanInterface';
import { SubmitDisbursement } from '../constants/interfaces/disbursement';
import useVerificationStatus from '../hooks/useVerificationStatus';
const MyContext = createContext<any>(null);
export const MyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  const [toggleLog, setToggleLog] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    !!localStorage.getItem("admin_token") 
  );
  const [approveLoan , setApproveLoan] = useState<AdminApprove>({
    loanAmount:null,
    interest:null,
    duration:null,
  })

  const { isVerified } = useVerificationStatus();

  const [emailDetails, setEmailDetails] = useState({
    subject:"",
    description:""
  })


  const [loanSubmission, setLoanSubmission] = useState<LoanSubmission>({
    loanId: null,
   idSelfie: null,
   paymentFrequency: "",
   repayDate:"",
   contactNumber: "",
   loanAmount:null,
   cashout: "",
   totalPayment: 0,
  })


  const [disbursement, setDisbursement] = useState<SubmitDisbursement>({
    periodPayment: [],
    penalty: false,
    receipt: null,
    email: "",
    disbursementId: null
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
 const [unreadCount, setUnreadCount] = useState<number>(0);
 const [penalty, setPenalty] = useState<number>(0);
const [noOfPenaltyDelay, setNoOfPenaltyDelay] = useState(0);
  




  return (
    <MyContext.Provider value={{noOfPenaltyDelay,setNoOfPenaltyDelay,penalty,unreadCount,setUnreadCount, setPenalty,loanSubmission, setLoanSubmission, toggle,emailDetails,setEmailDetails,approveLoan,setApproveLoan, setToggle,isAuthenticated,loanApplication,setLoanApplication, setIsAuthenticated,setIsAdminAuthenticated,isAdminAuthenticated,isVerified, userDetails,toggleLog, setToggleLog, disbursement, setDisbursement}}>
      {children}
    </MyContext.Provider>
  );
};


export const useMyContext = () => {
  return useContext(MyContext);
};
