import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faFilter, 
  faEllipsisH, 
  faTrash, 
  faEye, 
  faChevronLeft, 
  faChevronRight,
  faSortAmountDown,
  faSortAmountUp,
  faCalendarAlt
} from "@fortawesome/free-solid-svg-icons";
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
  const { data: rawData, isLoading, isError, error, refetch } = useQuery(
    ["userTransactions"], 
    getTransactions,
    {
      refetchOnWindowFocus: false,
      staleTime: 300000, // 5 minutes
      onSuccess: (data) => {
        // Ensure data is properly initialized
        setFilteredData(data || []);
        setTotalPages(Math.ceil((data?.length || 0) / itemsPerPage));
      }
    }
  );
  
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const nav = useNavigate();
  const [activeFilters, setActiveFilters] = useState<{
    paymentMethod?: string;
    settledDuration?: string;
    status?: string;
  }>({});
  const [toggleFilter, setToggleFilter] = useState(false);
  
  // Date sorting
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc'); // Default newest first
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const paymentMethods = ["gcash", "maya"];
  const settledDurations = ["1 month", "2 months", "3 months", "More than 3 months"];
  const statuses = ["Approved", "Pending", "Rejected"];
  
  const handleApplyFilters = (filters: {
    paymentMethod?: string;
    settledDuration?: string;
    status?: string;
  }) => {
    setActiveFilters(filters);
    setCurrentPage(1); // Reset to first page when filters change
    console.log("Applied filters:", filters);
  };

  // Handle filter change
  const handleSelect = (value: string) => {
    setSelectedFilter(value);
  };

  const handleToggleChange = (value: boolean) => {
    setToggleFilter(value);
  };

  const toggleActions = (index: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent event bubbling
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (activeIndex !== null) {
        setActiveIndex(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeIndex]);

  // Handle View Button click
  const handleView = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    nav(`/user/my-transactions/${id}`);
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  // Filter and sort data based on active filters and sort direction
  useEffect(() => {
    if (!rawData) return;
    
    let filtered = [...rawData];
    
    if (activeFilters.paymentMethod) {
      filtered = filtered.filter(item => 
        item.loan.cashout.toLowerCase() === activeFilters.paymentMethod?.toLowerCase()
      );
    }
    
    if (activeFilters.settledDuration) {
      filtered = filtered.filter(item => {
        if (activeFilters.settledDuration === "More than 3 months") {
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
    
    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    setFilteredData(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  }, [rawData, activeFilters, sortDirection, itemsPerPage]);

  // Get current data for pagination
  const getCurrentPageData = () => {
    if (!filteredData || filteredData.length === 0) return [];
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;
    
    if (totalPages <= maxPageButtons) {
      // Show all page numbers
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show limited page numbers with ellipsis
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("ellipsis");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("ellipsis");
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
        pageNumbers.push("ellipsis");
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> Failed to load transactions. Please try again later.</span>
        <button 
          onClick={() => refetch()} 
          className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      className="p-3 md:p-5 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <UserDashboard
        data={filteredData}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      />

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">My Loans</h2>
          <div className="flex flex-wrap items-center gap-3">
            {/* Date Sort Filter */}
            
            {/* Filter Button */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Filters:</span>
              <Filter
                label="Filters"
                toggle={toggleFilter}
                onToggleChange={handleToggleChange} 
              />
            </div>
          </div>
        </div>

        {filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p className="mt-4 text-lg font-medium text-gray-500">No loans found</p>
            <p className="text-sm text-gray-400">Try adjusting your filters or apply for a new loan</p>
            <button 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              onClick={() => setActiveFilters({})}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {getCurrentPageData().map((tx: any, index: number) => (
                <motion.div
                  key={index}
                  className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => nav(`/user/my-transactions/${tx.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">
                        {formatDateWithWords(tx.created_at)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTime(tx.created_at)}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(tx.status)}`}>
                      {tx.status}
                    </span>
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center">
                    <div>
                      <div className="text-xs text-gray-500">Amount</div>
                      <div className="font-bold text-gray-900">{formatCurrency(tx.amount)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Duration</div> 
                      <div className="font-medium text-gray-900">{tx.period}</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center">
                    <div>
                      <div className="text-xs text-gray-500">Frequency</div>
                      <div className="font-medium text-gray-900">{tx.loan.frequency}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Payment Method</div>
                      <div className="mt-1">
                        {tx.loan.cashout === "gcash" && (
                          <div className="bg-blue-50 px-2 py-1 rounded-md inline-flex items-center">
                            <img src={gcash} alt="Gcash" className="w-14 h-6 object-contain" />
                          </div>
                        )}
                        {tx.loan.cashout === "maya" && (
                          <div className="bg-green-50 px-2 py-1 rounded-md inline-flex items-center">
                            <img src={maya} alt="Maya" className="w-14 h-6 object-contain" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <div className="relative">
                      <button 
                        onClick={(e) => toggleActions(tx.id, e)} 
                        className="p-2 rounded-full cursor-pointer hover:bg-gray-200"
                      >
                        <FontAwesomeIcon icon={faEllipsisH} />
                      </button>
                      {activeIndex === tx.id && (
                        <motion.div
                          className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button 
                            onClick={(e) => handleView(tx.id, e)} 
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-500 transition-colors"
                          >
                            <FontAwesomeIcon icon={faEye} className="mr-2" /> View Details
                          </button>
                          <button 
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                          >
                            <FontAwesomeIcon icon={faTrash} className="mr-2" /> Delete
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Date</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {getCurrentPageData().map((tx: any, index: number) => (
                    <motion.tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => nav(`/user/my-transactions/${tx.id}`)}
                    >
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">{formatDateWithWords(tx.created_at)}</div>
                        <div className="text-xs text-gray-500">{formatTime(tx.created_at)}</div>
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-900">{formatCurrency(tx.amount)}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(tx.status)}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-700">{tx.period}</td>
                      <td className="px-4 py-4 text-gray-700">{tx.loan.frequency}</td>
                      <td className="px-4 py-4">
                        {tx.loan.cashout === "gcash" && (
                          <div className=" px-2 py-1 rounded-md inline-flex items-center">
                            <img src={gcash} alt="Gcash" className="w-16 h-8 object-contain" />
                          </div>
                        )}
                        {tx.loan.cashout === "maya" && (
                          <div className=" px-2 py-1 rounded-md inline-flex items-center">
                            <img src={maya} alt="Maya" className="w-16 h-8 object-contain" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                         
                          <button 
                                onClick={(e) => handleView(tx.id, e)} 
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-500 transition-colors"
                              >
                                <FontAwesomeIcon icon={faEye} className="mr-2" /> View Details
                              </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination - Mobile & Desktop */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="w-full sm:w-auto text-center sm:text-left">
                <p className="text-sm text-gray-600">
                  Showing {filteredData.length > 0 ? Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length) : 0} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-auto">
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                </div>
                
                <nav className="relative z-0 inline-flex rounded-md shadow-sm">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
                  </button>
                  
                  {/* Hide page numbers on small screens */}
                  <div className="hidden sm:flex">
                    {getPaginationNumbers().map((number, index) => (
                      number === "ellipsis" ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={number}
                          onClick={() => goToPage(number as number)}
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                            currentPage === number
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {number}
                        </button>
                      )
                    ))}
                  </div>
                  
                  {/* Show page indicator on small screens */}
                  <div className="sm:hidden flex items-center px-4 py-2 border-t border-b border-gray-300 bg-white text-sm">
                    <span className="text-gray-700">
                      {currentPage} / {totalPages}
                    </span>
                  </div>
                  
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
                  </button>
                </nav>
              </div>
            </div>
          </>
        )}
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