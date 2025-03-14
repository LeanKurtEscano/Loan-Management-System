import React from 'react';
import { useMyContext } from '../../../context/MyContext';
import { LoanApplicationDetails } from '../../../constants/interfaces/loanInterface';
const Step3 = ({ nextStep, prevStep }: { nextStep: () => void; prevStep: () => void }) => {
  const { setLoanApplication} = useMyContext();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name , value} = e.target;
    setLoanApplication((prev : LoanApplicationDetails) => ({...prev, [name]: value}));
  }
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[500px]">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Input your income</h1>
        <div className="relative mb-6">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">₱</span>
          <input
            type="number"
            placeholder="Enter amount"
            className="pl-8 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex justify-between">
          <button onClick={prevStep} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition">Back</button>
          <button onClick={nextStep} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">Next</button>
        </div>
      </div>
    </div>
  );
};

export default Step3;
