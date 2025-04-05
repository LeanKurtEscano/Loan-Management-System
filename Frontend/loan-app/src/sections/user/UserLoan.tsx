import React, { useState } from "react";
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

const UserLoan = () => {
  const { data, isLoading, isError, error } = useQuery(["userTransactions"], getTransactions);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const nav = useNavigate();

  const toggleActions = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleView = () => {
    nav(`/user/my-transactions/${activeIndex}`);
  };

  return (
    <motion.div
      className="p-5 max-w-5xl mx-auto"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
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
            {data?.map((tx: any, index: number) => (
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
    </motion.div>
  );
};

export default UserLoan;
