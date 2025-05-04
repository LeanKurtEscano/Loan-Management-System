import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTransaction } from '../../services/admin/adminDisbursement';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEye, 
  faTrash, 
  faSearch, 
  faFilter, 
  faSort,
  faChevronLeft,
  faChevronRight,
  faMoneyBillWave,
  faExclamationTriangle,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { adminDisbursementApi } from "../../services/axiosConfig";
import Modal from "../../components/Modal";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren", 
      staggerChildren: 0.1 
    } 
  }
};

const rowVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const ManageTransaction = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  // Fetch data
  const { data: originalData, isLoading, isError } = useQuery({
    queryKey: ["adminManageTransactions", id],
    queryFn: () => getTransaction(id!),
    enabled: !!id,
  });

  // State variables
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // Filtering and sorting states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [filteredData, setFilteredData] = useState<any[]>([]);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await adminDisbursementApi.post('/remove/payment/', {
        id: selectedId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["loanPayments", "adminManageTransactions"]);
    }
  });

  // Update filtered data whenever original data or filters change
  useEffect(() => {
    if (!originalData) return;
    
    let result = [...originalData];
    
    // Apply status filter
    if (filterStatus !== 'All') {
      result = result.filter(item => item.status.toLowerCase() === filterStatus.toLowerCase());
    }
    
    // Apply search term (search by amount)
    if (searchTerm) {
      result = result.filter(item => 
        item.amount.toString().includes(searchTerm) || 
        formatDate(item.created_at).includes(searchTerm)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const key = sortConfig.key as keyof typeof a;
      if (a[key] < b[key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredData(result);
  }, [originalData, searchTerm, filterStatus, sortConfig]);
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = filteredData ? Math.ceil(filteredData.length / itemsPerPage) : 0;

  // Handler functions
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (key: string) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelect = (id: number) => {
    navigate(`/dashboard/payment/approve/${id}`);
  };

  const handleSelectId = (id: number) => {
    setIsModalOpen(true);
    setSelectedId(id);
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync();
    setIsModalOpen(false);
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  // Generate pagination numbers
  const generatePaginationNumbers = () => {
    const pageNumbers = [];
    let startPage, endPage;
    
    if (totalPages <= 5) {
      // Less than 5 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // More than 5 total pages, calculate start and end pages
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }
    
    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pageNumbers = generatePaginationNumbers();
    
    return (
      <motion.div 
        className="flex flex-col sm:flex-row items-center justify-between mt-6 px-4 py-4 bg-white border rounded-lg shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center text-sm text-gray-700 mb-3 sm:mb-0">
          <span>Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">
            {Math.min(indexOfLastItem, filteredData.length)}</span> of <span className="font-medium">{filteredData.length}</span> results
          </span>
        </div>
        
        <div className="flex flex-wrap items-center justify-center space-x-1 mb-3 sm:mb-0">
          <button 
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={`px-2 py-1 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
          >
            <span className="sr-only">First</span>
            <span className="text-xs">First</span>
          </button>
          
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-2 py-1 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          
          {/* Page numbers */}
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`px-3 py-1 rounded-md transition-colors duration-300 ${
                currentPage === number
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              {number}
            </button>
          ))}
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-2 py-1 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
          
          <button 
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-2 py-1 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
          >
            <span className="sr-only">Last</span>
            <span className="text-xs">Last</span>
          </button>
        </div>
        
        <div className="flex items-center">
          <label className="mr-2 text-sm text-gray-700">Items per page:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[5, 10, 25, 50].map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600">
            <FontAwesomeIcon icon={faMoneyBillWave} />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-3xl mb-3" />
        <h3 className="text-lg font-medium text-red-700 mb-2">Error Loading Transactions</h3>
        <p className="text-red-600">
          We couldn't load the transaction data. Please try again later or contact support.
        </p>
        <button
          onClick={handleGoBack}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center mx-auto"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 w-auto min-h-screen max-w-4xl mx-auto">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4"
      >
        <button
          onClick={handleGoBack}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Go Back
        </button>
      </motion.div>

      {/* Title Section */}
      <motion.div
        className="mb-8 text-center"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent mb-3">
          Loan Disbursement Payments
        </h2>
        <p className="text-gray-700">
          Below are the transactions related to the approved loan disbursement.
        </p>
      </motion.div>

      {/* Filter and Search Section */}
      <motion.div 
        className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by amount or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white transition-all"
              >
                <option value="All">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
              </div>
            </div>
            
            {(searchTerm || filterStatus !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('All');
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Transaction Table */}
      <motion.div 
        className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold">
              <tr>
                <th 
                  className="p-3 text-left cursor-pointer hover:bg-blue-700 transition-colors" 
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center">
                    Amount
                    <FontAwesomeIcon 
                      icon={faSort} 
                      className={`ml-1 transition-opacity ${sortConfig.key === 'amount' ? 'opacity-100' : 'opacity-30'}`}
                    />
                  </div>
                </th>
                <th 
                  className="p-3 text-left cursor-pointer hover:bg-blue-700 transition-colors"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    <FontAwesomeIcon 
                      icon={faSort} 
                      className={`ml-1 transition-opacity ${sortConfig.key === 'status' ? 'opacity-100' : 'opacity-30'}`}
                    />
                  </div>
                </th>
                <th 
                  className="p-3 text-left cursor-pointer hover:bg-blue-700 transition-colors"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center">
                    Submitted
                    <FontAwesomeIcon 
                      icon={faSort} 
                      className={`ml-1 transition-opacity ${sortConfig.key === 'created_at' ? 'opacity-100' : 'opacity-30'}`}
                    />
                  </div>
                </th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <motion.tr 
                    key={item.id} 
                    className="border-b hover:bg-blue-50 transition-colors" 
                    variants={rowVariants}
                  >
                    <td className="p-3 whitespace-nowrap font-medium">{formatCurrency(item.amount)}</td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : item.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap text-gray-600">{formatDate(item.created_at)}</td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <div className="flex justify-center space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-2 rounded-full transition-colors" 
                          title="View details" 
                          onClick={() => handleSelect(item.id)}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                       
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500">
                    No transactions found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination */}
      {renderPagination()}

      {/* Empty State */}
      {filteredData.length === 0 && !isLoading && (
        <motion.div 
          className="mt-6 text-center py-10 bg-gray-50 rounded-lg border border-gray-200 shadow-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-gray-400 text-5xl mb-4">
            <FontAwesomeIcon icon={faFilter} />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No transactions found</h3>
          <p className="text-gray-500 mb-4">
            Try changing your search criteria or clearing filters
          </p>
          {searchTerm || filterStatus !== 'All' ? (
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('All');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Clear all filters
            </button>
          ) : null}
        </motion.div>
      )}

      {/* Confirmation Modal */}
      {isModalOpen && selectedId !== null && (
        <Modal 
          loading={loading || deleteMutation.isLoading} 
          isOpen={isModalOpen} 
          title="Delete Payment" 
          message="Are you sure you want to delete this payment? This action cannot be undone."
          onClose={() => setIsModalOpen(false)} 
          onConfirm={handleDelete} 
        />
      )}
    </div>
  );
};

export default ManageTransaction;