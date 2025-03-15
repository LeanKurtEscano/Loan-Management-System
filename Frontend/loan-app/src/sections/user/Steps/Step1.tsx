import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard } from '@fortawesome/free-solid-svg-icons';
import { useMyContext } from '../../../context/MyContext';
import { LoanApplicationDetails } from '../../../constants/interfaces/loanInterface';

const Step1 = ({ nextStep }: { nextStep: () => void }) => {
  const { loanApplication, setLoanApplication } = useMyContext();
  
  const storedIdNumber = sessionStorage.getItem("idNumber");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoanApplication((prev: LoanApplicationDetails) => ({
      ...prev,
      [name]: value
    }));
  };

  const storeDetails = () => {
    if (loanApplication.idNumber) {
      sessionStorage.setItem("idNumber", loanApplication.idNumber);
    }
  };

  const handleNext = () => {
    storeDetails();
    nextStep();
  };

  useEffect(() => {
    if (storedIdNumber && !loanApplication.idNumber) {
      setLoanApplication((prev: LoanApplicationDetails) => ({ ...prev, idNumber: storedIdNumber }));
    }
  }, [storedIdNumber, loanApplication.idNumber, setLoanApplication]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br ">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-[500px] h-[500px] transform transition-transform hover:scale-105 duration-300">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Let’s Get Started</h1>
        <p className="text-gray-500 mb-6 text-center">Enter your ID number to continue</p>

        <form>
          <div className="relative mb-6">
            <FontAwesomeIcon icon={faIdCard} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              name='idNumber'
              type="text"
              onChange={handleChange}
              value={loanApplication.idNumber ?? storedIdNumber ?? ''}
              placeholder="Enter your ID number"
              className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-700 placeholder-gray-400 text-lg"
              required
            />
          </div>

          <button
            type="button"
            className={`w-full cursor-pointer py-4 rounded-xl font-semibold shadow-md text-lg transition-all duration-300 ease-in-out ${loanApplication.idNumber ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            onClick={handleNext}
            disabled={!loanApplication.idNumber}
          >
            Continue
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-6 text-center">Need help? <a href="#" className="text-blue-500 hover:underline">Contact support</a></p>
      </div>
    </div>
  );
};

export default Step1;
