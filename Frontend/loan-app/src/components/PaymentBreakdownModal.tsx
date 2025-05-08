import React, { useState, useEffect } from "react";
import { formatCurrency } from "../utils/formatCurrency";

interface PaymentBreakdownModalProps {
  penaltyFee: number;
  monthlyPayment: number;
  repayDate: string;
  onClose: () => void;
}

const PaymentBreakdownModal: React.FC<PaymentBreakdownModalProps> = ({
  penaltyFee,
  monthlyPayment,
  repayDate,
  onClose,
}) => {
  const today = new Date();
  const repay = new Date(repayDate);
  
  const monthsDiff =
    (repay.getFullYear() - today.getFullYear()) * 12 +
    (repay.getMonth() - today.getMonth());
  
  const totalAmount = monthlyPayment * monthsDiff;

  // Get all years from today until repayment date (including both)
  const getAvailableYears = () => {
    const years = [];
    const startYear = today.getFullYear();
    const endYear = repay.getFullYear();
    
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    
    return years;
  };

  const availableYears = getAvailableYears();
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [filteredBreakdown, setFilteredBreakdown] = useState<Array<{
    month: string;
    date: string;
    isFirst: boolean;
    year: number;
  }>>([]);

  const generateMonthlyBreakdown = () => {
    const breakdown: { month: string; date: string; isFirst: boolean; year: number }[] = [];
    const current = new Date(today);
    
    for (let i = 0; i < monthsDiff; i++) {
      const monthName = current.toLocaleString("default", { month: "long", year: "numeric" });
      const dateStr = current.toLocaleDateString("default", { day: "numeric", month: "long", year: "numeric" });
      const year = current.getFullYear();
      breakdown.push({ 
        month: monthName, 
        date: dateStr,
        isFirst: i === 0,
        year
      });
      current.setMonth(current.getMonth() + 1);
    }
    
    return breakdown;
  };
  
  const breakdownList = generateMonthlyBreakdown();

  useEffect(() => {
    // Filter breakdown by selected year
    const filtered = breakdownList.filter(item => item.year === selectedYear);
    setFilteredBreakdown(filtered);
  }, [selectedYear]);

  // Handle changing the selected year
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(e.target.value));
  };
  
  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed min-h-screen inset-0 bg-gray-500/50 bg-opacity-40 bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Payment Schedule
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="bg-blue-50 flex flex-col rounded-lg p-6 mb-4">
  <div className="flex justify-between items-center mb-2">
    <span className="text-gray-600 text-right">Total Payments:</span>
    <span className="font-bold text-blue-800 ml-3">₱{totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
  </div>
  <div className="flex justify-between items-center mb-2">
    <span className="text-gray-600 text-right">Monthly Amount:</span>
    <span className="font-bold text-blue-800 ml-3">₱{monthlyPayment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
  </div>
  <div className="flex justify-between items-center">
    <span className="text-gray-600 text-right">Penalty Fee:</span>
    <span className="font-bold text-red-600 ml-3">₱{penaltyFee.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
  </div>

  <div className="flex justify-between items-center">
    <span className="text-gray-600 text-right">Total Amount + Penalty Fee</span>
    <span className="font-bold text-red-600 ml-3">{formatCurrency(totalAmount + penaltyFee)}</span>
  </div>
</div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Monthly Breakdown</h3>
            
            {/* Year dropdown filter */}
            <div className="relative">
              <select
                value={selectedYear}
                onChange={handleYearChange}
                className="bg-white cursor-pointer border border-gray-300 rounded-md py-1 px-3 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="max-h-40 overflow-y-auto pr-2 scrollbar-thin">
            {filteredBreakdown.length > 0 ? (
              filteredBreakdown.map((item, index) => (
                <div 
                  key={index} 
                  className="flex justify-between py-3 border-b border-gray-200"
                >
                  <div className="flex flex-col">
                    <span className="text-gray-800 font-medium">{item.month}</span>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    ₱{monthlyPayment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-gray-500">
                No payments scheduled for {selectedYear}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition shadow-md"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentBreakdownModal;