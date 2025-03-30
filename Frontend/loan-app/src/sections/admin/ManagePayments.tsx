import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash, faUsers, faClock, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { fetchPaymentsData } from "../../services/user/disbursement";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchLoanData } from "../../services/user/loan";
import { useNavigate } from "react-router-dom";
import { adminApi, adminDisbursementApi, loanApi } from "../../services/axiosConfig";
import Modal from "../../components/Modal";
import { formatDate, formatDateWithWords } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";


const cardVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i: number) => ({ opacity: 1, x: 0, transition: { delay: i * 0.2 } }),
};

const rowVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};



const ManagePayments: React.FC = () => {
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await adminDisbursementApi.post('/remove/payment/', {
                id: selectedId
            });

        },

        onSuccess: () => {
            queryClient.invalidateQueries(["loanPayments"]);

        }
    })

    const endpoint = "payments"

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["loanPayments"],
        queryFn: () =>fetchPaymentsData(endpoint),
      });


      console.log(data);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleSelect = (id: number) => {
        navigate(`/dashboard/payment/approve/${id}`);
        console.log("Selected User ID:", id);
    };


    const handleSelectId = (id: number) => {
        setIsModalOpen(true);
        setSelectedId(id);
    }

    const handleDelete = async () => {
        console.log(selectedId);
        await deleteMutation.mutateAsync(selectedId ?? 0);
        setIsModalOpen(false);


    };

    return (
        <div className="p-5 w-auto min-h-screen max-w-6xl mx-auto">

          
            
             <motion.h2
                className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent mb-3 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                Payment Verification
            </motion.h2>
            <p className="text-gray-700 text-center mb-5">
            </p>


            <div className="grid grid-cols-1  md:grid-cols-3 gap-4 mb-6">
                {[faUsers, faClock, faCheckCircle].map((icon, i) => (
                    <motion.div
                        key={i}
                        custom={i}
                        variants={cardVariants}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.2 }}
                        className="bg-white shadow-lg rounded-lg p-6 text-center flex items-center gap-4"
                    >
                        <FontAwesomeIcon icon={icon} className="text-4xl text-blue-500 " />
                        <div>
                            <h3 className="text-md font-semibold">
                                {i === 0 ? "Total Payments" : i === 1 ? "Pending Payments" : "Approved Payments"}
                            </h3>
                            <p className="text-gray-700 text-md text-semibold">
                                {i === 0 ? data?.length : i === 1 ? data?.filter((user :any) => user.status.trim() === "Pending").length : data?.filter((user : any)=> user.status === "Approved").length}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

       
            <div className="overflow-auto pl-11 md:pl-0">
                <motion.table className="w-full bg-white shadow-lg rounded-lg text-sm" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                    <thead className="bg-blue-600 text-white text-sm font-semibold">
                        <tr>
                            <th className="p-3 text-left">First Name</th>
                            <th className="p-3 text-left">Middle Name</th>
                            <th className="p-3 text-left">Last Name</th>
                            <th className="p-3 text-left">Payment Method</th>
                            <th className="p-3 text-left">Amount</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Submitted</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((user: any) => (
                            <motion.tr key={user.id} className="border-b hover:bg-gray-100" variants={rowVariants}>
                                <td className="p-3 max-w-[100px] truncate whitespace-nowrap">{user.user.first_name}</td>
                                <td className="p-3 max-w-[100px] truncate whitespace-nowrap">{user.user.middle_name}</td>
                                <td className="p-3 max-w-[100px] truncate whitespace-nowrap">{user.user.last_name}</td>
                                <td className="p-3 whitespace-nowrap">{user.loan.cashout.charAt(0).toUpperCase() + user.loan.cashout.slice(1).toLowerCase()}</td>
                                <td className="p-3 whitespace-nowrap">{formatCurrency(user.amount)}</td>
                                <td className={`p-2 sm:p-3 ${user.status === "Approved"
                                    ? "text-green-600"
                                    : user.status === "Rejected"
                                        ? "text-red-600"
                                        : "text-yellow-600"
                                    } whitespace-nowrap`}>
                                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                </td>
                                <td className="p-3 whitespace-nowrap">{formatDate(user.created_at)}</td>
                                <td className="p-3 text-center whitespace-nowrap">
                                    <button className="text-blue-500 cursor-pointer hover:text-blue-700 p-2" title="View" onClick={() => handleSelect(user.id)}>
                                        <FontAwesomeIcon icon={faEye} size="lg" />
                                    </button>
                                    <button onClick={() => handleSelectId(user.id)} className="text-red-500 cursor-pointer hover:text-red-700 p-2 ml-3" title="Delete">
                                        <FontAwesomeIcon icon={faTrash} size="lg" />
                                    </button>
                                </td>


                            </motion.tr>
                        ))}
                    </tbody>

                </motion.table>
            </div>

            {isModalOpen && selectedId !== null ? (
                <Modal loading={loading} isOpen={isModalOpen} title="Delete Payment" message="Are you sure you want to delete the payment of this user?"
                    onClose={() => setIsModalOpen(false)} onConfirm={handleDelete} />

            ) : (
                null
            )}

            
 


        </div>
    );
};

export default ManagePayments;
