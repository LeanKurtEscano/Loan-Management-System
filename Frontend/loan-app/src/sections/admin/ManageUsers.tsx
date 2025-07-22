import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { loanApi } from "../../services/axiosConfig";
import { fetchLoanData } from "../../services/user/loan";
import {  faTrash,
    faEye,
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
    faAngleDoubleRight,
    faUserFriends,
    faStar,faBan
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import { formatDate } from "../../utils/formatDate";
import { BlacklistedBadge } from "../../components/admin/Badges";
interface SortConfig {
    key: string;
    direction: "asc" | "desc";
}

interface VerificationStatusBadgeProps {
    status: string;
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

const VerificationStatusBadge: React.FC<VerificationStatusBadgeProps> = ({ status }) => {
    let colorClass = "";
    let icon = null;

    switch (status) {
        case "verified":
            colorClass = "bg-green-100 text-green-800 border-green-200";
            icon = faCheckCircle;
            break;
        case "rejected":
            colorClass = "bg-red-100 text-red-800 border-red-200";
            icon = faExclamationTriangle;
            break;
        case "pending":
            colorClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
            icon = faClock;
            break;
        default:
            colorClass = "bg-gray-100 text-gray-800 border-gray-200";
            icon = faExclamationTriangle;
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colorClass} border`}>
            <FontAwesomeIcon icon={icon} className="mr-1" />
            {status === "not applied" ? "Not Applied" : status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

const GoodPayerBadge: React.FC = () => {
    return (
        <span className="inline-flex items-center ml-2 px-1 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            <FontAwesomeIcon icon={faStar} className=" text-yellow-500" />
        
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

const ManageUsers: React.FC = () => {
    // State
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [verificationFilter, setVerificationFilter] = useState<string>("All");
    const [borrowerFilter, setBorrowerFilter] = useState<string>("All");
    const [goodPayerFilter, setGoodPayerFilter] = useState<string>("All");
    const [blacklistedFilter, setBlacklistedFilter] = useState<string>("All"); // New blacklisted filter state
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "id", direction: "desc" });
    const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState<boolean>(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [paginationRange, setPaginationRange] = useState<(number | string)[]>([]);

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const endpoint = "users";

    const { data: users, isLoading, isError } = useQuery({
        queryKey: ["loanUsers"],
        queryFn: () => fetchLoanData(endpoint),
    });

    console.log(users);

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await loanApi.post('/remove/user/', {
                id: selectedId
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["loanUsers"]);
        }
    });

    const handleViewUser = (id: number) => {
        navigate(`/dashboard/users/${id}`);
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
        setVerificationFilter("All");
        setBorrowerFilter("All");
        setGoodPayerFilter("All");
        setBlacklistedFilter("All"); // Clear blacklisted filter
    };

    const filteredUsers = useMemo(() => {
        if (!users || !Array.isArray(users)) {
            return [];
        }

        return users.filter(user => {
         
            const fullName = `${user.first_name} ${user.middle_name || ''} ${user.last_name} ${user?.suffix || user.suffix || ''}`.toLowerCase();
            const matchesSearch = searchTerm ?
                fullName.includes(searchTerm.toLowerCase()) ||
                (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) :
                true;

          
            const matchesVerification = verificationFilter === "All" || user.is_verified === verificationFilter;

          
            const matchesBorrower = borrowerFilter === "All" ||
                (borrowerFilter === "Yes" && user.is_borrower) ||
                (borrowerFilter === "No" && !user.is_borrower);
                
            // Filter by good payer status
            const matchesGoodPayer = goodPayerFilter === "All" ||
                (goodPayerFilter === "Yes" && user.is_good_payer) ||
                (goodPayerFilter === "No" && !user.is_good_payer);

            // Filter by blacklisted status
            const matchesBlacklisted = blacklistedFilter === "All" ||
                (blacklistedFilter === "Yes" && user.is_blacklisted) ||
                (blacklistedFilter === "No" && !user.is_blacklisted);

            return matchesSearch && matchesVerification && matchesBorrower && matchesGoodPayer && matchesBlacklisted;
        });
    }, [users, searchTerm, verificationFilter, borrowerFilter, goodPayerFilter, blacklistedFilter]);

    const sortedUsers = useMemo(() => {
        if (!filteredUsers || !Array.isArray(filteredUsers)) {
            return [];
        }

        const sortableItems = [...filteredUsers];

        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                let aValue: any, bValue: any;

                if (sortConfig.key === 'name') {
                    aValue = `${a.first_name} ${a.last_name}`;
                    bValue = `${b.first_name} ${b.last_name}`;
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
    }, [filteredUsers, sortConfig]);

    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, verificationFilter, borrowerFilter, goodPayerFilter, blacklistedFilter, sortConfig]);

    useEffect(() => {
        const createPaginationRange = (): (number | string)[] => {
            const delta = 2;
            let range: number[] = [];

            range.push(1);

            for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
                range.push(i);
            }

            if (totalPages > 1) {
                range.push(totalPages);
            }

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

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedUsers.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedUsers, currentPage, itemsPerPage]);

    const tableHeaders = [
        { label: 'Username', key: 'username', sortable: true },
        { label: 'Full Name', key: 'name', sortable: true },
        { label: 'Email', key: 'email', sortable: true },
        { label: 'Borrower', key: 'is_borrower', sortable: true },
        { label: 'Verification Status', key: 'is_verified', sortable: true },
        { label: 'Actions', key: 'actions', sortable: false, center: true }
    ];

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
    const totalUsers = users?.length || 0;
    const borrowers = users?.filter(user => user.is_borrower).length || 0;
    const blacklistedUsers = users?.filter(user => user.is_blacklisted).length || 0;
    const goodPayers = users?.filter(user => user.is_good_payer).length || 0;

    const stats: StatCard[] = [
        { title: "Total Users", value: totalUsers, icon: faUserFriends, color: "from-blue-400 to-blue-600" },
        { title: "Borrowers", value: borrowers, icon: faCheckCircle, color: "from-green-400 to-green-600" },
       { title: "Blacklisted Users", value: blacklistedUsers, icon: faBan, color: "from-red-400 to-red-600" },
        { title: "Good Payers", value: goodPayers, icon: faStar, color: "from-purple-400 to-purple-600" }
    ];

    if (isError) {
        return (
            <div className="p-8 text-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-4xl mb-4" />
                <h3 className="text-xl font-semibold mb-2">Error Loading Users</h3>
                <p className="text-gray-600 mb-4">We couldn't load the user data. Please try again later.</p>
                <button
                    onClick={() => queryClient.invalidateQueries(["loanUsers"])}
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
                Manage Users
            </h2>
            <p className="text-gray-600">
                View and manage user accounts in the system
            </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
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
                        <div className={`rounded-full px-3 py-2.5 bg-gradient-to-br ${stat.color} text-white mr-4`}>
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

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-5 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative flex-grow max-w-md">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex items-center">
                            <select
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full"
                                value={verificationFilter}
                                onChange={(e) => setVerificationFilter(e.target.value)}
                            >
                                <option value="All">All Verifications</option>
                                <option value="verified">Verified</option>
                                <option value="pending">Pending</option>
                                <option value="rejected">Rejected</option>
                                <option value="not applied">Not Applied</option>
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

                <AnimatePresence>
                    {isAdvancedFilterOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                            animate={{ opacity: 1, height: "auto", overflow: "hidden" }}
                            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 pt-4 border-t border-gray-200"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Borrower Status</label>
                                    <select
                                        className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        value={borrowerFilter}
                                        onChange={(e) => setBorrowerFilter(e.target.value)}
                                    >
                                        <option value="All">All Users</option>
                                        <option value="Yes">Borrowers</option>
                                        <option value="No">Non-Borrowers</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Good Payer Status</label>
                                    <select
                                        className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        value={goodPayerFilter}
                                        onChange={(e) => setGoodPayerFilter(e.target.value)}
                                    >
                                        <option value="All">All Users</option>
                                        <option value="Yes">Good Payers</option>
                                        <option value="No">Regular Payers</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Blacklisted Status</label>
                                    <select
                                        className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        value={blacklistedFilter}
                                        onChange={(e) => setBlacklistedFilter(e.target.value)}
                                    >
                                        <option value="All">All Users</option>
                                        <option value="Yes">Blacklisted</option>
                                        <option value="No">Not Blacklisted</option>
                                    </select>
                                </div>

                                <div className="md:col-span-1 flex justify-end items-end">
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

            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                    Showing <span className="font-medium">{Math.min(sortedUsers.length, itemsPerPage)}</span> of <span className="font-medium">{sortedUsers.length}</span> users
                </p>

                {(searchTerm || verificationFilter !== "All" || borrowerFilter !== "All" || goodPayerFilter !== "All" || blacklistedFilter !== "All") && (
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

            {isLoading ? (
                <div className="p-12 flex flex-col items-center justify-center">
                    <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 text-3xl mb-4" />
                    <p className="text-gray-600">Loading user data...</p>
                </div>
            ) : sortedUsers.length === 0 ? (
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
                                {tableHeaders.map((header) => (
                                    <th
                                        key={header.key}
                                        className={`px-6 py-4 text-${header.center ? 'center' : 'left'} text-xs font-medium uppercase tracking-wider ${header.sortable ? 'cursor-pointer' : ''}`}
                                        onClick={header.sortable ? () => handleSort(header.key) : undefined}
                                    >
                                        <div className={`flex items-center ${header.center ? 'justify-center' : ''}`}>
                                            {header.label}
                                            {header.sortable && <SortIcon column={header.key} sortConfig={sortConfig} />}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {paginatedData.map((user, index) => (
                                <motion.tr
                                    key={user.id}
                                    variants={rowVariants}
                                    className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                >
                                    <td className="px-6 py-4">
                                        <div className="text-sm flex whitespace-nowrap font-medium text-gray-900">
                                            {user.username}
                                            {user.is_good_payer && (<GoodPayerBadge />)}
                                            {user.is_blacklisted && (<BlacklistedBadge />)}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="text-sm whitespace-nowrap font-medium pr-44 text-gray-900 max-w-[150px] overflow-hidden text-ellipsis truncate flex items-center">
                                            <span>
                                                {user.first_name} {user.middle_name ? user.middle_name + " " : ""}
                                                {user.last_name} 
                                                {user.suffix ? " " + user.suffix : ""}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-1 py-4">
                                        <div className="text-sm text-gray-700">
                                            {user.email || "Not provided"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-700">
                                            {user.is_borrower ? "Yes" : "No"}
                                        </div>
                                    </td>
                                    <td className="px-6 whitespace-nowrap py-4">
                                        <VerificationStatusBadge status={user.is_verified} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                onClick={() => handleViewUser(user.id)}
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

            {sortedUsers.length > 0 && (
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
                                            onClick={() => typeof pageNumber === 'number' && goToPage(pageNumber)}
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
                title="Delete User Account?"
                message="Are you sure you want to delete this user account? This action cannot be undone."
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
            />
        )}
    </div>
    );
};

export default ManageUsers;