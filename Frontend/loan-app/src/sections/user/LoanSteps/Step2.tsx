import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLoanApplication } from "../../../services/user/userData";
import { formatCurrency } from "../../../utils/formatCurrency";
import { useMyContext } from "../../../context/MyContext";
import { LoanSubmission } from "../../../constants/interfaces/loanInterface";
import ImageButton from "../../../components/ImageButton";

const Step2 = ({
  prevStep,
  nextStep,
}: {
  prevStep: () => void;
  nextStep: () => void;
}) => {

  const{loanSubmission,setLoanSubmission} = useMyContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValue = e.target.value;
    setLoanSubmission((prev:LoanSubmission) => {
      const newSubmission = { ...prev, loanAmount: updatedValue };
      localStorage.setItem("loanAmount", JSON.stringify(updatedValue)); 
      return newSubmission;
    });
  };
  const { data, isLoading, isError } = useQuery(
    ["userLoanApplication"],
    getLoanApplication
  );

  const handleProceed = () => {
    
      nextStep();

  };



  return (
    <div className="flex items-center h-screen">
      <div className="bg-white p-10 border border-gray-300 rounded-lg shadow-lg w-[500px] text-center">
  
        <h2 className="text-2xl font-bold mb-4">🎉 CONGRATULATIONS!</h2>
        <p className="text-base mb-6 text-gray-600">
          Only take what you need. You can always draw as long as you pay on time. Happy Loaning!
        </p>
        <h3 className="text-3xl font-semibold text-gray-800 mb-2">
          {formatCurrency(data?.loan_amount || 0)} PHP
        </h3>
        <p className="text-base text-gray-600 mb-2">
          Interest Rate:{" "}
          <span className="font-semibold text-gray-800">
            {data?.interest || 0}%
          </span>
        </p>
        <p className="text-base text-gray-600 mb-6">
          Based on your eligibility, the minimum loan amount you can apply for is PHP {formatCurrency(data?.loan_amount || 0 )} Please proceed accordingly.
        </p>

        {/* Input Field */}
        <input
        name="loanAmount"
          type="number"
          placeholder="Enter loan amount"
          value={loanSubmission.loanAmount}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md text-center text-lg mb-6"
        />

        <div className="flex justify-between mt-6">
          <button
            onClick={prevStep}
            className="bg-gray-400 text-white cursor-pointer font-semibold py-3 px-5 rounded-md hover:bg-gray-500 transition"
          >
            Go Back
          </button>

          <button
            onClick={handleProceed}
            disabled={!loanSubmission.loanAmount}
            className={`${
              !loanSubmission.loanAmount
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
            } text-white font-semibold py-3 px-5 rounded-md transition`}
          >
            Proceed TO-LOAN
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2;
