import React, { useState } from 'react';

const Step4 = ({ nextStep, prevStep }: { nextStep: () => void; prevStep: () => void }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const isNextDisabled = !startDate || !endDate;

  return (
    <div className="flex items-start max-w-6xl justify-center h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[700px]">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">Select Your Loan Duration</h1>
        <div className="flex flex-col gap-4 mb-6">
          <label className="text-gray-700 font-medium">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-3 border-2 border-gray-300 rounded-xl shadow-sm text-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="text-gray-700 font-medium">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-3 border-2 border-gray-300 rounded-xl shadow-sm text-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            className="bg-blue-500 cursor-pointer text-white text-lg px-6 py-3 rounded-xl hover:bg-blue-600 transition w-[45%]"
          >
            Back
          </button>
          <button
            onClick={nextStep}
            disabled={isNextDisabled}
            className={`text-lg px-6 py-3  cursor-pointer rounded-xl transition w-[45%] ${isNextDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step4;
