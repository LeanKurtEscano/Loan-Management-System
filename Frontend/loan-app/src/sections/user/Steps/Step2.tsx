import React, { useState, useEffect } from "react";
import { useMyContext } from "../../../context/MyContext";
import { LoanApplicationDetails } from "../../../constants/interfaces/loanInterface";
import { validateAmountSpent } from "../../../utils/validation";

const Step2 = ({ nextStep, prevStep }: { nextStep: () => void; prevStep: () => void }) => {
  const { loanApplication, setLoanApplication } = useMyContext();
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [errors, setErrors] = useState({
    monthlyIncome: "",
    moneyReceive: "",
    totalSpend: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => {
    const value = e.target.value;
    
    // Update the loan application state
    setLoanApplication((prev: LoanApplicationDetails) => ({ ...prev, [field]: value }));
    
    // Validate numeric fields
    if (e.target.type === "number" || field === "moneyReceive") {
      // Skip validation for "N/A" in moneyReceive field
      if (field === "moneyReceive" && value === "N/A") {
        setErrors(prev => ({ ...prev, [field]: "" }));
        return;
      }
      
      const errorMessage = validateAmountSpent(value);
      setErrors(prev => ({ ...prev, [field]: errorMessage }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    // Create a copy of the current sources of income
    let updatedSources = [...(loanApplication.otherSourcesOfIncome || [])];
    
    if (value === "None" && checked) {
      // If "None" is checked, clear all other sources and only include "None"
      updatedSources = ["None"];
      
      // Automatically set related fields when None is selected
      setLoanApplication((prev: LoanApplicationDetails) => ({
        ...prev,
        otherSourcesOfIncome: updatedSources,
        incomeFrequency: "None",
        moneyReceive: "N/A",
        primarySource: "No"  // Automatically set to "No"
      }));
      
      // Clear any error for moneyReceive since it's set to N/A
      setErrors(prev => ({ ...prev, moneyReceive: "" }));
    } else if (value === "None" && !checked) {
      // If "None" is unchecked, just remove it
      updatedSources = updatedSources.filter(source => source !== "None");
      
      setLoanApplication((prev: LoanApplicationDetails) => ({
        ...prev,
        otherSourcesOfIncome: updatedSources,
        // Reset values if needed
        incomeFrequency: "",
        moneyReceive: ""
      }));
    } else if (checked) {
      // If any other option is checked, remove "None" and add the selected option
      updatedSources = updatedSources.filter(source => source !== "None");
      updatedSources.push(value);
      
      setLoanApplication((prev: LoanApplicationDetails) => ({
        ...prev,
        otherSourcesOfIncome: updatedSources
      }));
    } else {
      // If any other option is unchecked, just remove it
      updatedSources = updatedSources.filter(source => source !== value);
      
      setLoanApplication((prev: LoanApplicationDetails) => ({
        ...prev,
        otherSourcesOfIncome: updatedSources
      }));
    }
  };

  useEffect(() => {
    const { educationLevel, employmentStatus, monthlyIncome, incomeVariation, otherSourcesOfIncome, incomeFrequency, totalSpend } =
      loanApplication;

    const hasErrors = Object.values(errors).some(error => error !== "");
    
    setIsNextDisabled(
      hasErrors || !(
        educationLevel &&
        employmentStatus &&
        monthlyIncome &&
        incomeVariation &&
        totalSpend &&
        (otherSourcesOfIncome?.length > 0 || incomeFrequency === "None" || incomeFrequency)
      )
    );
  }, [loanApplication, errors]);

  
  const isNoneSelected = loanApplication.otherSourcesOfIncome?.includes("None");
  const isAnyOtherSelected = loanApplication.otherSourcesOfIncome?.some(source => source !== "None");

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-2xl border-gray-200 border-2 space-y-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Education, Employment, and Income</h2>

        <div className="w-full space-y-2">
          <label className="block text-gray-700 font-medium text-lg">
            Which of the following describes your level of education?
          </label>
          <select
            value={loanApplication.educationLevel || ""}
            onChange={(e) => handleInputChange(e, "educationLevel")}
            className="w-full p-4 border cursor-pointer rounded-lg text-gray-700 bg-gray-50 text-lg"
          >
            <option value="  disabled hidden">Select Education Level</option>
            <option value="None">None</option>
            <option value="Primary">Primary / Elementary</option>
            <option value="Secondary">Secondary / High School</option>
            <option value="Tertiary">Tertiary / College</option>
            <option value="Master">Master / PhD</option>
          </select>
        </div>

       
        <div className="w-full space-y-2">
          <label className="block text-gray-700 font-medium text-lg">Employment Status</label>
          <select
            value={loanApplication.employmentStatus || ""}
            onChange={(e) => handleInputChange(e, "employmentStatus")}
            className="w-full cursor-pointer p-4 border rounded-lg text-gray-700 bg-gray-50 text-lg"
          >
            <option value=""  disabled hidden>Select Employment Status</option>
            <option value="Employed">Employed</option>
            <option value="Self-Employed">Self-Employed / Business Owner</option>
          </select>
        </div>

      
        <div className="w-full space-y-2">
          <label className="block text-gray-700 font-medium text-lg">
            How much money in total did you earn in the last 30 days (in PHP)?
          </label>
          <input
            type="number"
            value={loanApplication.monthlyIncome || ""}
            onChange={(e) => handleInputChange(e, "monthlyIncome")}
            placeholder="Enter your income in PHP"
            className={`w-full p-4 border rounded-lg text-lg ${errors.monthlyIncome ? "border-red-500 bg-red-50" : "bg-gray-50 text-gray-700"}`}
          />
          {errors.monthlyIncome && (
            <p className="text-red-500 mt-1">{errors.monthlyIncome}</p>
          )}
        </div>

       
        <div className="w-full space-y-2">
          <label className="block text-gray-700 font-medium text-lg">
            How much does your pay change from one month to the next?
          </label>
          <select
            value={loanApplication.incomeVariation || ""}
            onChange={(e) => handleInputChange(e, "incomeVariation")}
            className="w-full p-4 cursor-pointer border rounded-lg text-gray-700 bg-gray-50 text-lg"
          >
            <option value="" disabled hidden>Select Income Change</option>
            <option value="No Change">No change (Fixed or consistent salary)</option>
            <option value="Little Change">Little change</option>
            <option value="Medium Change">Medium change</option>
            <option value="Large Change">Large change</option>
          </select>
        </div>

        <div className="w-full space-y-2">
          <label className="block text-gray-700 font-medium text-lg">What is your primary source of income?</label>
          <select
            value={loanApplication.primaryIncomeSource || ""}
            onChange={(e) => handleInputChange(e, "primaryIncomeSource")}
            className="w-full p-4 border cursor-pointer rounded-lg text-gray-700 bg-gray-50 text-lg"
          >
            <option value=""  disabled hidden>Select Source</option>
            <option value="Business Profit">Business Profit</option>
            <option value="Salary">Salary</option>
            <option value="Pension">Pension</option>
            <option value="Remittance">Remittance</option>
            <option value="Inheritance">Inheritance</option>
          </select>
        </div>

        <div className="w-full space-y-2">
          <label className="block text-gray-700 font-medium text-lg">
            Do you have other sources of income aside from your employment or business? (Check all that apply)
          </label>
          {["Contributions from local friends or family", "International Remittance", "Government Assistance", "Retirement Income", "None"].map(
            (source) => (
              <div key={source} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={source}
                  checked={loanApplication.otherSourcesOfIncome?.includes(source)}
                  onChange={handleCheckboxChange}
                  disabled={
                    (source === "None" && isAnyOtherSelected) || 
                    (source !== "None" && isNoneSelected)
                  }
                  className="w-5 h-5 cursor-pointer"
                />
                <span className={`text-lg ${(source === "None" && isAnyOtherSelected) || (source !== "None" && isNoneSelected) ? "text-gray-400" : "text-gray-700"}`}>
                  {source}
                </span>
              </div>
            )
          )}
        </div>

        <div className="w-full space-y-2">
          <label className="block text-gray-700 font-medium text-lg">
            How frequently do you receive money from other sources on average? (Select "None" if you have no other income)
          </label>
          <select
            value={loanApplication.incomeFrequency || ""}
            onChange={(e) => handleInputChange(e, "incomeFrequency")}
            className={`w-full p-4 border cursor-pointer rounded-lg text-lg ${isNoneSelected ? "bg-gray-200 text-gray-500" : "bg-gray-50 text-gray-700"}`}
            disabled={isNoneSelected}
          >
            <option value=""  disabled hidden>Select Frequency</option>
            <option value="Once a year">Once a year</option>
            <option value="Twice a year">Twice a year</option>
            <option value="Every couple of months">Every couple of months</option>
            <option value="Once a month">Once a month</option>
            <option value="Twice a month">Twice a month</option>
            <option value="None">None</option>
          </select>
        </div>

        <div className="w-full space-y-2">
          <label className="block text-gray-700 font-medium text-lg">
            Is this your primary source of income? (Select no if you have no other source of income)
          </label>
          <select
            value={loanApplication.primarySource || ""}
            onChange={(e) => handleInputChange(e, "primarySource")}
            className={`w-full p-4 border cursor-pointer rounded-lg text-lg ${isNoneSelected ? "bg-gray-200 text-gray-500" : "bg-gray-50 text-gray-700"}`}
            disabled={isNoneSelected}
          >
            <option value=""  disabled hidden>Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="w-full space-y-2">
          <label className="block text-gray-700 font-medium text-lg">
            How much money do you receive from other sources of income on average? (Type N/A if you have no other source of income)
          </label>
          <input
            type="text"
            value={loanApplication.moneyReceive || ""} 
            onChange={(e) => handleInputChange(e, "moneyReceive")} 
            placeholder="Enter amount or N/A"
            className={`w-full p-4 border rounded-lg text-lg ${
              isNoneSelected ? "bg-gray-200 text-gray-500" : 
              errors.moneyReceive ? "border-red-500 bg-red-50" : "bg-gray-50 text-gray-700"
            }`}
            disabled={isNoneSelected}
          />
          {!isNoneSelected && errors.moneyReceive && (
            <p className="text-red-500 mt-1">{errors.moneyReceive}</p>
          )}
        </div>

        <div className="w-full space-y-2">
          <label className="block text-gray-700 font-medium text-lg">
            How much in total did you spend on basic needs, rent, bills, and existing loan (if you have) in the last 30 days?
          </label>
          <input
            type="number"
            value={loanApplication.totalSpend || ""}
            onChange={(e) => handleInputChange(e, "totalSpend")}
            placeholder="Enter your total spending in PHP"
            className={`w-full p-4 border rounded-lg text-lg ${
              errors.totalSpend ? "border-red-500 bg-red-50" : "bg-gray-50 text-gray-700"
            }`}
          />
          {errors.totalSpend && (
            <p className="text-red-500 mt-1">{errors.totalSpend}</p>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col mt-6">
          <div className="flex justify-between items-center">
            <button onClick={prevStep} className="py-3 cursor-pointer px-8 bg-gray-300 text-gray-700 font-medium text-lg rounded-lg hover:bg-gray-400 transition">
              Back
            </button>

            <button
              onClick={nextStep}
              disabled={isNextDisabled}
              className={`py-3 px-8 cursor-pointer font-medium text-lg rounded-lg transition ${
                isNextDisabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
          
          {/* Form completion message */}
          {isNextDisabled && (
            <p className="text-red-500 text-center mt-4 font-medium">
              Please fill out all required fields and fix any errors to proceed.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step2;