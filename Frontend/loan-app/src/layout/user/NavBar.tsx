import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCalendarCheck, 
  faChevronDown, 
  faBars, 
  faUser, 
  faSignOutAlt, 
  faTimes,
  faBell
} from "@fortawesome/free-solid-svg-icons";
import { useMyContext } from "../../context/MyContext";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../../services/user/userAuth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import logo2 from '../../assets/tuloan3.png';
import useUserDetails from "../../hooks/useUserDetails";
import { useQueryClient } from "@tanstack/react-query";

const menuItems = [
    { name: "Transactions", path: "/user/my-transactions" },
    { name: "Apply for Loan", path: "/user/apply-loan" },
    { name: "My Loan", path: "/user/my-loan" },
    //{ name: "Apply for Car Loan", path: "/user/apply-car-loan" },
    //{ name: "My Car Loan", path: "/user/my-car-loan" },
   
];
import NotificationBell from "../../components/NotificationBell";
const NavBar: React.FC = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isAuthenticated, setIsAuthenticated } = useMyContext();
    const [toggleLog, setToggleLog] = useState(false);
    const { userDetails, isLoading, isError, error } = useUserDetails();
    const queryClient = useQueryClient();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    // Added state for notification dropdown
    const [showNotifications, setShowNotifications] = useState(false);
    // Placeholder for notification count - will be replaced with real data in future
    const [notificationCount, setNotificationCount] = useState(2);
    
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleDropdown = () => setShowDropdown(!showDropdown);
    const nav = useNavigate();
    
    const showLogin = () => {
        nav('/login');
        setMobileMenuOpen(false);
    }

    const showAccount = () => {
        nav('/user/account');
        setMobileMenuOpen(false);
    }

    const handleClose = () => {
        setToggleLog(false);
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    const handleLogout = async () => {
        try {
            const response = await logout();
            if (response?.status === 200) {
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("access_token");
                setIsAuthenticated(false);
                setShowDropdown(false);
                setToggleLog(false);
                queryClient.removeQueries(["userDetails"]);
                
                setTimeout(() => {
                    nav('/login');
                }, 200);
            }
        } catch (error: any) {
            console.error("Logout failed:", error);
        }
    };
    
    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
                setMenuOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="border-2 border-gray-200 shadow-lg relative">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="/" className="flex items-center md:pl-[70px] space-x-3 rtl:space-x-reverse">
                    <img src={logo2} className="h-16 md:h-20" alt="Logo" />
                    <span className="self-center text-xl bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent font-bold whitespace-nowrap"></span>
                </a>

                {/* Mobile menu button */}
                <button 
                    type="button" 
                    className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} className="w-6 h-6" />
                </button>

                <div className="flex items-center space-x-4 md:order-2">
                    {isAuthenticated ? (
                        <>
                        <NotificationBell id={userDetails?.id}/>

                            <div className="hidden md:block">
                                {userDetails?.is_verified === "not applied" || userDetails?.is_verified === "pending"  || userDetails?.is_verified === "rejected"? (
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

                    {isAuthenticated ? (
                        <div className="relative" ref={dropdownRef}>
                            <div
                                className="hidden md:flex items-center gap-3 px-4 py-2 bg-white border border-gray-300 rounded-3xl shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
                                onClick={toggleDropdown}
                            >
                                <FontAwesomeIcon icon={faBars} className="text-gray-600 w-3 h-3" />
                                <div className="w-7 h-7 bg-blue-500 text-white flex items-center justify-center rounded-full">
                                   <p className="font-bold">{userDetails?.username?.charAt(0).toUpperCase()}</p> 
                                </div>
                            </div>

                            <AnimatePresence>
                            {showDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg overflow-hidden z-50 border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                                >
                                    <Link to="/user/account"
                                        className="px-4 py-3 text-gray-700 hover:bg-gray-100 flex items-center"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                                        Account
                                    </Link>
                                    <button
                                        className="w-full text-gray-700 cursor-pointer hover:bg-gray-100 flex items-center px-4 py-3"
                                        onClick={() => setToggleLog(true)}
                                    >
                                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                                        Logout
                                    </button>
                                </motion.div>
                            )}
                            </AnimatePresence>
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

                {/* Desktop Navigation Menu - Now centered */}
                <div className="hidden z-50 items-center justify-center w-full md:flex md:w-auto md:order-1 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                    <ul className="flex flex-col text-lg p-4 md:p-0 mt-4 border text-slate-900 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
                        {["Home", "Support", ...(userDetails?.is_verified?.trim() !== "verified" ? [] : ["Menu"])].map((item) => (
                            <li key={item} className="relative">
                                {item === "Menu" ? (
                                    <button
                                        className="flex cursor-pointer select-none items-center gap-1 py-2 px-3 md:p-0 rounded md:bg-transparent font-semibold hover:text-blue-700 transition duration-200"
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
                                        className="block cursor-pointer select-none px-3 md:p-0 rounded md:bg-transparent font-semibold hover:text-blue-700 transition duration-200"
                                    >
                                        {item}
                                    </Link>
                                )}

                                <AnimatePresence>
                                {menuOpen && item === "Menu" && userDetails?.is_verified && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute cursor-default select-none left-0 mt-2 w-56 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-gray-200 z-50 overflow-hidden"
                                    >
                                        {menuItems.map((menuItem, index) => (
                                            <div key={menuItem.path}>
                                                <Link
                                                    to={menuItem.path}
                                                    className="block px-5 py-3 text-gray-700 text-md font-medium hover:bg-gray-100 transition"
                                                    onClick={() => {
                                                        setMenuOpen(false);
                                                    }}
                                                >
                                                    {menuItem.name}
                                                </Link>
                                                {index < menuItems.length - 1 && <hr className="border-gray-200" />}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Mobile Menu (slides from top) */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-50 border-t border-gray-200 overflow-hidden"
                        >
                            <ul className="flex flex-col space-y-1 p-4">
                                {["Home", "Support", "Loans"].map((item) => (
                                    <li key={item}>
                                        <Link
                                            to={item === "Home" ? "/" : item.toLowerCase()}
                                            className="block py-3 px-4 font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                                
                                {/* Verified Menu Items for Mobile */}
                                {userDetails?.is_verified?.trim() === "verified" && (
                                    <li>
                                        <div className="py-2 px-4">
                                            <div className="font-medium text-gray-800 py-2">Menu</div>
                                            <ul className="ml-2 border-l-2 border-gray-200 pl-3 space-y-1">
                                                {menuItems.map((menuItem) => (
                                                    <li key={menuItem.path}>
                                                        <Link
                                                            to={menuItem.path}
                                                            className="block py-2 px-2 text-gray-600 hover:bg-gray-100 rounded"
                                                            onClick={() => setMobileMenuOpen(false)}
                                                        >
                                                            {menuItem.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </li>
                                )}
                                
                                {/* Mobile Notifications */}
                                {isAuthenticated && (
                                    <li>
                                        <Link 
                                            to="/notifications"
                                            className="block py-3 px-4 font-medium text-gray-700 hover:bg-gray-100 rounded-lg flex items-center justify-between"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faBell} className="mr-2" />
                                                Notifications
                                            </div>
                                            {notificationCount > 0 && (
                                                <span className="bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                                    {notificationCount > 9 ? '9+' : notificationCount}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                )}
                               
                                {isAuthenticated ? (
                                    <>
                                        <li>
                                            <Link 
                                                to="/user/account"
                                                className="block py-3 px-4 font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <FontAwesomeIcon icon={faUser} className="mr-2" />
                                                Account
                                            </Link>
                                        </li>
                                        <li>
                                            <button
                                                className="w-full text-left py-3 px-4 font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                                                onClick={() => {
                                                    setToggleLog(true);
                                                    setMobileMenuOpen(false);
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                                                Logout
                                            </button>
                                        </li>
                                        {userDetails?.is_verified === "not applied" || userDetails?.is_verified === "pending" ? (
                                            <li>
                                                <div
                                                    onClick={() => {
                                                        showAccount();
                                                        setMobileMenuOpen(false);
                                                    }}
                                                    className="block py-3 px-4 font-medium text-blue-600 hover:bg-gray-100 rounded-lg border border-blue-200 bg-blue-50 mt-2"
                                                >
                                                    Verify Your Account
                                                </div>
                                            </li>
                                        ) : null}
                                    </>
                                ) : (
                                    <li>
                                        <button
                                            onClick={showLogin}
                                            className="w-full py-3 px-4 text-white bg-blue-500 font-medium rounded-lg hover:bg-blue-600 transition-all"
                                        >
                                            Login
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {toggleLog && (
                <Modal
                    isOpen={toggleLog}
                    title="Confirm Logout"
                    message="Are you sure you want to logout?"
                    onClose={handleClose}
                    onConfirm={handleLogout}
                />
            )}
        </nav>
    );
};

export default NavBar;