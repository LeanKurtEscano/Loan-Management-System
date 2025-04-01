import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import gcash from "../../../assets/gcash.png";
import maya from "../../../assets/maya.png";
import { useMyContext } from "../../../context/MyContext";
import { LoanSubmission } from "../../../constants/interfaces/loanInterface";

const Step5 = ({ prevStep, nextStep }: { prevStep: () => void; nextStep: () => void }) => {
  const { loanSubmission, setLoanSubmission } = useMyContext();

  // Function to select cashout method (without deducting loanAmount)
  const handleSelect = (option: string) => {
    setLoanSubmission((prev: LoanSubmission) => ({
      ...prev,
      cashout: option, // Just update the selected method
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
  

  // Function to confirm selection and apply the deduction
  const handleContinue = () => {
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
  

  return (
    <div className="flex items-center justify-center h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white border border-gray-300 rounded-lg shadow-xl w-[500px] p-14 text-center"
      >
        <h3 className="text-xl font-semibold mb-4">CASHOUT OPTIONS</h3>

        {/* Contact Number Input */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="mb-6 text-left"
        >
          <label htmlFor="contactNumber" className="block font-semibold mb-2">
            Enter the Contact Number where you want to receive your money:
          </label>

          <input
            type="text"
            name="contactNumber"
            id="contactNumber"
            value={loanSubmission.contactNumber}
            onChange={(e) => setLoanSubmission((prev: LoanSubmission) => ({ ...prev, contactNumber: e.target.value }))}
            placeholder="09XXXXXXXXX"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </motion.div>

        {/* GCash Option */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
          className={`cursor-pointer p-4 border-2 rounded-lg mb-4 flex items-center justify-between transition ${
            loanSubmission.cashout === "gcash" ? "border-blue-500 shadow-md" : "border-gray-300"
          }`}
          onClick={() => handleSelect("gcash")}
        >
          <div className="text-left">
            <h4 className="font-semibold">GCASH (InstaPay)</h4>
            <p className="text-sm text-gray-600">Processing Time: Instant</p>
            <p className="text-sm text-gray-600">Service Fee: PHP 10</p>
            <p className="text-sm font-semibold">
              You'll receive: {loanSubmission.loanAmount - 10} PHP
            </p>
          </div>
          <img src={gcash} alt="GCash Logo" className="w-16 h-16" />
        </motion.div>

        {/* Maya Option */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
          className={`cursor-pointer p-4 border-2 rounded-lg flex items-center justify-between transition ${
            loanSubmission.cashout === "maya" ? "border-blue-500 shadow-md" : "border-gray-300"
          }`}
          onClick={() => handleSelect("maya")}
        >
          <div className="text-left">
            <h4 className="font-semibold">Maya (InstaPay)</h4>
            <p className="text-sm text-gray-600">Processing Time: Instant</p>
            <p className="text-sm text-gray-600">Service Fee: PHP 15</p>
            <p className="text-sm font-semibold">
              You'll receive: {loanSubmission.loanAmount - 15} PHP
            </p>
          </div>
          <img src={maya} alt="Maya Logo" className="w-16 h-16" />
        </motion.div>

        <div className="flex justify-between mt-6">
          <button
            onClick={prevStep}
            className="bg-gray-400 text-white cursor-pointer font-semibold py-2 px-4 rounded-md hover:bg-gray-500 transition"
          >
            Go Back
          </button>

          <button
            onClick={handleContinue}
            className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white font-semibold py-2 px-4 rounded-md transition"
          >
            Continue
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Step5;
