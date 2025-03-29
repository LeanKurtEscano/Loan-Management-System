import React from "react";

interface Step4Props {
  prevStep: () => void;
}

const Step4: React.FC<Step4Props> = ({ prevStep }) => {
  return (
    <div className="flex  items-center pb-20 h-screen">
      <div className="bg-white p-6 shadow-lg rounded-lg w-96 border border-gray-300">
        <h2 className="text-center text-lg font-semibold mb-4">
          Confirmation of Payment
        </h2>
        <p className="text-center text-sm mb-4">
          Please submit the screenshot of the receipt.
        </p>
        <label className="block w-full text-center bg-gray-100 border border-gray-300 rounded-lg p-3 cursor-pointer hover:bg-gray-200 transition">
          <input type="file" accept="image/*" className="hidden" />
          <span className="text-gray-600 font-medium">Choose File</span>
        </label>
        <p className="text-center text-sm mt-4">
          You may also provide your email address (optional) for confirmation.
        </p>
        <input
          type="email"
          placeholder="Email Address"
          className="w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
         <div className="flex justify-between mt-6 gap-4">
                    <button 
                        className="w-full bg-gray-500 cursor-pointer text-white px-6 py-3 rounded-lg text-lg transition-transform transform hover:scale-105"
                        onClick={prevStep}
                    >
                        Back
                    </button>
                    <button 
                        className="w-full bg-blue-500 cursor-pointer text-white px-6 py-3 rounded-lg text-lg transition-transform transform hover:scale-105"
                       
                    >
                        Submit
                    </button>
                </div>
      </div>
    </div>
  );
};

export default Step4;
