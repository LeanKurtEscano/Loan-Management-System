import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import gcash from "../../../assets/gcash.png";
import maya from "../../../assets/maya.png";
import { useMyContext } from "../../../context/MyContext";
import { LoanSubmission } from "../../../constants/interfaces/loanInterface";
import { validateContactNumber } from "../../../utils/validation";

const Step5 = ({ prevStep, nextStep }: { prevStep: () => void; nextStep: () => void }) => {
  const { loanSubmission, setLoanSubmission } = useMyContext();
  const [contactError, setContactError] = useState<string>("");

  const handleSelect = (option: string) => {
    setLoanSubmission((prev: LoanSubmission) => ({
      ...prev,
      cashout: prev.cashout === option ? "" : option, 
    }));
  };

  useEffect(() => {
    const storedLoanAmount = localStorage.getItem("loanAmount");
    if (storedLoanAmount) {
      setLoanSubmission((prev: LoanSubmission) => ({
        ...prev,
        loanAmount: Number(JSON.parse(storedLoanAmount)), 
      }));
    }
  }, []);

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLoanSubmission((prev: LoanSubmission) => ({ 
      ...prev, 
      contactNumber: value 
    }));
    
    // Validate on change but only show error after user starts typing
    if (value) {
      setContactError(validateContactNumber(value));
    } else {
      setContactError("");
    }
  };

  const handleContinue = () => {
    // Validate before proceeding
    const error = validateContactNumber(loanSubmission.contactNumber || "");
    setContactError(error);
    
    if (error || !loanSubmission.cashout) {
      return; // Don't proceed if there's an error or no cashout method selected
    }
    
    const deduction = loanSubmission.cashout === "gcash" ? 10 : loanSubmission.cashout === "maya" ? 15 : 0;
    const storedTotalPayment = Number(JSON.parse(localStorage.getItem("totalPayment") || "0"));
    
    const updatedTotalPayment = storedTotalPayment - deduction;
    setLoanSubmission((prev: LoanSubmission) => ({
      ...prev,
      loanAmount: (prev.loanAmount ?? 0) - deduction,
      totalPayment: updatedTotalPayment
    }));
  
    nextStep();
  };

  // Calculate amount to receive based on selected method
  const calculateAmountToReceive = () => {
    if (!loanSubmission.loanAmount) return 0;
    
    if (loanSubmission.cashout === "gcash") {
      return loanSubmission.loanAmount - 10;
    } else if (loanSubmission.cashout === "maya") {
      return loanSubmission.loanAmount - 15;
    }
    return loanSubmission.loanAmount;
  };
  
  const amountToReceive = calculateAmountToReceive();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white border border-gray-300 rounded-lg shadow-xl w-full max-w-lg p-8 md:p-10"
      >
        <motion.h3 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold mb-6 text-center text-gray-800"
        >
          CASHOUT OPTIONS
        </motion.h3>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="mb-6"
        >
          <label htmlFor="contactNumber" className="block font-medium text-gray-700 mb-2">
            Enter the Contact Number where you want to receive your money:
          </label>

          <input
            type="text"
            name="contactNumber"
            id="contactNumber"
            value={loanSubmission.contactNumber || ""}
            onChange={handleContactChange}
            onBlur={() => setContactError(validateContactNumber(loanSubmission.contactNumber || ""))}
            placeholder="09XXXXXXXXX"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              contactError ? "border-red-500" : "border-gray-300"
            }`}
          />
          
          {contactError && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-2 text-sm text-red-600"
            >
              {contactError}
            </motion.p>
          )}
        </motion.div>

        <p className="font-medium text-gray-700 mb-3">Select your cashout method:</p>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
          className={`cursor-pointer p-4 border-2 rounded-lg mb-4 flex items-center justify-between hover:bg-blue-50 transition ${
            loanSubmission.cashout === "gcash" 
              ? "border-blue-500 bg-blue-50 shadow-md" 
              : "border-gray-300"
          }`}
          onClick={() => handleSelect("gcash")}
        >
          <div className="text-left">
            <h4 className="font-semibold text-gray-800">GCASH (InstaPay)</h4>
            <p className="text-sm text-gray-600">Processing Time: <span className="font-medium">Instant</span></p>
            <p className="text-sm text-gray-600">Service Fee: <span className="font-medium">PHP 10</span></p>
            {loanSubmission.cashout === "gcash" && (
              <p className="text-sm font-semibold mt-1 text-blue-600">
                You'll receive: PHP {amountToReceive.toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex flex-col items-center">
            <img src={gcash} alt="GCash Logo" className="w-16 h-16 object-contain" />
          
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
          className={`cursor-pointer p-4 border-2 rounded-lg mb-4 flex items-center justify-between hover:bg-blue-50 transition ${
            loanSubmission.cashout === "maya" 
              ? "border-blue-500 bg-blue-50 shadow-md" 
              : "border-gray-300"
          }`}
          onClick={() => handleSelect("maya")}
        >
          <div className="text-left">
            <h4 className="font-semibold text-gray-800">Maya (InstaPay)</h4>
            <p className="text-sm text-gray-600">Processing Time: <span className="font-medium">Instant</span></p>
            <p className="text-sm text-gray-600">Service Fee: <span className="font-medium">PHP 15</span></p>
            {loanSubmission.cashout === "maya" && (
              <p className="text-sm font-semibold mt-1 text-blue-600">
                You'll receive: PHP {amountToReceive.toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex flex-col items-center">
            <img src={maya} alt="Maya Logo" className="w-16 h-16 object-contain" />
           
          </div>
        </motion.div>

        {!loanSubmission.cashout && (
          <p className="text-sm text-amber-600 mt-2 mb-4">
            Please select a cashout method to continue
          </p>
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-between mt-8 px-2"
        >

          <button
            onClick={prevStep}
            className="flex items-center cursor-pointer justify-center text-gray-700 font-medium py-3 px-6 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none w-full max-w-xs mr-2 transition"
          >
            ← Go Back
          </button>

          <button
            onClick={handleContinue}
            disabled={!!contactError || !loanSubmission.cashout}
            className={`flex items-center justify-center cursor-pointer font-medium py-3 px-6 rounded-md w-full max-w-xs ml-2 transition ${
              contactError || !loanSubmission.cashout
                ? "bg-blue-300 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Proceed to Loan →
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Step5;