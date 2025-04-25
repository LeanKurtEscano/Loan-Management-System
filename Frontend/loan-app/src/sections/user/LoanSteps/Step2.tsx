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
  const { loanSubmission, setLoanSubmission } = useMyContext();
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery(
    ["userLoanApplication"],
    getLoanApplication
  );

  const maxLoanAmount = data?.loan_amount || 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValue = e.target.value;
    const numericValue = parseFloat(updatedValue);
    
    // Clear error when user is typing
    setError(null);
    
    setLoanSubmission((prev: LoanSubmission) => {
      const newSubmission = { ...prev, loanAmount: updatedValue };
      localStorage.setItem("loanAmount", JSON.stringify(updatedValue));
      return newSubmission;
    });
    
    // Validate loan amount when changed
    if (numericValue > maxLoanAmount) {
      setError(`Amount exceeds your eligible loan amount of ${formatCurrency(maxLoanAmount)} PHP`);
    }
  };

  const handleProceed = () => {
    const numericValue = parseFloat(loanSubmission.loanAmount || "0");
    
    if (numericValue <= 0) {
      setError("Please enter a valid loan amount");
      return;
    }
    
    if (numericValue > maxLoanAmount) {
      setError(`Amount exceeds your eligible loan amount of ${formatCurrency(maxLoanAmount)} PHP`);
      return;
    }
    
    nextStep();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-10 border border-gray-300 rounded-lg shadow-lg w-[500px] text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-500">Error Loading Data</h2>
          <p className="text-base mb-6 text-gray-600">
            Unable to load your loan application data. Please try again later.
          </p>
          <button
            onClick={prevStep}
            className="bg-blue-500 text-white cursor-pointer font-semibold py-3 px-5 rounded-md hover:bg-blue-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-8">
      <div className="bg-white p-10 border border-gray-300 rounded-lg shadow-lg w-[550px] text-center mx-4">
        <div className="mb-4">
          <div className="inline-block bg-green-100 rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-4 text-blue-700">CONGRATULATIONS!</h2>
        <p className="text-lg mb-6 text-gray-600">
          You're eligible for a loan! Only take what you need. You can always apply again as long as you pay on time.
        </p>

        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h3 className="text-4xl font-semibold text-blue-800 mb-3">
            {formatCurrency(maxLoanAmount)} PHP
          </h3>
          <p className="text-lg text-blue-700 mb-1">
            Maximum Eligible Amount
          </p>
          <p className="text-base text-gray-600 mb-0">
            Interest Rate: <span className="font-semibold text-gray-800">{data?.interest || 0}%</span>
          </p>
        </div>

        <div className="mb-8">
          <label htmlFor="loanAmount" className="block text-left text-lg font-medium text-gray-700 mb-2">
            Enter desired loan amount:
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 font-medium">
              PHP
            </span>
            <input
              id="loanAmount"
              name="loanAmount"
              type="number"
              placeholder="0.00"
              value={loanSubmission.loanAmount}
              onChange={handleChange}
              className="w-full p-4 pl-14 border border-gray-300 rounded-md text-right text-xl mb-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm text-left mt-1">{error}</p>
          )}
          <p className="text-sm text-gray-500 text-left">
            Max amount: {formatCurrency(maxLoanAmount)} PHP
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 mt-6">
          <button
            onClick={prevStep}
            className="order-2 md:order-1 bg-white border border-gray-300 text-gray-700 cursor-pointer font-semibold py-3 px-6 rounded-md hover:bg-gray-50 transition flex-1"
          >
            ← Go Back
          </button>

          <button
            onClick={handleProceed}
            disabled={!loanSubmission.loanAmount || parseFloat(loanSubmission.loanAmount) <= 0 || parseFloat(loanSubmission.loanAmount) > maxLoanAmount || !!error}
            className={`
              order-1 md:order-2 font-semibold py-3 px-6 rounded-md transition flex-1
              ${
                !loanSubmission.loanAmount || parseFloat(loanSubmission.loanAmount) <= 0 || parseFloat(loanSubmission.loanAmount) > maxLoanAmount || !!error
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              }
            `}
          >
            Proceed to Loan →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2;