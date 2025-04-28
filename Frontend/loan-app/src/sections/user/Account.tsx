import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserDetails, getUserVerifyDetails } from "../../services/user/userData";
import { UserDetails, VerifiedUserDetails } from "../../constants/interfaces/authInterface";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheckCircle, faTimes, faHourglassHalf, faUser, faEnvelope, faClock, faCheck } from "@fortawesome/free-solid-svg-icons";
import VerifyForm from "./VerifyForm";
import { useNavigate } from "react-router-dom";
import { LoadingAnimation } from "../../components/LoadingAnimation";



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
        ["userAccountDetails"],
        getUserDetails
    );

    const { data: userVerifyDetails, isLoading: isVerifyLoading, isError: isVerifyError } = useQuery<VerifiedUserDetails>(
        ["userVerifyDetails"],
        getUserVerifyDetails,
        {
            enabled: !!data && data.is_verified.trim() === "verified",
        }
    );

   

    const [showForm, setShowForm] = useState(false);

    const closeForm = () => setShowForm(false);

    if (isLoading) return <LoadingAnimation />;
    if (isError) return <p>Something went wrong...</p>;

    const renderVerificationStatus = () => {
        switch (data?.is_verified.trim()) {
            case "not applied":
            case "rejected":
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
                    <>
                        {/* Display User Verified Details */}
                        <motion.div
                            variants={fadeInUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.2 }}
                            className="container mx-auto px-6 w-full sm:w-1/2 mt-8 bg-white shadow-md border border-gray-200 rounded-xl p-6 flex flex-col items-center gap-4"
                        >
                            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-gray-800">
                               
                                Verified User Details
                                <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 text-2xl" />
                            </h2>

                            {/* User Info Section */}
                            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 text-center sm:text-left mt-2">
                                <div>
                                    <p className="text-gray-600 font-medium uppercase tracking-wide text-sm">Full Name</p>
                                    <p className="text-gray-800 text-base font-semibold">{`${userVerifyDetails?.first_name} ${userVerifyDetails?.middle_name} ${userVerifyDetails?.last_name}`}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 font-medium uppercase tracking-wide text-sm">Age</p>
                                    <p className="text-gray-800 text-base font-semibold">{userVerifyDetails?.age}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 font-medium uppercase tracking-wide text-sm">Birthdate</p>
                                    <p className="text-gray-800 text-base font-semibold">{userVerifyDetails?.birthdate}</p>
                                </div>
                               
                                <div>
                                    <p className="text-gray-600 font-medium uppercase tracking-wide text-sm">Gender</p>
                                    <p className="text-gray-800 text-base font-semibold">{userVerifyDetails?.gender}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 font-medium uppercase tracking-wide text-sm">Civil Status</p>
                                    <p className="text-gray-800 text-base font-semibold">{userVerifyDetails?.marital_status}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 font-medium uppercase tracking-wide text-sm">Postal Code</p>
                                    <p className="text-gray-800 text-base font-semibold">{userVerifyDetails?.postal_code}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-gray-600 font-medium uppercase tracking-wide text-sm">Address</p>
                                    <p className="text-gray-800 text-base font-semibold">{userVerifyDetails?.address}</p>
                                </div>
                             
                                
                            </div>
                        </motion.div>

                        {/* Verified Card */}
                        <motion.div
                            variants={fadeInUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.2 }}
                            className="container w-full mx-auto px-6 md:w-1/2 text-center mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-8 rounded-lg flex flex-col items-center justify-center gap-2 shadow-xl"
                        >
                            <h2 className="text-2xl font-bold mb-2 flex items-center gap-1">
                                🎉 Account Verified!
                                <FontAwesomeIcon icon={faCheckCircle} className="text-white text-2xl" />
                            </h2>
                            <p className="text-lg mt-2">You're all set! Enjoy full access to our services.</p>
                        </motion.div>
                    </>
                );

            default:
                return null;
        }
    };


    return (
        <div className="flex flex-col min-h-screen mb-12 mt-4  px-8 bg-white text-gray-900">
            <div className="pl-24">
            <button
                onClick={() => nav('/')}
                className=" md:left-40 cursor-pointer bg-blue-500 text-white font-medium px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center gap-2 active:scale-95"
            >
                <FontAwesomeIcon icon={faArrowLeft} className="text-white" />
                Go Back
            </button>

            </div>
           

            <div className="flex items-center justify-center  flex-col">
                {/* User Info Section */}
                <h1 className="text-4xl font-bold mb-5 pr-20">Profile</h1>
                <div className="flex items-center gap-4 mb-6">

                    <div className="w-12 h-12 bg-blue-500 text-white text-xl font-bold flex items-center justify-center rounded-full shadow-md">
                        {data?.username?.charAt(0).toUpperCase()}
                    </div>


                    {/* User Details */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 text-gray-800 text-2xl font-medium">
                            <FontAwesomeIcon icon={faUser} className="text-blue-500 text-2xl" />
                            <span>{data?.username}</span>
                        </div>

                        <div className="flex items-center gap-3 text-gray-500 text-lg">
                            <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 text-2xl" />
                            <span>{data?.email}</span>
                        </div>
                    </div>
                </div>

                {renderVerificationStatus()}

                {showForm && (
                    <div className="fixed inset-0 h-auto flex items-center justify-center bg-gray-500/50 bg-opacity-40">
                        <VerifyForm onClose={closeForm} />
                    </div>
                )}
            </div>
        </div>


    );
};

export default Account;
