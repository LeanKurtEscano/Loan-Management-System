
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserDetails } from "../../services/user/userData";
import { UserDetails } from "../../constants/interfaces/authInterface";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheckCircle, faTimes, faUser, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import VerifyForm from "./VerifyForm";
import { useNavigate } from "react-router-dom";
const Account = () => {
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
    const goToHome = () => {
        nav('/');
    }

    const [showForm, setShowForm] = useState(false);

    const closeForm = () => {
        setShowForm(false);

    }

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Something went wrong...</p>;

    return (
        <div className="flex flex-col min-h-screen px-8 bg-white text-gray-900">

            <button onClick={goToHome} className="self-start cursor-pointer pl-32 flex items-center text-lg text-gray-600 hover:text-gray-900 transition-all mb-8">
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2 text-2xl" />
                <span className="text-xl cursor-pointer font-semibold">Go Back</span>
            </button>

            <div className="flex items-center justify-center flex-col">
                <h1 className="text-4xl font-bold mb-6 pr-36">Profile</h1>

                {/* User Details */}
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

                {/* Verification Notice */}
                {!data?.is_verified && (
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.2 }}
                        className="container mx-auto px-6 w-1/2 text-center mt-16 bg-blue-600 text-white p-8 rounded-lg flex items-center justify-center gap-4"
                    >

                        {/* Text Content */}
                        <div>
                            <div className="flex-row flex">
                                <h2 className="text-2xl md:text-3xl font-bold mb-4 mr-2">Get Your Account Verified?</h2>

                                {/* Cloud Circle with Check Icon */}
                                <div className="bg-white p-2 h-1/2 rounded-full shadow-lg flex items-center justify-center">
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-blue-600 text-2xl" />
                                </div>

                            </div>


                            <p className="text-lg mb-6">Verify now to access our loan services!</p>
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
                )}

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



{/* 
        
        Here display the username and email(for non verified accounts)
        and if the user is not verified there is a message with an icon  and a heading Verify your account(similar to gcash), add
        any icons that you like that will sync well
        in the json data use the is_verified to conditional render it. if i click the Verify your account there will be a form that will appear default into first name 
        -lastname for now. also i can close it. make it a modern white design and also add animation using framer motion
        
        
        
        */}