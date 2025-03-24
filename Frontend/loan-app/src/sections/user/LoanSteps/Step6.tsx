import React from 'react';
import { useMyContext } from '../../../context/MyContext';

const Step6 = ({
  prevStep,
 
}: {
  prevStep: () => void;
 
}) => {
  const { loanSubmission } = useMyContext();

  const handleSubmit = async() => {
    
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 border border-gray-300 rounded-xl shadow-xl w-[500px] text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-700">Review Your Submission</h2>

        {/* Display Selfie Image */}
        {loanSubmission.idSelfie ? (
          <div className="mb-4">
            <img
              src={loanSubmission.idSelfie}
              alt="Selfie ID"
              className="w-32 h-32 rounded-full border border-gray-300 shadow-md mx-auto"
            />
          </div>
        ) : (
          <p className="text-red-500 text-sm mb-4">No selfie provided</p>
        )}

        {/* Display Loan Data */}
        <div className="p-4 rounded-lg text-left">
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-semibold">Repay Date:</span> {loanSubmission.repayDate || 'Not selected'}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-semibold">Loan Amount:</span> {loanSubmission.loanAmount || '0'} PHP
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-semibold">Cashout:</span> {loanSubmission.cashout || '0'} PHP
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-semibold">Total Payment:</span> {loanSubmission.totalPayment || '0'} PHP
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
            onClick={handleSubmit}
            className="bg-green-500 text-white cursor-pointer font-semibold py-2 px-6 rounded-md hover:bg-green-600 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step6;
