import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faUserSlash, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { LoanApplicationDetails } from '../../../constants/interfaces/loanInterface';
import { useMyContext } from '../../../context/MyContext';
const Step2 = ({ nextStep, prevStep }: { nextStep: () => void; prevStep: () => void }) => {
  const [status, setStatus] = useState<string | null>(null);
  const { loanApplication, setLoanApplication } = useMyContext();
  
  const handleSelect = (value: string) => {
    if(value === status) {
      setStatus(null);
      setLoanApplication((prev : LoanApplicationDetails) => ({...prev, status: status}))
    } else {
      setStatus(value);
      sessionStorage.setItem("status", loanApplication.status );
    }
    
  }
    
   

  const employmentOptions = [
    { label: 'Employed', icon: faBriefcase },
    { label: 'Unemployed', icon: faUserSlash },
    { label: 'Self Employed', icon: faBuilding },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-[500px] transform transition-transform hover:scale-105 duration-300">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Employment Status</h1>
        <p className="text-gray-500 mb-6 text-center">Select your employment status</p>

        <div className="grid grid-cols-1 gap-4">
          {employmentOptions.map((option) => (
            <div
              key={option.label}
              onClick={() => handleSelect(option.label)}
              className={`cursor-pointer flex items-center justify-center gap-3 p-6 border rounded-xl shadow-md transition-all duration-300 text-lg font-semibold
              ${status === option.label ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-blue-500 text-gray-700 hover:text-white'}
              `}
            >
              <FontAwesomeIcon icon={option.icon} className="text-3xl" />
              <span>{option.label}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6 gap-2">
          <button
            type="button"
            className="w-1/2 cursor-pointer bg-blue-500 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-blue-600 transition-all duration-300 ease-in-out"
            onClick={prevStep}
          >
            Back
          </button>

          <button
            type="button"
            className={`w-1/2 py-3 cursor-pointer rounded-xl font-semibold shadow-md transition-all duration-300 ease-in-out
          ${status ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}`}
            onClick={nextStep}
            disabled={!status}
          >
            Continue
          </button>
        </div>

        <p className="text-sm text-gray-400 mt-6 text-center">
          Need help? <a href="#" className="text-blue-500 hover:underline">Contact support</a>
        </p>
      </div>
    </div>
  );
};

export default Step2;
