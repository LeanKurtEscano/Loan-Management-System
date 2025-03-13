import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserDetails, getUserVerifyDetails } from "../../services/user/userData";
import { UserDetails, VerifiedUserDetails } from "../../constants/interfaces/authInterface";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheckCircle, faTimes, faHourglassHalf, faUser, faEnvelope, faClock } from "@fortawesome/free-solid-svg-icons";
import VerifyForm from "./VerifyForm";
import { useNavigate } from "react-router-dom";

const Account: React.FC = () => {
    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: (delay: number) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut", delay },
        }),
    };

    const nav = useNavigate();
    const { data, isLoading, isError } = useQuery<UserDetails>(
        ["userDetails"],
        getUserDetails
    );



    const goToHome = () => nav('/');

    const [showForm, setShowForm] = useState(false);

    const closeForm = () => setShowForm(false);

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Something went wrong...</p>;

    const renderVerificationStatus = () => {
        switch (data?.is_verified.trim()) {
            case "not applied":
                return (
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.2 }}
                        className="container mx-auto px-6 w-1/2 text-center mt-16 bg-blue-600 text-white p-8 rounded-lg flex items-center justify-center gap-4 shadow-lg"
                    >
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Get Your Account Verified?</h2>
                            <p className="text-lg mb-6">Verify now to access our services!</p>
                            <motion.button
                                onClick={() => setShowForm(true)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white cursor-pointer text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition shadow-md"
                            >
                                Verify
                            </motion.button>
                        </div>
                    </motion.div>
                );

            case "pending":
                return (

                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.2 }}
                        className="container mx-auto px-6 w-1/2 text-center mt-16 bg-yellow-400 text-gray-800 p-8 rounded-lg flex items-center justify-center gap-4 shadow-lg"
                    >
                        <FontAwesomeIcon
                            icon={faHourglassHalf}
                            className="text-gray-800 text-4xl animate-[spin_4s_linear_infinite]"
                        />
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Verification Pending...</h2>
                            <p className="text-lg mt-2 opacity-90">We’re reviewing your submission. Please hold tight!</p>
                            <p className="text-sm mt-4 italic opacity-75">This may take up to 24 hours.</p>
                        </div>
                    </motion.div>
                );

            case "verified":
                return (
                    <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    className="container mx-auto px-6 w-1/2 text-center mt-16 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-8 rounded-lg flex flex-col items-center justify-center gap-2 shadow-xl"
                >
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-1">
                        🎉 Account Verified!
                        <FontAwesomeIcon 
                            icon={faCheckCircle} 
                            className="text-white text-2xl " 
                        />
                    </h2>
                    <p className="text-lg mt-2">You're all set! Enjoy full access to our services.</p>
                </motion.div>
                

                );

            default:
                return null;
        }
    };


    return (
        <div className="flex flex-col min-h-screen px-8 bg-white text-gray-900">
            <button onClick={goToHome} className="self-start cursor-pointer pl-32 flex items-center text-lg text-gray-600 hover:text-gray-900 transition-all mb-8">
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2 text-2xl" />
                <span className="text-xl cursor-pointer font-semibold">Go Back</span>
            </button>

            <div className="flex items-center justify-center flex-col">
                <h1 className="text-4xl font-bold mb-6 pr-36">Profile</h1>

                <div className="flex flex-col gap-4 ">
                    <div className="flex items-center gap-3 text-gray-800 text-2xl font-medium">
                        <FontAwesomeIcon icon={faUser} className="text-blue-500 text-2xl" />
                        <span>{data?.username}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-500 text-lg">
                        <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 text-2xl" />
                        <span>{data?.email}</span>
                    </div>
                </div>

                {renderVerificationStatus()}

                {showForm && (
                    <div className="fixed inset-0 h-auto flex items-center justify-center bg-gray-500/50  bg-opacity-40">
                        <VerifyForm onClose={closeForm} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Account;
