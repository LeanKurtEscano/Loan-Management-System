import React, { useState, useRef } from "react";
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
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLoanSubmission((prev: LoanSubmission) => ({ ...prev, idSelfie: file }));
      e.target.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setLoanSubmission((prev: LoanSubmission) => ({ ...prev, idSelfie: file }));
    }
  };

  const handleBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = () => {
    setLoanSubmission((prev: LoanSubmission) => ({ ...prev, idSelfie: null }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-center text-gray-800">
            Selfie with Your ID
          </h3>
          <div className="w-16 h-1 bg-blue-500 mx-auto mt-2 mb-4 rounded-full"></div>
          <p className="text-gray-600 text-center">
            Take a selfie while holding your ID with the front side clearly visible
          </p>
        </div>

        {!loanSubmission.idSelfie ? (
          <div
            onClick={handleBoxClick}
            className={`border-2 border-dashed rounded-lg p-8 transition-all cursor-pointer ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center">
              <div className="mb-4 p-4 bg-blue-100 rounded-full">
                <svg
                  className="w-10 h-10 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  ></path>
                </svg>
              </div>
              <div className="text-center">
                <span className="block text-blue-500 font-medium mb-1">
                  Drag & drop or click to upload
                </span>
                <span className="text-sm text-gray-500">
                  JPG, PNG, or PDF (Max 5MB)
                </span>
              </div>
              <input
                ref={fileInputRef}
                id="fileUpload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        ) : (
          <div className="relative rounded-lg overflow-hidden border border-gray-200">
            <img
              src={URL.createObjectURL(loanSubmission.idSelfie)}
              alt="ID Selfie"
              className="w-full h-64 object-cover"
            />
            <button
              onClick={handleRemoveFile}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-md"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
            <div className="bg-green-100 p-2 border-t border-gray-200">
              <p className="text-green-700 text-sm font-medium flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                File uploaded successfully
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 gap-4">
          <button
            onClick={prevStep}
            className="px-6 py-3 border cursor-pointer border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition flex-1 flex items-center justify-center"
          >
          
            ←  Go Back
          </button>
          <button
            onClick={nextStep}
            disabled={!loanSubmission.idSelfie}
            className={`px-6 py-3 rounded-md font-medium cursor-pointer flex-1 flex items-center justify-center ${
              !loanSubmission.idSelfie
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } transition`}
          >
            Next →
         
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step4;