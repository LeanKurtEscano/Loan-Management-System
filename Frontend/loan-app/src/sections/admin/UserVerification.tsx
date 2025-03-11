import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash, faUsers, faClock, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { ApplicationData } from "../../constants/interfaces/adminInterface";
import { useQuery } from "@tanstack/react-query";
import { getUserDetails } from "../../services/admin/adminData";
import { useNavigate } from "react-router-dom";
interface User {
    id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    birth_date: string;
    age: number;
    status: "Pending" | "Approved";
    submitted_date: string;
}



const cardVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i: number) => ({ opacity: 1, x: 0, transition: { delay: i * 0.2 } }),
};

const rowVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const formatDate = (dateString:any) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
};

const UserVerification: React.FC = () => {
    const navigate = useNavigate();
 
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const {data, isLoading, isError,error} = useQuery<ApplicationData[]>(['verifyData'],getUserDetails);

    console.log(data);

    const handleSelect = (id: number) => {
        navigate(`/dashboard/verify/${id}`);
        console.log("Selected User ID:", id);
    };

    const handleDelete = (id: number) => {
       
    };

    return (
        <div className="p-5 w-auto min-h-screen max-w-4xl mx-auto">
      
            <motion.h2
            className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent mb-3 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            User Verification Portal
        </motion.h2>
            <p className="text-gray-700 text-center mb-5">
            </p>


            <div className="grid grid-cols-1  md:grid-cols-3 gap-4 mb-6">
                {[faUsers, faClock, faCheckCircle].map((icon, i) => (
                    <motion.div
                        key={i}
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-white shadow-lg rounded-lg p-4 flex items-center w-full max-w-xs mx-auto sm:mx-0"
                    >
                        <FontAwesomeIcon icon={icon} className="text-2xl text-blue-500 mr-3" />
                        <div>
                            <h3 className="text-sm font-semibold">
                                {i === 0 ? "Total Applications" : i === 1 ? "Pending Applications" : "Approved Applications"}
                            </h3>
                            <p className="text-gray-700 text-base">
                                {i === 0 ? data?.length : i === 1 ? data?.filter(user => user.status.trim() === "pending").length : data?.filter(user => user.status === "Approved").length}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Table */}
            <div className="overflow-auto pl-11 md:pl-0">
                <motion.table className="w-full bg-white shadow-lg rounded-lg text-sm" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                    <thead className="bg-blue-600 text-white text-sm font-semibold">
                        <tr>
                            <th className="p-3 text-left">First Name</th>
                            <th className="p-3 text-left">Middle Name</th>
                            <th className="p-3 text-left">Last Name</th>
                            <th className="p-3 text-left">Birthdate</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Submitted</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((user) => (
                            <motion.tr key={user.id} className="border-b hover:bg-gray-100" variants={rowVariants}>
                                <td className="p-3 max-w-[100px] truncate whitespace-nowrap">{user.first_name}</td>
                                <td className="p-3 max-w-[100px] truncate whitespace-nowrap">{user.middle_name}</td>
                                <td className="p-3 max-w-[100px] truncate whitespace-nowrap">{user.last_name}</td>
                                <td className="p-3 whitespace-nowrap">{user.birthdate}</td>
                                <td className={`p-3 font-medium ${user.status === "Approved" ? "text-green-600" : "text-yellow-600"}`}>
                                    {user.status}
                                </td>
                                <td className="p-3 whitespace-nowrap">{formatDate(user.created_at)}</td>
                                <td className="p-3 text-center whitespace-nowrap">
                                    <button className="text-blue-500 cursor-pointer hover:text-blue-700 p-2" title="View" onClick={() => handleSelect(user.id)}>
                                        <FontAwesomeIcon icon={faEye} size="lg" />
                                    </button>
                                    <button className="text-red-500 cursor-pointer hover:text-red-700 p-2 ml-3" title="Delete" onClick={() => handleDelete(user.id)}>
                                        <FontAwesomeIcon icon={faTrash} size="lg" />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>

                </motion.table>
            </div>
        </div>
    );
};

export default UserVerification;
