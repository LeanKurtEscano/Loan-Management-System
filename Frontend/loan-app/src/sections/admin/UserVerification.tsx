
import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEye,
  faUser,
  faCheckCircle,
  faClock,
  faExclamationTriangle,
  faSpinner,
  faSearch,
  faFilter,
  faSort,
  faSortUp,
  faSortDown,
  faChevronLeft,
  faChevronRight,
  faAngleDoubleLeft,
  faAngleDoubleRight
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../services/axiosConfig";
import Modal from "../../components/Modal";
import { formatDate } from "../../utils/formatDate";
import { getUserDetails } from "../../services/admin/adminData";
import { ApplicationData } from "../../constants/interfaces/adminInterface";
// Define types
interface User {
  first_name: string;
  middle_name?: string;
  last_name: string;
}

interface LoanApplication {
  id: string;
  user: User;
  status: "Pending" | "Approved" | "Rejected";
  created_at: string;
}

interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

interface StatusBadgeProps {
  status: "Pending" | "Approved" | "Rejected";
}

interface SortIconProps {
  column: string;
  sortConfig: SortConfig | null;
}

interface StatCard {
  title: string;
  value: number;
  icon: any;
  color: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 }
  }),
};

const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      when: "beforeChildren"
    }
  }
};

const rowVariants = {
  hidden: { opacity: 0, y: -5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2 }
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let colorClass = "";
  let icon = null;

  switch (status) {
    case "Approved":
      colorClass = "bg-green-100 text-green-800 border-green-200";
      icon = faCheckCircle;
      break;
    case "Rejected":
      colorClass = "bg-red-100 text-red-800 border-red-200";
      icon = faExclamationTriangle;
      break;
    default: // Pending
      colorClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
      icon = faClock;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colorClass} border`}>
      <FontAwesomeIcon icon={icon} className="mr-1" />
      {status}
    </span>
  );
};

const SortIcon: React.FC<SortIconProps> = ({ column, sortConfig }) => {
  if (!sortConfig || sortConfig.key !== column) {
    return <FontAwesomeIcon icon={faSort} className="ml-1 text-gray-400 opacity-70" />;
  }
  return sortConfig.direction === 'asc'
    ? <FontAwesomeIcon icon={faSortUp} className="ml-1 text-blue-600" />
    : <FontAwesomeIcon icon={faSortDown} className="ml-1 text-blue-600" />;
};

const UserVerification: React.FC = () => {
  // State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<string>("All");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "created_at", direction: "desc" });
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState<boolean>(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [paginationRange, setPaginationRange] = useState<(number | string)[]>([]);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: loanApplications, isLoading, isError, error } = useQuery<ApplicationData[]>(['verifyData'], getUserDetails);


  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await adminApi.post('/remove/', {
        id: selectedId
      });

    },

    onSuccess: () => {
      queryClient.invalidateQueries(["verifyData"]);

    }
  })



  const handleSelect = (id: number) => {
    navigate(`/dashboard/verify/${id}`);
    console.log("Selected User ID:", id);
  };

  const handleOpenDeleteModal = (id: number): void => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async (): Promise<void> => {
    if (selectedId) {
      await deleteMutation.mutateAsync(selectedId);
      setIsModalOpen(false);
    }
  };

  const handleSort = (key: string): void => {
    let direction: "asc" | "desc" = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const clearFilters = (): void => {
    setSearchTerm("");
    setStatusFilter("All");
    setDateFilter("All");
  };

  // Helper functions for date filtering
  const getDateRange = (rangeType: string): { start: Date, end: Date } | null => {
    const now = new Date();
    const startDate = new Date();

    switch (rangeType) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        return { start: startDate, end: now };
      case 'yesterday':
        startDate.setDate(now.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        const endOfYesterday = new Date(startDate);
        endOfYesterday.setHours(23, 59, 59, 999);
        return { start: startDate, end: endOfYesterday };
      case 'thisWeek':
        startDate.setDate(now.getDate() - now.getDay());
        startDate.setHours(0, 0, 0, 0);
        return { start: startDate, end: now };
      case 'thisMonth':
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        return { start: startDate, end: now };
      default:
        return null;
    }
  };

  // Filtered and sorted data
  const filteredApplications = useMemo(() => {
    if (!loanApplications || !Array.isArray(loanApplications)) {
      return [];
    }

    return loanApplications.filter(loan => {
      // Search filter
      const fullName = `${loan.first_name} ${loan.middle_name || ''} ${loan.last_name}`.toLowerCase();
      const matchesSearch = fullName.includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === "All" || loan.status === statusFilter;

      // Date filter
      let matchesDate = true;
      if (dateFilter !== "All") {
        const dateRange = getDateRange(dateFilter);
        if (dateRange) {
          const applicationDate = new Date(loan.created_at);
          matchesDate = applicationDate >= dateRange.start && applicationDate <= dateRange.end;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [loanApplications, searchTerm, statusFilter, dateFilter]);

  // Sort applications based on sort config
  const sortedApplications = useMemo(() => {
    if (!filteredApplications || !Array.isArray(filteredApplications)) {
      return [];
    }

    const sortableItems = [...filteredApplications];

    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue: any, bValue: any;

        // Handle nested properties and special cases
        if (sortConfig.key === 'name') {
          aValue = `${a.user.first_name} ${a.user.last_name}`;
          bValue = `${b.user.first_name} ${b.user.last_name}`;
        } else if (sortConfig.key === 'created_at') {
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
        } else if (sortConfig.key.includes('.')) {
          const keys = sortConfig.key.split('.');
          aValue = keys.reduce((obj: any, key: string) => obj && obj[key], a);
          bValue = keys.reduce((obj: any, key: string) => obj && obj[key], b);
        } else {
          aValue = (a as any)[sortConfig.key];
          bValue = (b as any)[sortConfig.key];
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredApplications, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(sortedApplications.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter, sortConfig]);

  // Generate pagination range
  useEffect(() => {
    const createPaginationRange = (): (number | string)[] => {
      const delta = 2; // Number of pages to show on each side of current page
      let range: number[] = [];

      // Always include first page
      range.push(1);

      // Calculate range of page numbers
      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i);
      }

      // Always include last page if not already included
      if (totalPages > 1) {
        range.push(totalPages);
      }

      // Add ellipses
      let rangeWithEllipsis: (number | string)[] = [];
      let l: number | undefined;

      for (const i of range) {
        if (l) {
          if (i - l > 1) {
            rangeWithEllipsis.push('...');
          }
        }
        rangeWithEllipsis.push(i);
        l = i;
      }

      return rangeWithEllipsis;
    };

    setPaginationRange(createPaginationRange());
  }, [currentPage, totalPages]);

  // Get paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedApplications.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedApplications, currentPage, itemsPerPage]);

  // Pagination handlers
  const goToPage = (page: number): void => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToFirstPage = (): void => goToPage(1);
  const goToLastPage = (): void => goToPage(totalPages);
  const goToPrevPage = (): void => goToPage(currentPage - 1);
  const goToNextPage = (): void => goToPage(currentPage + 1);

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Calculate stats
  const totalApplications = loanApplications?.length;
  const pendingApplications = loanApplications?.filter(app => app.status === "Pending").length;
  const approvedApplications = loanApplications?.filter(app => app.status === "Approved").length;

  const stats: StatCard[] = [
    { title: "Total Applications", value: totalApplications, icon: faUser, color: "from-blue-400 to-blue-600" },
    { title: "Pending Applications", value: pendingApplications, icon: faClock, color: "from-yellow-400 to-yellow-600" },
    { title: "Approved Applications", value: approvedApplications, icon: faCheckCircle, color: "from-green-400 to-green-600" }
  ];

  if (isError) {
    return (
      <div className="p-8 text-center">
        <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-4xl mb-4" />
        <h3 className="text-xl font-semibold mb-2">Error Loading Applications</h3>
        <p className="text-gray-600 mb-4">We couldn't load the application data. Please try again later.</p>
        <button
          onClick={() => queryClient.invalidateQueries(["loanApplications"])}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }


  return (
    <div className="p-6 w-full min-h-screen max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
          User Verification
        </h2>
        <p className="text-gray-600">
          Review and manage user verification applications submitted by users
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white shadow-md rounded-xl overflow-hidden"
          >
            <div className={`h-2 bg-gradient-to-r ${stat.color}`}></div>
            <div className="p-5 flex items-center">
              <div className={`rounded-full px-3 py-2.5  bg-gradient-to-br ${stat.color} text-white mr-4`}>
                <FontAwesomeIcon icon={stat.icon} className="text-3xl" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-5 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search bar */}
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Basic filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center">
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <button
                className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}
              >
                <FontAwesomeIcon icon={faFilter} />
                <span>Advanced Filters</span>
              </button>
            </div>
          </div>

          {/* Advanced filters section */}
          <AnimatePresence>
            {isAdvancedFilterOpen && (

              <motion.div
                initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                animate={{ opacity: 1, height: "auto", overflow: "hidden" }}
                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <select
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    >
                      <option value="All">All Time</option>
                      <option value="today">Today</option>
                      <option value="yesterday">Yesterday</option>
                      <option value="thisWeek">This Week</option>
                      <option value="thisMonth">This Month</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 flex justify-end items-end">
                    <button
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results count */}
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{Math.min(sortedApplications.length, itemsPerPage)}</span> of <span className="font-medium">{sortedApplications.length}</span> applications
          </p>

          {(searchTerm || statusFilter !== "All" || dateFilter !== "All") && (
            <div className="flex items-center">
              <span className="text-sm text-gray-500 italic mr-2">Filters applied</span>
              <button
                className="text-xs text-blue-600 hover:underline"
                onClick={clearFilters}
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Table Section */}
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 text-3xl mb-4" />
            <p className="text-gray-600">Loading application data...</p>
          </div>
        ) : sortedApplications.length === 0 ? (
          <div className="p-12 text-center">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-4xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No results found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <motion.table
              className="w-full"
              variants={tableVariants}
              initial="hidden"
              animate="visible"
            >
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name <SortIcon column="name" sortConfig={sortConfig} />
                    </div>
                  </th>

                  <th
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Birthdate
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status <SortIcon column="status" sortConfig={sortConfig} />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center">
                      Submitted Date <SortIcon column="created_at" sortConfig={sortConfig} />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.map((loan, index) => (
                  <motion.tr
                    key={loan.id}
                    variants={rowVariants}
                    className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm whitespace-nowrap font-medium text-gray-900 max-w-[150px] overflow-hidden text-ellipsis truncate">
                        {loan.first_name} {loan.middle_name ? loan.middle_name + " " : ""}
                        {loan.last_name}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {loan.birthdate}

                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={loan.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        {formatDate(loan.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleSelect(loan.id)}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer hover:bg-blue-100 transition-colors rounded-full p-2"
                          title="View details"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                       
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        )}


        {sortedApplications.length > 0 && (
          <div className="px-6 py-4 bg-white border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center">

              <div className="flex items-center mb-4 sm:mb-0">
                <span className="text-sm text-gray-700 mr-2">Show</span>
                <select
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"

                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-700 ml-2">per page</span>
              </div>

              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-4">
                  Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                </span>

                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">

                  <button
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                  >
                    <span className="sr-only">First page</span>
                    <FontAwesomeIcon icon={faAngleDoubleLeft} className="h-4 w-4" />
                  </button>


                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium ${currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                  >
                    <span className="sr-only">Previous</span>
                    <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
                  </button>


                  {paginationRange.map((pageNumber, i) => (
                    pageNumber === '...' ? (
                      <span
                        key={`ellipsis-${i}`}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={`page-${pageNumber}`}
                        onClick={() => goToPage(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${currentPage === pageNumber
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                          }`}
                      >
                        {pageNumber}
                      </button>
                    )
                  ))}


                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium ${currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                  >
                    <span className="sr-only">Next</span>
                    <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
                  </button>


                  <button
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                  >
                    <span className="sr-only">Last page</span>
                    <FontAwesomeIcon icon={faAngleDoubleRight} className="h-4 w-4" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <Modal
          loading={deleteMutation.isLoading}
          isOpen={isModalOpen}
          title="Delete User Verification Application"
          message="Are you sure you want to delete this user verification application? This action cannot be undone."
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default UserVerification;