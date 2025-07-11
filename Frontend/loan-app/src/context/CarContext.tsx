import React, { createContext, useState, useContext, useEffect } from 'react';
import { UserDetails } from '../constants/interfaces/authInterface';
import { LoanApplicationDetails,AdminApprove, LoanSubmission } from '../constants/interfaces/loanInterface';
import { SubmitDisbursement } from '../constants/interfaces/disbursement';
import useVerificationStatus from '../hooks/useVerificationStatus';
const CarContext = createContext<any>(null);
export const MyCarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
 

  const [carDisbursement, setCarDisbursement] = useState<SubmitDisbursement>({
     periodPayment: [],
     penalty: false,
     receipt: null,
     email: "",
     disbursementId: null
   })
   const [carPenalty, setCarPenalty] = useState<number>(0);
  const [carNoOfPenaltyDelay, setCarNoOfPenaltyDelay] = useState(0);
  




  return (
    <CarContext.Provider value={{carDisbursement, setCarDisbursement, carPenalty, setCarPenalty, carNoOfPenaltyDelay, setCarNoOfPenaltyDelay}}>
      {children}
    </CarContext.Provider>
  );
};


export const useCarContext = () => {
  return useContext(CarContext);
};
