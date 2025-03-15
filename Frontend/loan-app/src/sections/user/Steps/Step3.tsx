import React from 'react';
import { useMyContext } from '../../../context/MyContext';
import { faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const incomeRanges = [
  'Less than PHP 60,000',
  'PHP 60,000 - PHP 100,000',
  'PHP 100,000 - PHP 150,000',
  'PHP 150,000 - PHP 250,000',
  'PHP 250,000 - PHP 350,000',
  'PHP 350,000 - PHP 500,000',
  'PHP 500,000 and above'
];

const Step3 = ({ nextStep, prevStep }: { nextStep: () => void; prevStep: () => void }) => {
  const { setLoanApplication } = useMyContext();
  const [selectedRange, setSelectedRange] = React.useState('');

  const handleSelect = (range: string) => {
    setSelectedRange(range);
    setLoanApplication((prev: any) => ({ ...prev, incomeRange: range }));
  };

  return (
    <div className="flex items-start max-w-6xl justify-center h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[700px]">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">Select Your Income Range</h1>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {incomeRanges.map((range, index) => (
            <button
              key={index}
              onClick={() => handleSelect(range)}
              className={`flex cursor-pointer items-center whitespace-nowrap p-4 border-2 border-gray-300 shadow-sm rounded-xl text-lg transition ${selectedRange === range ? 'bg-blue-500 text-white border-blue-500 shadow-md' : 'bg-gray-100 text-gray-800 hover:bg-blue-100'}`}
            >
              <FontAwesomeIcon icon={faMoneyBillWave} className={`${selectedRange === range ? 'text-white' : 'text-blue-500'} mr-2 transition`} />
              <span className="text-sm sm:text-base  md:text-lg">{range}</span>
            </button>
          ))}
        </div>
        <div className="flex justify-between">
          <button onClick={prevStep} className="bg-blue-500 cursor-pointer text-white text-lg px-6 py-3 rounded-xl hover:bg-blue-600 transition w-[45%]">Back</button>
          <button
            onClick={nextStep}
            disabled={!selectedRange}
            className={`text-lg px-6 cursor-pointer py-3 rounded-xl transition w-[45%] ${selectedRange ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-black font-semibold cursor-not-allowed'}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3;
