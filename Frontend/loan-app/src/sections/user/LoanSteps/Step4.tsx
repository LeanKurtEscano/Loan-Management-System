import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt, faTimesCircle, faUpload } from "@fortawesome/free-solid-svg-icons";
import { useMyContext } from "../../../context/MyContext";
import { LoanSubmission } from "../../../constants/interfaces/loanInterface";
const Step4 = ({
  prevStep,
  nextStep,
}: {
  prevStep: () => void;
  nextStep: () => void;
}) => {

  const { loanSubmission, setLoanSubmission } = useMyContext();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setLoanSubmission((prev: LoanSubmission) => ({ ...prev, idSelfie: file }))
      e.target.value = "";

    }
  };

  const handleContinue = () => {

    nextStep();
  }


const handleRemoveFile = () => {
  setLoanSubmission((prev: LoanSubmission) => ({ ...prev, idSelfie: null }))
};

return (
  <div className="flex h-auto pb-9 items-center min-h-screen">
    <div className="bg-white p-10 border border-gray-300 rounded-lg shadow-lg w-[500px] text-center">
      {/* Header */}

      <h3 className="text-xl font-semibold mb-2">SELFIE WITH YOUR ID</h3>
      <p className="text-base mb-6 text-gray-600">
        You're almost done with your application! To verify your identity,
        please take a selfie while holding your ID (front side visible).
      </p>

      <div className="relative">
        <label htmlFor="fileUploadBack" className="block text-gray-700 font-medium mb-2">
          Upload Back of ID
        </label>
        <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg w-full flex flex-col items-center bg-gray-100 hover:bg-gray-200 transition cursor-pointer">
          <label htmlFor="fileUploadBack" className="flex flex-col items-center cursor-pointer">
            <FontAwesomeIcon icon={faUpload} className="text-gray-500 text-2xl mb-2" />
            <p className="text-gray-600 font-medium">Drag & Drop or Click to Upload</p>
            <span className="text-xs text-gray-500">(JPG, PNG, or PDF - Max 5MB)</span>
          </label>
          <input
            id="fileUploadBack"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {loanSubmission.idSelfie && (
        <div className="relative w-full mt-2">
          <img
            src={URL.createObjectURL(loanSubmission.idSelfie)}
            alt="Back ID"
            className="w-full h-48 object-cover rounded-lg shadow"
          />
          <button
            onClick={handleRemoveFile}
            className="absolute top-2 right-2 bg-red-500 cursor-pointer text-white rounded-full px-1 hover:bg-red-600 transition"
          >
            <FontAwesomeIcon icon={faTimesCircle} />
          </button>
        </div>
      )}

      {/* Buttons Row */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prevStep}
          className="bg-gray-400 text-white cursor-pointer font-semibold py-3 px-5 rounded-md hover:bg-gray-500 transition"
        >
          Go Back
        </button>

        <button
          onClick={handleContinue}
          disabled={!loanSubmission.idSelfie}
          className={`${!loanSubmission.idSelfie
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
            } text-white font-semibold py-3 px-5 rounded-md transition`}
        >
          Continue
        </button>
      </div>
    </div>
  </div>
);
};

export default Step4;