import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLoanData } from "../../services/user/loan";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const rowVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const UsersLoanApplication: React.FC = () => {
  const { data: loanApplications, isLoading, isError } = useQuery({
    queryKey: ["loanApplications"],
    queryFn: () => fetchLoanData("applications"),
  });

  console.log(loanApplications)

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data!</div>;

  const handleDelete = (id: number) => {
    console.log(`Deleting loan application with id: ${id}`);
  };

  const handleView = (id: number) => {
    console.log(`Viewing loan application with id: ${id}`);
  };

  return (
    <div className="p-5 w-auto min-h-screen max-w-4xl mx-auto">
      <motion.h2
        className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent mb-3 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Loan Applications
      </motion.h2>
      <div className="overflow-x-auto pl-16 md:pl-0">
        {loanApplications?.length === 0 ? (
          <div className="text-center text-gray-500">No loan applications found.</div>
        ) : (
          <motion.table
            className="w-full  bg-white shadow-lg rounded-lg text-xs sm:text-sm"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <thead className="bg-blue-600 text-white font-semibold">
              <tr>
                <th className="p-2 sm:p-3 text-left whitespace-nowrap">First Name</th>
                <th className="p-2 sm:p-3 text-left whitespace-nowrap">Middle Name</th>
                <th className="p-2 sm:p-3 text-left whitespace-nowrap">Last Name</th>
                <th className="p-2 sm:p-3 text-left whitespace-nowrap">Loan Type</th>
                <th className="p-2 sm:p-3 text-left whitespace-nowrap">Amount</th>
                <th className="p-2 sm:p-3 text-left whitespace-nowrap">Frequency</th>
                <th className="p-2 sm:p-3 text-left whitespace-nowrap">Duration</th>
                <th className="p-2 sm:p-3 text-left whitespace-nowrap">Interest Rate</th>
                <th className="p-2 sm:p-3 text-left whitespace-nowrap">Status</th>
                
                <th className="p-2 sm:p-3 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loanApplications?.map((loan:any) => (
                <motion.tr
                  key={loan.id}
                  className="border-b hover:bg-gray-100"
                  variants={rowVariants}
                >
                  <td className="p-2 sm:p-3 truncate whitespace-nowrap">{loan.user.first_name}</td>
                  <td className="p-2 sm:p-3 truncate whitespace-nowrap">{loan.user.middle_name}</td>
                  <td className="p-2 sm:p-3 truncate whitespace-nowrap">{loan.user.last_name}</td>
                  <td className="p-2 sm:p-3 whitespace-nowrap">{loan.type.name}</td>
                  <td className="p-2 sm:p-3 whitespace-nowrap">PHP {loan.amount.toLocaleString()}</td>
                  <td className="p-2 sm:p-3 whitespace-nowrap">{loan.plan.payment_frequency}</td>
                  <td className="p-2 sm:p-3 whitespace-nowrap">{loan.plan.repayment_term} months</td>
                  <td className="p-2 sm:p-3 whitespace-nowrap">{loan.plan.interest}%</td>
                  <td className={`p-2 sm:p-3 ${loan.status === "Approved" ? "text-green-600" : "text-yellow-600"} whitespace-nowrap`}>{loan.status}</td>
                  <td className="p-2 sm:p-3 text-center whitespace-nowrap">
                    <div className="relative group inline-block">
                      <button
                        className="text-blue-500 cursor-pointer hover:text-blue-700 p-1 sm:p-2"
                        onClick={() => handleView(loan.id)}
                      >
                        <FontAwesomeIcon icon={faEye} size="lg" />
                      </button>
                      <span className="absolute left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs rounded py-1 px-2 mt-1 whitespace-nowrap">View</span>
                    </div>
                    <div className="relative group inline-block ml-2 sm:ml-3">
                      <button
                        onClick={() => handleDelete(loan.id)}
                        className="text-red-500 cursor-pointer hover:text-red-700 p-1 sm:p-2"
                      >
                        <FontAwesomeIcon icon={faTrash} size="lg" />
                      </button>
                      <span className="absolute left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs rounded py-1 px-2 mt-1 whitespace-nowrap">Delete</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        )}
      </div>
    </div>
  );
};

export default UsersLoanApplication;
