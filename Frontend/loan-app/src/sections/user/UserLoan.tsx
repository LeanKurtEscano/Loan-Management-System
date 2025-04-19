import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faEllipsisH, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "../../services/user/disbursement";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatTime, formatDateWithWords } from "../../utils/formatDate";
import gcash from "../../assets/gcashtext.png";
import maya from "../../assets/mayatext.webp";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Filter from "../../components/Filter";
import FilterModal from "../../components/FilterModal";
import UserDashboard from "../../layout/user/UserDashboard";

const UserLoan = () => {
  const { data, isLoading, isError, error, refetch } = useQuery(["userTransactions"], getTransactions);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [filteredData, setFilteredData] = useState<any[]>(data || []);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const nav = useNavigate();
  const [activeFilters, setActiveFilters] = useState<{
    paymentMethod?: string;
    settledDuration?: string;
    status?: string;
  }>({});
  const [toggleFilter, setToggleFilter] = useState(false);

  const paymentMethods = ["gcash", "maya"];
  const settledDurations = ["1 month", "2 months", "3 months", "More than 3 months"];

  const statuses = ["Approved", "Pending", "Rejected"];
  const handleApplyFilters = (filters: {
    paymentMethod?: string;
    settledDuration?: string;
    status?: string;
  }) => {
    setActiveFilters(filters);
    // Apply your filtering logic here
    console.log("Applied filters:", filters);
  };


  // Handle filter change
  const handleSelect = (value: string) => {
    setSelectedFilter(value);
  };

  const handleToggleChange = (value: boolean) => {
    setToggleFilter(value);
  };


  const toggleActions = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Handle View Button click
  const handleView = () => {
    nav(`/user/my-transactions/${activeIndex}`);
  };

 
useEffect(() => {
  if (!data) return;
  
  let filtered = [...data];
  
 
  if (activeFilters.paymentMethod) {
    filtered = filtered.filter(item => 
      item.loan.cashout.toLowerCase() === activeFilters.paymentMethod?.toLowerCase()
    );
  }
  

  if (activeFilters.settledDuration) {
    filtered = filtered.filter(item => {
      // Handle special case for "More than 3 months"
      if (activeFilters.settledDuration === "More than 3 months") {
        // Extract just the number from strings like "4 Months"
        const months = parseInt(item.period);
        return !isNaN(months) && months > 3;
      } else {
        return item.period === activeFilters.settledDuration;
      }
    });
  }
  

  if (activeFilters.status) {
    filtered = filtered.filter(item => 
      item.status === activeFilters.status
    );
  }
  
  setFilteredData(filtered);
}, [data, activeFilters]);


 
  return (
    <motion.div
      className="p-5 max-w-5xl mx-auto"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
    <UserDashboard
        data={filteredData}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      />

<div className="flex justify-end items-center mb-6 gap-2 ">
  {/* Label Text */}
  <span className="text-md font-semibold ">Filter Loans:</span>
  
  {/* Filter Component */}
  <Filter
    label="Filters"
    toggle={toggleFilter}
    onToggleChange={handleToggleChange} // Pass the state and the function to Filter
  />
</div>


      <div className="overflow-visible">

    
        <table className="w-full bg-white shadow-md rounded-lg text-sm">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Settled Duration</th>
              <th className="p-3 text-left">Payment Frequency</th>
              <th className="p-3 text-left">Payment Method</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.map((tx: any, index: number) => (
              <motion.tr
                key={index}
                className="border-b hover:bg-gray-50"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <td className="p-3">
                  {formatDateWithWords(tx.created_at)}
                  <br />
                  <span className="text-xs text-gray-500">{formatTime(tx.created_at)}</span>
                </td>
                <td className="p-3">{formatCurrency(tx.amount)}</td>
                <td className={`p-3 font-semibold ${tx.status === "Rejected" ? "text-red-600" : tx.status === "Pending" ? "text-yellow-600" : "text-blue-600"}`}>{tx.status}</td>
                <td className="p-3 pl-8">{tx.period}</td>
                <td className="p-3 pl-12">{tx.loan.frequency}</td>
                <td className="p-3 flex pt-4 items-center">
                  {tx.loan.cashout === "gcash" && <img src={gcash} alt="Gcash" className="w-28 h-15" />}
                  {tx.loan.cashout === "maya" && <img src={maya} alt="Maya" className="w-27 pt-1 h-8" />}
                </td>
                <td className="p-3">
                  <div className="relative">
                    <button onClick={() => toggleActions(tx.id)} className="p-2 rounded-full cursor-pointer hover:bg-gray-200">
                      <FontAwesomeIcon icon={faEllipsisH} />
                    </button>
                    {activeIndex === tx.id && (
                      <motion.div
                        className="absolute right-5 top-6 -translate-y-1/4 translate-x-full mt-0 w-32 bg-white border border-gray-300 shadow-md rounded-md z-50"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <button onClick={handleView} className="flex items-center w-full cursor-pointer px-4 py-2 text-sm hover:bg-gray-100">
                          <FontAwesomeIcon icon={faEye} className="mr-2" /> View
                        </button>
                        <button className="flex items-center w-full px-4 py-2 cursor-pointer text-sm text-red-600 hover:bg-gray-100">
                          <FontAwesomeIcon icon={faTrash} className="mr-2" /> Delete
                        </button>
                      </motion.div>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <FilterModal
        isOpen={toggleFilter}
        onClose={() => setToggleFilter(false)}
        paymentMethods={paymentMethods}
        settledDurations={settledDurations}
        statuses={statuses}
        onApplyFilters={handleApplyFilters}
      />
    </motion.div>
  );
};

export default UserLoan;
