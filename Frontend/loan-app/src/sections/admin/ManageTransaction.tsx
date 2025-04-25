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
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { adminDisbursementApi } from "../../services/axiosConfig";
import Modal from "../../components/Modal";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

const rowVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
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

  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border rounded-lg shadow-sm">
        <div className="flex items-center text-sm text-gray-700">
          <span>Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">
            {Math.min(indexOfLastItem, filteredData.length)}</span> of <span className="font-medium">{filteredData.length}</span> results
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          
          {/* Page number buttons */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Calculate the page numbers to show based on current page
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={i}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
          >
            <FontAwesomeIcon icon={faChevronRight} />
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
            className="border rounded-md px-2 py-1 text-sm"
          >
            {[5, 10, 25, 50].map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading transactions. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-5 w-auto min-h-screen max-w-4xl mx-auto">
      {/* Title Section */}
      <motion.h2
        className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent mb-3 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Loan Disbursement Payments
      </motion.h2>
      <p className="text-gray-700 text-center mb-5">
        Below are the transactions related to the approved loan disbursement.
      </p>

      {/* Filter and Search Section */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by amount or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
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
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <motion.table 
            className="w-full text-sm" 
            initial="hidden" 
            animate="visible" 
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <thead className="bg-blue-600 text-white text-sm font-semibold">
              <tr>
                <th 
                  className="p-3 text-left cursor-pointer" 
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center">
                    Amount
                    <FontAwesomeIcon 
                      icon={faSort} 
                      className="ml-1" 
                      opacity={sortConfig.key === 'amount' ? 1 : 0.3}
                    />
                  </div>
                </th>
                <th 
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    <FontAwesomeIcon 
                      icon={faSort} 
                      className="ml-1" 
                      opacity={sortConfig.key === 'status' ? 1 : 0.3}
                    />
                  </div>
                </th>
                <th 
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center">
                    Submitted
                    <FontAwesomeIcon 
                      icon={faSort} 
                      className="ml-1" 
                      opacity={sortConfig.key === 'created_at' ? 1 : 0.3}
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
                    className="border-b hover:bg-gray-50 transition-colors" 
                    variants={rowVariants}
                  >
                    <td className="p-3 whitespace-nowrap">{formatCurrency(item.amount)}</td>
                    <td className={`p-3 whitespace-nowrap ${
                      item.status === "Approved"
                        ? "text-green-600"
                        : item.status === "Rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.status === "Approved"
                          ? "bg-green-100"
                          : item.status === "Rejected"
                            ? "bg-red-100"
                            : "bg-yellow-100"
                        }`}
                      >
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">{formatDate(item.created_at)}</td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <button 
                        className="text-blue-500 cursor-pointer hover:text-blue-700 p-2 transition-colors" 
                        title="View" 
                        onClick={() => handleSelect(item.id)}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button 
                        onClick={() => handleSelectId(item.id)} 
                        className="text-red-500 cursor-pointer hover:text-red-700 p-2 ml-3 transition-colors" 
                        title="Delete"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No transactions found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </motion.table>
        </div>
      </div>

    
      {renderPagination()}

     
      {filteredData.length === 0 && !isLoading && (
        <div className="mt-6 text-center py-8 bg-gray-50 rounded-lg">
          <div className="text-gray-400 text-5xl mb-4">
            <FontAwesomeIcon icon={faFilter} />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-1">No transactions found</h3>
          <p className="text-gray-500">
            Try changing your search criteria or clearing filters
          </p>
          {searchTerm || filterStatus !== 'All' ? (
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('All');
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Clear all filters
            </button>
          ) : null}
        </div>
      )}


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