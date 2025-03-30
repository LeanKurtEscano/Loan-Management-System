import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "../../services/user/disbursement";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatTime, formatDateWithWords } from "../../utils/formatDate";
import gcash from "../../assets/gcashtext.png";
import maya from "../../assets/mayatext.webp"

const UserLoan = () => {
   const { data, isLoading, isError, error } = useQuery(["userTransactions"], getTransactions);

   console.log(data)
  
  
  
  return (
    <div className="p-5 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <input
          type="date"
          className="border p-2 rounded-lg text-sm"
          defaultValue="2022-04-27"
        />
        <button className="flex items-center bg-gray-200 px-3 py-2 rounded-lg text-sm">
          <FontAwesomeIcon icon={faFilter} className="mr-2" /> Filters
        </button>
      </div>
      <div className="overflow-auto">
        <table className="w-full bg-white shadow-md rounded-lg text-sm">
          <thead className="bg-gray-100">
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
            {data?.map((tx:any, index:any) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-3">{formatDateWithWords(tx.created_at)} <br /> <span className="text-xs text-gray-500">{formatTime(tx.created_at)}</span></td>
                <td className="p-3">{formatCurrency(tx.amount)}</td>
                <td
                  className={`p-3 font-semibold ${
                    tx.status === "Declined" ? "text-red-600" :
                    tx.status === "Pending" ? "text-yellow-600" :
                    "text-blue-600"
                  }`}
                >
                  {tx.status}
                </td>
                  <td className="p-3">{tx.period}</td>
                  <td className="p-3">{tx.loan.frequency}</td>
                
                  <td className="p-3 flex  items-center">
                   {" "}
                  {tx.loan.cashout === "gcash" && <img src={gcash} alt="Gcash" className="w-28 h-15 " />}
                  {tx.loan.cashout === "maya" && <img src={maya} alt="Maya" className="w-27 h-9 " />}
                </td>
                  
               
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserLoan;
