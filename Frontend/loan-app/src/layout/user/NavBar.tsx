import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCalendarCheck, faChevronDown, faBars, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useMyContext } from "../../context/MyContext";
import { motion } from "framer-motion";
import { logout } from "../../services/user/userAuth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useTokenHandler from "../../hooks/useTokenHandler";
import { UserDetails } from "../../constants/interfaces/authInterface";
import logo2 from '../../assets/logo2.png'
import useUserDetails from "../../hooks/useUserDetails";
import { navMenuItems } from "../../constants/render";
import { useQueryClient } from "@tanstack/react-query";
const menuItems = [
    { name: "Transactions", path: "/my-transactions" },
    { name: "My Loans", path: "/my-Loans" },
    { name: "Apply for Loan", path: "/apply-loan" },
];
const NavBar: React.FC = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { isAuthenticated, setIsAuthenticated,setUserDetails } = useMyContext();
    const {userDetails, isLoading, isError, error} = useUserDetails();
    const queryClient = useQueryClient();

    const [menuOpen, setMenuOpen] = useState(false);
    const toggleDropdown = () => setShowDropdown(!showDropdown);
    const nav = useNavigate();
    const showLogin = () => {
        nav('/login');
    }

    const showAccount = () => {
        nav('/account');
    }



    const goToLanding = () => {
        nav('/landing-vet')
    }



    const handleLogout = async () => {
        try {
            const response = await logout();
            if (response?.status === 200) {
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("access_token");
                setIsAuthenticated(false);
                setShowDropdown(false);

                // Ensure user details reset fully
                setUserDetails((prev: UserDetails) => ({
                    ...prev,
                    is_verified:"not applied".trim(),
                }));

                queryClient.invalidateQueries(["userDetails"]);

                // Wait for state to apply, then navigate
                
        setTimeout(() => {
            nav('/login');  
        }, 200); 
        
            }

        } catch (error: any) {

        }


    }

    return (
        <nav className="bg-customWhite">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="/" className="flex items-center md:pl-[70px] space-x-3 rtl:space-x-reverse">
                    <img src={logo2} className="h-10" alt=" Logo" />
                    <span className="self-center text-xl bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent font-bold whitespace-nowrap"></span>
                </a>

                <div className="flex items-center space-x-4 md:order-2 pr-12">
                    {/* 
                           {isAuthenticated ? (
                        <>

                            <div className="w-10 h-10 rounded-full cursor-pointer flex justify-center items-center hover:bg-orange-500 transition duration-200 hover:text-white">
                                <FontAwesomeIcon icon={faBell} className="w-6 h-6" />
                            </div>
                        
                            <div className="hidden md:block">
                                {details.is_veterinarian ? (

                                    <div
                                        onClick={changeUserRole}
                                        className="font-medium rounded-lg hover:bg-gray-200 text-sm px-4 py-2 text-center transition-all duration-300 ease-in-out cursor-pointer"
                                    >
                                        {role === "User" ? "Switch to Veterinarian" : "Switch to Pet Owner"}
                                    </div>
                                ) : (
                                    <>

                                        <div
                                            onClick={goToLanding}
                                            className="font-medium rounded-lg hover:bg-gray-200 text-sm px-4 py-2 text-center transition-all duration-300 ease-in-out cursor-pointer"
                                        >
                                            Vet Your Clinic
                                        </div>
                                    </>
                                )}
                            </div>

                        </>
                    ) : null}


                            
                            
                            
                            
                            
                            */}


                    {isAuthenticated ? (
                        <>
                            <div className="hidden md:block">
                                {userDetails?.is_verified == "not applied" || userDetails?.is_verified == "pending" ? (
                                    <div
                                        onClick={showAccount}
                                        className="font-medium rounded-lg hover:bg-gray-200 text-sm px-4 py-2 text-center transition-all duration-300 ease-in-out cursor-pointer"
                                    >
                                        Verify Your Account
                                    </div>
                                ) : null}
                            </div>
                        </>
                    ) : null}


                    <div className="md:hidden">
                        <button className="p-2 rounded-full hover:bg-gray-200 transition duration-200">
                            <FontAwesomeIcon icon={faCalendarCheck} className="w-6 h-6" />
                        </button>
                    </div>


                    {isAuthenticated ? (
                        <div className="relative">
                            <div
                                className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-300 rounded-3xl shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
                                onClick={toggleDropdown}
                            >

                                <FontAwesomeIcon icon={faBars} className="text-gray-600 w-3 h-3" />


                                <div className="w-7 h-7 bg-blue-500 text-white flex items-center justify-center rounded-full">
                                    <FontAwesomeIcon icon={faUser} className="w-3 h-3" />
                                </div>
                            </div>

                            {showDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg overflow-hidden z-50 border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                                >
                                    <Link to="/account"

                                        className=" px-4 py-3 text-gray-700 hover:bg-gray-100 flex items-center"
                                    >
                                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                                        Account
                                    </Link>
                                    <button
                                        className="w-full text-gray-700 cursor-pointer hover:bg-gray-100 flex items-center px-4 py-3"
                                        onClick={handleLogout}
                                    >
                                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                                        Logout
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={showLogin}
                            className="text-white border-2 cursor-pointer border-blue-500 bg-blue-500 font-medium rounded-lg text-sm hidden md:block px-4 py-2 text-center transition-all duration-300 ease-in-out hover:bg-blue-700"
                        >
                            Login
                        </button>
                    )}


                </div>

                <div className="pl-40 items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border text-slate-900 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
                        {["Home", "Support", "Loans", ...(userDetails?.is_verified.trim() !== "verified" ? [] : ["Menu"])].map((item) => (
                            <li key={item} className="relative">
                                {item === "Menu" ? (
                                    <button
                                        className="flex cursor-pointer items-center gap-1 py-2 px-3 md:p-0 rounded md:bg-transparent font-semibold hover:text-blue-700 transition duration-200"
                                        onClick={() => setMenuOpen(!menuOpen)}
                                    >
                                        {item}
                                        <FontAwesomeIcon
                                            icon={faChevronDown}
                                            className={`transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                ) : (
                                    <Link
                                        to={item === "Home" ? "/" : item.toLowerCase()}
                                        className="block py-2 px-3 md:p-0 rounded md:bg-transparent font-semibold hover:text-blue-700 transition duration-200"
                                    >
                                        {item}
                                    </Link>
                                )}

                                {menuOpen && item === "Menu" && userDetails?.is_verified && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-gray-200 z-50 overflow-hidden"
                                    >
                                        {menuItems.map((menuItem, index) => (
                                            <div key={menuItem.path}>
                                                <Link
                                                    to={menuItem.path}
                                                    className="block px-5 py-3 text-gray-700 text-sm font-medium hover:bg-gray-100 transition"
                                                >
                                                    {menuItem.name}
                                                </Link>
                                                {index < menuItems.length - 1 && <hr className="border-gray-200" />}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </li>
                        ))}
                    </ul>

                </div>

            </div>
        </nav>
    );
};

export default NavBar;
