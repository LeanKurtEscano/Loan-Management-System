import React from "react";
import { useMyContext } from '../../../context/MyContext';
import { LoanApplicationDetails } from "../../../constants/interfaces/loanInterface";
const Step6 = ({
  nextStep,
  prevStep,
}: {
  nextStep: () => void;
  prevStep: () => void;
}) => {
    const { loanApplication, setLoanApplication } = useMyContext();
    const storedAmount = sessionStorage.getItem("amount");


  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const rawValue = e.target.value.replace(/[^0-9]/g, ""); 
  
    setLoanApplication((prev: LoanApplicationDetails) => ({
          ...prev,
          [name]: rawValue
        }));
  };


  const storeAmount = () => {
    if (loanApplication.amount) {
      sessionStorage.setItem("amount", loanApplication.amount);
    }
  };

  const handleNext = () => {
    storeAmount();
    nextStep();
  };

  return (
    <div className="flex  justify-center h-screen">
      <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-lg w-[500px] h-[300px]">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Enter Loan Amount
        </h1>

   
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Amount (₱):
          </label>
          <input
            type="text"
            name="amount"
            value={loanApplication.amount ?? storedAmount}
            onChange={handleAmountChange}
            placeholder="Enter amount in PHP"
            className="w-full px-4 py-3 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

     
        <div className="flex justify-between mt-6">
          <button
            onClick={prevStep}
            className="bg-blue-500 cursor-pointer text-white text-lg px-6 py-3 rounded-xl hover:bg-blue-600 transition w-[45%]"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!loanApplication.amount || Number(loanApplication.amount) <= 0}
            className={`text-lg px-6 py-3 cursor-pointer rounded-xl transition w-[45%] ${
              !loanApplication.amount || Number(loanApplication.amount) <= 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step6;
