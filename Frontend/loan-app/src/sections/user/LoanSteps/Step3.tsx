import React, { useEffect } from "react";
import { useMyContext } from "../../../context/MyContext";
import { LoanSubmission } from "../../../constants/interfaces/loanInterface";
import { formatCurrency } from "../../../utils/formatCurrency";
import { useQuery } from "@tanstack/react-query";
import { getLoanApplication } from "../../../services/user/userData";
const Step3 = ({
  prevStep,
  nextStep,
}: {
  prevStep: () => void;
  nextStep: () => void;
}) => {
  const { loanSubmission, setLoanSubmission } = useMyContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoanSubmission((prev: LoanSubmission) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { data, isLoading, isError } = useQuery(["userLoanApplication"], getLoanApplication);

  // Calculate service fee (interest percentage * loan amount)
  const serviceFee = data?.interest ? (loanSubmission.loanAmount * data.interest) / 100 : 0;
  const totalPayment = Number(loanSubmission.loanAmount) + Number(serviceFee);
   

  useEffect(() => {
     setLoanSubmission((prev:LoanSubmission) => ({...prev, totalPayment: totalPayment}))
     
 
  },[])
  const handleContinue = () => {
    nextStep();
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 border border-gray-300 rounded-xl shadow-xl w-[500px] text-center">
        {/* Header */}
        <h2 className="text-3xl font-bold mb-4 text-gray-700"></h2>
        <h3 className="text-2xl font-semibold mb-3 text-gray-800">CHOOSE WHEN TO REPAY</h3>
        <p className="text-base mb-6 text-gray-600">
          Please select the date by which you plan to repay the loan.
        </p>

        {/* Date Picker */}
        <div className="mb-6">
          <input
            name="repayDate"
            type="date"
            value={loanSubmission.repayDate}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg w-3/4 text-center text-gray-700 shadow-sm focus:outline-blue-500"
          />
        </div>

        {/* Loan Summary */}
        <div className="p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">
            Borrowed Amount: <span className="font-semibold">{formatCurrency(loanSubmission.loanAmount)}</span>
          </p>
          <p className="text-sm text-gray-600 mb-1">
            Service Fee (Interest): <span className="font-semibold">{formatCurrency(serviceFee)}</span>
          </p>
          <p className="text-lg font-bold text-gray-800">
            Total Payment: {formatCurrency(totalPayment)}
          </p>
        </div>

        {/* Buttons Row */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            className="bg-gray-400 text-white cursor-pointer font-semibold py-2 px-6 rounded-md hover:bg-gray-500 transition"
          >
            Go Back
          </button>

          <button
            onClick={handleContinue}
            className={`${
              !loanSubmission.repayDate ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
            } text-white font-semibold py-3 px-5 rounded-md transition`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3;
