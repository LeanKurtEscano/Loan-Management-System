import React, { useState } from "react";
import gcash from "../../../assets/gcash.png"
import maya from "../../../assets/maya.png"
import { useMyContext } from "../../../context/MyContext";
import { LoanSubmission } from "../../../constants/interfaces/loanInterface";
const Step5 = ({ prevStep, nextStep }: { prevStep: () => void; nextStep: () => void }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>("gcash");

  const handleSelect = (option: string) => {
    setSelectedOption((prev) => (prev === option ? null : option));
  };
  

  const handleContinue = () => {
    console.log("Selected Payment Method:", selectedOption);
    nextStep();
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white border border-gray-300 rounded-lg shadow-xl w-[500px] p-14 text-center">
        
        <h3 className="text-xl font-semibold mb-4">CASHOUT OPTIONS</h3>

        {/* GCash Option */}
        <div
          className={`cursor-pointer p-4 border-2 rounded-lg mb-4 flex items-center justify-between transition ${
            selectedOption === "gcash" ? "border-blue-500 shadow-md" : "border-gray-300"
          }`}
          onClick={() => handleSelect("gcash")}
        >
          <div className="text-left">
            <h4 className="font-semibold">GCASH (InstaPay)</h4>
            <p className="text-sm text-gray-600">Processing Time: Instant</p>
            <p className="text-sm text-gray-600">Service Fee: PHP 10</p>
            <p className="text-sm font-semibold">You’ll receive: 2,990 PHP</p>
          </div>
          <img src={gcash} alt="GCash Logo" className="w-16 h-16" />
        </div>

        {/* Maya Option */}
        <div
          className={`cursor-pointer p-4 border-2 rounded-lg flex items-center justify-between transition ${
            selectedOption === "maya" ? "border-blue-500 shadow-md" : "border-gray-300"
          }`}
          onClick={() => handleSelect("maya")}
        >
          <div className="text-left">
            <h4 className="font-semibold">Maya (InstaPay)</h4>
            <p className="text-sm text-gray-600">Processing Time: Instant</p>
            <p className="text-sm text-gray-600">Service Fee: PHP 15</p>
            <p className="text-sm font-semibold">You’ll receive: 2,985 PHP</p>
          </div>
          <img src={maya} alt="Maya Logo" className="w-16 h-16" />
        </div>

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
      </div>
    </div>
  );
};

export default Step5;