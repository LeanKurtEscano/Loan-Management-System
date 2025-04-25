import React, { useEffect, useState } from "react";
import { useMyContext } from "../../../context/MyContext";
import { LoanApplicationDetails } from "../../../constants/interfaces/loanInterface";
import { validateExplanation } from "../../../utils/validation";

const Step3 = ({ nextStep, prevStep }: { nextStep: () => void; prevStep: () => void }) => {
  const { loanApplication, setLoanApplication } = useMyContext();
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [explanationError, setExplanationError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, field: string) => {
    const value = e.target.value;
    
    if (field === "explanation") {
      const textError = validateExplanation(value);
      setExplanationError(textError || "");
    }
    
    setLoanApplication((prev: LoanApplicationDetails) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const { purpose, explanation, outstanding } = loanApplication;
    setIsNextDisabled(!(purpose && explanation && outstanding) || !!explanationError);
  }, [loanApplication, explanationError]);

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-2xl border-gray-200 border-2 space-y-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Loan Purpose and Details</h2>

        <div className="w-full space-y-2">
          <label className="block text-gray-700 font-medium text-lg">What would you like to use your cash for?</label>
          <select
            value={loanApplication.purpose || ""}
            onChange={(e) => handleInputChange(e, "purpose")}
            className="w-full p-4 border rounded-lg text-gray-700 bg-gray-50 text-lg"
          >
            <option value="">Select Purpose</option>
            <option value="Business Purposes">Business Purposes</option>
            <option value="Personal Expense">Personal Expense</option>
            <option value="Pay Bills">Pay Bills</option>
            <option value="Educational Purposes">Educational Purposes</option>
            <option value="Paying Debt">Paying Debt</option>
            <option value="Emergency Purposes">Emergency Purposes</option>
          </select>
        </div>

        <div className="w-full space-y-2">
          <label className="block text-gray-700 font-medium text-lg">
            Please describe how you will use the money in more detail
          </label>
          <textarea
            value={loanApplication.explanation || ""}
            onChange={(e) => handleInputChange(e, "explanation")}
            placeholder="Explain how you will use the money..."
            rows={4}
            className={`w-full p-4 border rounded-lg text-gray-700 bg-gray-50 text-lg ${
              explanationError ? "border-red-500" : ""
            }`}
          />
          {explanationError && (
            <p className="text-red-500 text-sm mt-1">{explanationError}</p>
          )}
        </div>

        <div className="w-full space-y-2">
          <label className="block text-gray-700 font-medium text-lg">Do you have any outstanding loans?</label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="Yes"
                checked={loanApplication.outstanding === "Yes"}
                onChange={(e) => handleInputChange(e, "outstanding")}
                className="w-5 h-5"
              />
              <span className="text-gray-700 text-lg">Yes</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="No"
                checked={loanApplication.outstanding === "No"}
                onChange={(e) => handleInputChange(e, "outstanding")}
                className="w-5 h-5"
              />
              <span className="text-gray-700 text-lg">No</span>
            </label>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={prevStep}
            className="py-3 px-8 bg-gray-300 text-gray-700 font-medium text-lg rounded-lg hover:bg-gray-400 transition"
          >
            Back
          </button>

          <button
            onClick={nextStep}
            disabled={isNextDisabled}
            className={`py-3 px-8 font-medium text-lg rounded-lg transition ${
              isNextDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
        
        {isNextDisabled && (
          <p className="text-red-500 text-center mt-4 font-medium">
            Please fill out all required fields and fix any errors to proceed.
          </p>
        )}
      </div>
    </div>
  );
};

export default Step3;