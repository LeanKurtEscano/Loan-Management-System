import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faCheckCircle, faHourglassHalf, faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { formatCurrency } from "../../utils/formatCurrency";

// Assuming you have this format for the data
type LoanData = {
  status: string;
  amount: number;
};

type DashboardProps = {
  data: LoanData[]; // Prop to accept any data array of loans
  activeFilters: Record<string, string>;
  setActiveFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};


const UserDashboard: React.FC<DashboardProps> = ({ data, activeFilters, setActiveFilters }) => {
  // Calculate loan statistics based on data
  const totalLoans = data?.length || 0;
  const approvedLoans = data?.filter(tx => tx.status === "Approved").length || 0;
  const pendingLoans = data?.filter(tx => tx.status === "Pending").length || 0;
  const totalAmount = data?.reduce((acc, tx) => acc + Number(tx.amount), 0) || 0;
  const stats = [
    {
      label: "Total Loans",
      value: totalLoans,
      icon: faCreditCard,
      color: "blue",
      borderColor: "border-blue-500",
      bgColor: "bg-blue-600",
    },
    {
      label: "Approved Loans",
      value: approvedLoans,
      icon: faCheckCircle,
      color: "green",
      borderColor: "border-green-500",
      bgColor: "bg-green-500",
    },
    {
      label: "Pending Loans",
      value: pendingLoans,
      icon: faHourglassHalf,
      color: "yellow",
      borderColor: "border-yellow-500",
      bgColor: "bg-yellow-500",
    },
    {
      label: "Total Amount",
      value: formatCurrency(totalAmount),
      icon: faMoneyBillWave,
      color: "purple",
      borderColor: "border-purple-500",
      bgColor: "bg-purple-600",
    },
  ];
 

  const capitalizeWords = (str: string) => {
    // Insert a space before every uppercase letter that follows a lowercase letter or a number
    const formattedStr = str.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
    
    // Capitalize the first letter of each word
    return formattedStr
      .split(' ') // Split the string into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(' '); // Join the words back together
  };
  
  return (
    <div className="mb-8">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Transactions Page</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
          <motion.div 
            key={stat.label}
            className={`bg-white p-4 rounded-lg border-l-4 shadow-md ${stat.borderColor}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
          >
            <div className="flex items-center">
              <div className={`p-5 ${stat.bgColor} rounded-full`}>
                <FontAwesomeIcon icon={stat.icon} className={`text-2xl text-slate-100`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-500">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Active Filters Display */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(activeFilters).map(([key, value]) => (
          value && (
            <div key={key} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
              <span>{capitalizeWords(key)}: {capitalizeWords(value)}</span>
              <button 
                className="ml-2 cursor-pointer text-blue-800 hover:text-blue-900"
                onClick={() => {
                  const newFilters = { ...activeFilters };
                  delete newFilters[key as keyof typeof activeFilters];
                  setActiveFilters(newFilters);
                }}
              >
                ×
              </button>
            </div>
          )
        ))}
        {Object.keys(activeFilters).length > 0 && (
          <button 
            className="text-sm text-gray-600 hover:text-gray-800 underline"
            onClick={() => setActiveFilters({})}
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
