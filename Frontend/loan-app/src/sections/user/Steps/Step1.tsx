import React from "react";
import { useMyContext } from "../../../context/MyContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt, faTimesCircle, faUpload } from "@fortawesome/free-solid-svg-icons";
import { LoanApplicationDetails } from "../../../constants/interfaces/loanInterface";

const Step1 = ({ nextStep }: { nextStep: () => void }) => {
  const { loanApplication, setLoanApplication } = useMyContext();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: "front" | "back") => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLoanApplication((prev: LoanApplicationDetails) => ({ ...prev, [side]: file }));
      e.target.value = "";
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLoanApplication((prev: LoanApplicationDetails) => ({
      ...prev,
      idType: e.target.value,
    }));
  };

  // Handle removing uploaded files
  const handleRemoveFile = (side: "front" | "back") => {
    setLoanApplication((prev: LoanApplicationDetails) => ({
      ...prev,
      [side]: null,
    }));
  };

  const handleNext = () => {
    console.log("Storing details:", loanApplication);
    nextStep();
  };

  return (
    <div className="flex justify-center h-auto items-center min-h-screen">
      <div className="bg-white shadow-lg rounded-lg mb-11 p-6 w-full max-w-xl border-gray-200 border-2 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Upload Your ID</h2>

        {/* ID Type Dropdown */}
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Select ID Type</label>
          <select
            value={loanApplication.idType}
            onChange={handleSelectChange}
            className="w-full p-3 border cursor-pointer rounded-lg text-gray-700 bg-gray-50"
          >
            <option value="">Select ID</option>
            <option value="SSS Unified Multi-Purpose ID (UMID)">SSS Unified Multi-Purpose ID (UMID)</option>
            <option value="Driver's License">Driver's License</option>
            <option value="Passport">Passport</option>
            <option value="Philippine Identification (PhilID / ePhilID)">Philippine Identification (PhilID / ePhilID)</option>
            <option value="PhilHealth ID">PhilHealth ID</option>
            <option value="Postal ID">Postal ID</option>
            <option value="Voter's ID">Voter's ID</option>
          </select>
        </div>

        {/* Front and Back ID Upload (same row) */}
        <div className="grid grid-cols-2 gap-6">
          {/* Front ID Upload */}
          <div className="space-y-2">
            <div className="relative">
              <label htmlFor="fileUploadFront" className="block text-gray-700 font-medium mb-2">
                Upload Front of ID
              </label>
              <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg flex flex-col items-center bg-gray-100 hover:bg-gray-200 transition cursor-pointer">
                <label htmlFor="fileUploadFront" className="flex flex-col items-center cursor-pointer">
                  <FontAwesomeIcon icon={faUpload} className="text-gray-500 text-2xl mb-2" />
                  <p className="text-gray-600 font-medium whitespace-nowrap">Drag & Drop or Click to Upload</p>
                  <span className="text-xs text-gray-500 ">(JPG, PNG, or PDF - Max 5MB)</span>
                </label>
                <input
                  id="fileUploadFront"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "front")}
                  className="hidden"
                />
              </div>
            </div>

            {loanApplication.front && (
              <div className="relative w-full mt-2">
                <img
                  src={URL.createObjectURL(loanApplication.front)}
                  alt="Front ID"
                  className="w-full h-60 object-cover rounded-lg shadow"
                />
                <button
                  onClick={() => handleRemoveFile("front")}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-1 cursor-pointer hover:bg-red-600 transition"
                >
                  <FontAwesomeIcon icon={faTimesCircle} />
                </button>
                <p className="text-center text-gray-700 mt-2 font-medium">Front of ID</p>
              </div>
            )}
          </div>

          {/* Back ID Upload */}
          <div className="space-y-2">
            <div className="relative">
              <label htmlFor="fileUploadBack" className="block text-gray-700 font-medium mb-2">
                Upload Back of ID
              </label>
              <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg flex flex-col items-center bg-gray-100 hover:bg-gray-200 transition cursor-pointer">
                <label htmlFor="fileUploadBack" className="flex flex-col items-center cursor-pointer">
                  <FontAwesomeIcon icon={faUpload} className="text-gray-500 text-2xl mb-2" />
                  <p className="text-gray-600 font-medium whitespace-nowrap">Drag & Drop or Click to Upload</p>
                  <span className="text-xs text-gray-500">(JPG, PNG, or PDF - Max 5MB)</span>
                </label>
                <input
                  id="fileUploadBack"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "back")}
                  className="hidden"
                />
              </div>
            </div>

            {loanApplication.back && (
              <div className="relative w-full mt-2">
                <img
                  src={URL.createObjectURL(loanApplication.back)}
                  alt="Back ID"
                  className="w-full h-60 object-cover rounded-lg shadow"
                />
                <button
                  onClick={() => handleRemoveFile("back")}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-1 cursor-pointer hover:bg-red-600 transition"
                >
                  <FontAwesomeIcon icon={faTimesCircle} />
                </button>
                <p className="text-center text-gray-700 mt-2 font-medium">Back of ID</p>
              </div>
            )}
          </div>
        </div>

        {/* Next Button */}
        <button
          disabled={!loanApplication.idType || !loanApplication.front || !loanApplication.back}
          onClick={handleNext}
          className={`w-full py-3 font-medium rounded-lg transition 
    ${!loanApplication.idType || !loanApplication.front || !loanApplication.back
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer text-white"
            }`}
        >
          Next
        </button>

      </div>
    </div>
  );
};

export default Step1;
