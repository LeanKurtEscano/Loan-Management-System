import React, { useState, useEffect } from "react";
import { useMyContext } from "../../../context/MyContext";
import { LoanApplicationDetails } from "../../../constants/interfaces/loanInterface";

const Step2 = ({ nextStep, prevStep }: { nextStep: () => void; prevStep: () => void }) => {
  const { loanApplication, setLoanApplication } = useMyContext();
  const [isNextDisabled, setIsNextDisabled] = useState(true);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => {
    setLoanApplication((prev: LoanApplicationDetails) => ({ ...prev, [field]: e.target.value }));
  };


  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    setLoanApplication((prev: LoanApplicationDetails) => ({
      ...prev,
      otherSourcesOfIncome: checked
        ? [...(prev.otherSourcesOfIncome || []), value]
        : prev.otherSourcesOfIncome?.filter((source) => source !== value),
    }));
  };



  useEffect(() => {
    const { educationLevel, employmentStatus, monthlyIncome, incomeVariation, otherIncomeSources, incomeFrequency } =
      loanApplication;
    setIsNextDisabled(
      !(
        educationLevel &&
        employmentStatus &&
        monthlyIncome &&
        incomeVariation &&
        (otherIncomeSources?.length > 0 || incomeFrequency === "None" || incomeFrequency)
      )
    );
  }, [loanApplication]);

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-2xl border-gray-200 border-2 space-y-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Education, Employment, and Income</h2>

        {/* Education Level Dropdown */}
        <div className="w-full space-y-2">
          <label className="block text-gray-700 font-medium text-lg">
            Which of the following describes your level of education?
          </label>
          <select
            value={loanApplication.educationLevel || ""}
            onChange={(e) => handleInputChange(e, "educationLevel")}
            className="w-full p-4 border rounded-lg text-gray-700 bg-gray-50 text-lg"
          >
            <option value="">Select Education Level</option>
            <option value="None">None</option>
            <option value="Primary">Primary / Elementary</option>
            <option value="Secondary">Secondary / High School</option>
            <option value="Tertiary">Tertiary / College</option>
            <option value="Master">Master / PhD</option>
          </select>
        </div>

        {/* Employment Status Dropdown */}
        <div className="w-full space-y-2">
          <label className="block text-gray-700 font-medium text-lg">Employment Status</label>
          <select
            value={loanApplication.employmentStatus || ""}
            onChange={(e) => handleInputChange(e, "employmentStatus")}
            className="w-full p-4 border rounded-lg text-gray-700 bg-gray-50 text-lg"
          >
            <option value="">Select Employment Status</option>
            <option value="Employed">Employed</option>
            <option value="Self-Employed">Self-Employed / Business Owner</option>
          </select>
        </div>

        {/* Monthly Income Input */}
        <div className="w-full space-y-2">
          <label className="block text-gray-700 font-medium text-lg">
            How much money in total did you earn in the last 30 days (in PHP)?
          </label>
          <input
            type="number"
            value={loanApplication.monthlyIncome || ""}
            onChange={(e) => handleInputChange(e, "monthlyIncome")}
            placeholder="Enter your income in PHP"
            className="w-full p-4 border rounded-lg text-gray-700 bg-gray-50 text-lg"
          />
        </div>

        {/* Income Variation Dropdown */}
        <div className="w-full space-y-2">
          <label className="block text-gray-700 font-medium text-lg">
            How much does your pay change from one month to the next?
          </label>
          <select
            value={loanApplication.incomeVariation || ""}
            onChange={(e) => handleInputChange(e, "incomeVariation")}
            className="w-full p-4 border rounded-lg text-gray-700 bg-gray-50 text-lg"
          >
            <option value="">Select Income Change</option>
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
            className="w-full p-4 border rounded-lg text-gray-700 bg-gray-50 text-lg"
          >
            <option value="">Select Source</option>
            <option value="Business Profit">Business Profit</option>
            <option value="Salary">Salary</option>
            <option value="Pension">Pension</option>
            <option value="Remittance">Remittance</option>
            <option value="Inheritance">Inheritance</option>
          </select>
        </div>


        {/* Additional Income Sources (Checkboxes) */}
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
                  checked={loanApplication.otherSourcesOfIncome?.includes(source)} // ✅ Keep checked on next step
                  onChange={handleCheckboxChange}
                  className="w-5 h-5"
                />
                <span className="text-gray-700 text-lg">{source}</span>
              </div>
            )
          )}

        </div>

        {/* Income Frequency Dropdown */}
        <div className="w-full space-y-2">
          <label className="block text-gray-700 font-medium text-lg">
            How frequently do you receive money from other sources on average? (Select "None" if you have no other income)
          </label>
          <select
            value={loanApplication.incomeFrequency || ""}
            onChange={(e) => handleInputChange(e, "incomeFrequency")}
            className="w-full p-4 border rounded-lg text-gray-700 bg-gray-50 text-lg"
          >
            <option value="">Select Frequency</option>
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
            className="w-full p-4 border rounded-lg text-gray-700 bg-gray-50 text-lg"
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Money from Other Source of Income */}
        <div className="w-full space-y-2">
          <label className="block text-gray-700 font-medium text-lg">
            How much money do you receive from other sources of income on average? (Type N/A if you have no other source of income)
          </label>
          <input
            type="text"
            value={loanApplication.moneyReceive || ""} // Correct spelling here
            onChange={(e) => handleInputChange(e, "moneyReceive")} // Correct spelling here too
            placeholder="Enter amount or N/A"
            className="w-full p-4 border rounded-lg text-gray-700 bg-gray-50 text-lg"
          />
        </div>


        {/* Total Spending in the Last 30 Days */}
        <div className="w-full space-y-2">
          <label className="block text-gray-700 font-medium text-lg">
            How much in total did you spend on basic needs, rent, bills, and existing loan (if you have) in the last 30 days?
          </label>
          <input
            type="number"
            value={loanApplication.totalSpend || ""}
            onChange={(e) => handleInputChange(e, "totalSpend")}
            placeholder="Enter your total spending in PHP"
            className="w-full p-4 border rounded-lg text-gray-700 bg-gray-50 text-lg"
          />
        </div>



        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-6">
          <button onClick={prevStep} className="py-3 px-8 bg-gray-300 text-gray-700 font-medium text-lg rounded-lg hover:bg-gray-400 transition">
            Back
          </button>

          <button
            onClick={nextStep}
            disabled={isNextDisabled}
            className={`py-3 px-8 font-medium text-lg rounded-lg transition ${isNextDisabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2;
