import React, { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchLoanData } from "../../services/user/loan";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEye, faClipboardList, faCheckCircle, faClock } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { loanApi } from "../../services/axiosConfig";
import Modal from "../../components/Modal";
import { formatDate } from "../../utils/formatDate";
const rowVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const cardIcons = [faClipboardList, faCheckCircle, faClock];

const UsersLoanApplication: React.FC = () => {

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await loanApi.post('/remove/', {
        id: id
      });

    },

    onSuccess: () => {
      queryClient.invalidateQueries(['loanApplications']);
    }
  })




  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: loanApplications, isLoading, isError } = useQuery({
    queryKey: ["loanApplications"],
    queryFn: () => fetchLoanData("applications"),
  });
  const nav = useNavigate();

  const queryClient = useQueryClient();

  console.log(loanApplications);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data!</div>;




  const handleDelete = async () => {
    setSelectedId(null);
    await deleteMutation.mutateAsync(selectedId ?? 0);
    setIsModalOpen(false);
  };

  const selectDelete = (id: number) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };


  const handleView = (id: number) => {
    nav(`/dashboard/verify/application/${id}`);
  };

  return (
    <div className="p-5 w-auto min-h-screen max-w-6xl mx-auto">
      <motion.h2
        className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent mb-3 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Loan Applications
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-5">
        {['Total Applications', 'Pending Applications', 'Approved Applications'].map((title, index) => (
          <motion.div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 text-center flex items-center gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <FontAwesomeIcon icon={cardIcons[index]} className="text-blue-500 text-4xl" />
            <div className="">
              <h3 className="text-md font-semibold">{title}</h3>
              <p className="text-md font-semibold ">
                {title === 'Total Applications' ? loanApplications?.length || 0 :
                  title === 'Approved Applications' ? loanApplications?.filter((app: any) => app.status === 'Approved').length || 0 :
                    loanApplications?.filter((app: any) => app.status === 'Pending').length || 0}
              </p>
            </div>
          </motion.div>
        ))}
      </div>



      <div className="overflow-x-auto pl-16 md:pl-0">
        {loanApplications?.length === 0 ? (
          <div className="text-center text-gray-500">No loan applications found.</div>
        ) : (
          <motion.table
            className="w-full bg-white shadow-lg rounded-lg text-xs sm:text-sm"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <thead className="bg-blue-600 text-white font-semibold">
              <tr>
                <th className="p-2 sm:p-3 text-left whitespace-nowrap">First Name</th>
                <th className="p-2 sm:p-3 text-left whitespace-nowrap">Middle Name</th>
                <th className="p-2 sm:p-3 text-left whitespace-nowrap">Last Name</th>
               
               
                <th className="p-2 sm:p-3 text-left whitespace-nowrap">Status</th>
                <th className="p-2 sm:p-3 text-left whitespace-nowrap">Send Date</th>
                <th className="p-2 sm:p-3 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loanApplications?.map((loan: any) => (
                <motion.tr
                  key={loan.id}
                  className="border-b hover:bg-gray-100"
                  variants={rowVariants}
                >
                  <td className="p-2 sm:p-3 truncate whitespace-nowrap">{loan.user.first_name}</td>
                  <td className="p-2 sm:p-3 truncate whitespace-nowrap">{loan.user.middle_name}</td>
                  <td className="p-2 sm:p-3 truncate whitespace-nowrap">{loan.user.last_name}</td>
                
                 
                  <td
                    className={`p-2 sm:p-3 ${loan.status === "Approved"
                        ? "text-green-600"
                        : loan.status === "Rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      } whitespace-nowrap`}
                  >
                    {loan.status}
                  </td>
                  <td className="p-2 sm:p-3 truncate whitespace-nowrap">{formatDate(loan.created_at)}</td>

                  <td className="p-2 sm:p-3 text-center whitespace-nowrap">
                    <button
                      className="text-blue-500 cursor-pointer hover:text-blue-700 p-1 sm:p-2"
                      onClick={() => handleView(loan.id)}
                    >
                      <FontAwesomeIcon icon={faEye} size="lg" />
                    </button>
                    <button
                      onClick={() => selectDelete(loan.id)}
                      className="text-red-500 cursor-pointer hover:text-red-700 p-1 sm:p-2 ml-2"
                    >
                      <FontAwesomeIcon icon={faTrash} size="lg" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>


    

            {isModalOpen && selectedId !== null ? (
              <Modal loading={loading} isOpen={isModalOpen} title="Delete this Loan Application?" message="Are you sure you want to Delete the loan application of this user?"
                onClose={() => setIsModalOpen(false)} onConfirm={handleDelete} />

            ) : (
              null
            )}
          </motion.table>



        )}
      </div>
    </div>
  );
};

export default UsersLoanApplication;
