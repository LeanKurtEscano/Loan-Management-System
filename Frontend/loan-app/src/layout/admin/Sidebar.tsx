import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { menuItems } from '../../constants/render';
import { Link } from 'react-router-dom';
import { faBars, faChartLine, faSignOutAlt, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useMyContext } from '../../context/MyContext';
import Modal from '../../components/Modal';
import { logOutAdmin } from '../../services/admin/adminAuth';
import useAdminDetails from '../../hooks/useAdminDetails';
import AdminNotificationBell from '../../components/admin/AdminNotificationBell';
import { useQuery } from '@tanstack/react-query';

import { UserDetails } from '../../constants/interfaces/authInterface';

import { getAdminDetails } from '../../services/admin/adminData';
const Sidebar: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const { setIsAuthenticated, toggleLog, setToggleLog, toggle, setToggle, setIsAdminAuthenticated } = useMyContext();
    
   
       const { data, isLoading, isError, error } = useQuery<UserDetails>(['adminDetails'], getAdminDetails,{
       });
   
    
    // @ts-ignore
    const [toggleDboard, setToggleDboard] = useState(false);
    // @ts-ignore
    const toggleDash: React.MouseEventHandler<HTMLDivElement> = () => {
        setToggleDboard((prevState) => !prevState);
    };

    const handleLogout = (index: number) => {
        setToggleLog(true);
        setActiveIndex(index);
    };

    const navigate = useNavigate();

    const toUserProfile = () => {
        navigate('/dashboard/analytics');
        setActiveIndex(10);
    };

    const handleMenuClick = (index: number) => {
        const selectedPath = menuItems[index]?.url;
        setActiveIndex(index);

        // If it's NOT index 5, navigate as usual
        if (index !== 5 && selectedPath) {
            navigate(selectedPath);
            localStorage.setItem("currentPath", selectedPath);
            setActiveIndex(index);
        }
    };

    const adminLogout = async () => {
        try {
            const response = await logOutAdmin();

            if (response?.status === 200) {
                navigate('/admin-login');
                setIsAdminAuthenticated(false);
                setToggleLog(false);
            }
        } catch (error) {
            alert("Something Went Wrong")
        }
    }

    const handleClose = () => {
        setToggleLog(false);
        setActiveIndex(null);
    };

    const showSideBar = () => {
        setToggle(!toggle);
    };

    return (
        <aside
            className={`fixed top-0 left-0 h-full transition-all bg-white duration-700 z-50 bg-cardbg shadow-xl
    ${toggle ? 'w-16' : 'w-64'}`}
        >
            <div className='flex justify-center align-center absolute pl-3 pt-4'>
                <button onClick={showSideBar} className='w-4 cursor-pointer'>
                    <FontAwesomeIcon icon={toggle ? faBars : faTimes} className='text-blue-500' />
                </button>
            </div>

            {/* Improved Admin Profile Section with better transitions */}
            <div className="pt-12 px-2 mb-2">
                <div 
                    className="cursor-pointer relative"
                    onClick={toUserProfile}
                >
                    <div className="bg-blue-50 rounded-lg border border-blue-100 shadow-sm p-2 flex items-center">
                        <div className="bg-blue-500 rounded-full h-8 w-8 min-w-8 flex items-center justify-center text-white">
                            <FontAwesomeIcon icon={faUser} className="text-xs" />
                        </div>
                        <div className={`absolute left-12 transition-opacity duration-700 ${toggle ? 'opacity-0 invisible' : 'opacity-100 visible'}`}>
                            <p className="font-medium text-xs text-blue-800 whitespace-nowrap">Hello Admin!</p>
                            <p className="text-xs text-gray-600 whitespace-nowrap">Loan Management System</p>
                        </div>
                        {/* AdminNotificationBell positioned in the top right of the profile section */}
                        {/* AdminNotificationBell positioned on the right side */}
                        <div className={`ml-auto pr-2 transition-opacity duration-700 ${toggle ? 'opacity-0 invisible' : 'opacity-100 visible'}`}>
                            <AdminNotificationBell id={data?.id}  />
                        </div>
                    </div>
                </div>
            </div>
            <nav className='h-auto flex flex-col justify-center p-4 items-center pb-20'>

                <div className='pl-3 w-full'>
                    <p className={`text-gray-700 text-[14px] mb-1 ${toggle ? 'opacity-0' : 'opacity-100'}`}> Insight</p>
                </div>

                <div
                    onClick={() => handleMenuClick(10)}
                    className={`flex flex-row items-center w-full h-11 p-4 mb-3 transition-all duration-500 rounded-md
          ${activeIndex === 10 ? 'bg-blue-500 text-white' : 'hover:bg-blue-500 hover:text-white group'}
          ${toggle ? 'w-full h-11 pr-8' : ''}`}
                >
                    <div className='mr-0'>
                        <Link to={'/dashboard/analytics'}>
                            <FontAwesomeIcon
                                icon={faChartLine}
                                className={`transition-colors duration-300
                ${activeIndex === 10 ? 'text-white' : 'text-blue-500 group-hover:text-white'}`}
                            />
                        </Link>
                    </div>

                    <div
                        className={`flex justify-center items-center w-full pr-5 overflow-hidden  
            ${toggle ? 'max-w-0 opacity-0' : 'max-w-full opacity-100'}`}
                    >
                        <p
                            className={`pl-2 duration-500 whitespace-nowrap transition-opacity  // Reduced padding-left
              ${activeIndex === 10 ? 'text-white' : ' group-hover:text-white'}`}
                        >
                            <Link to={'/dashboard/analytics'}>Dashboard</Link>
                        </p>
                    </div>
                </div>


                <div className='pl-3 w-full'>
                    <p className={`text-gray-700 text-[14px] mb-1 ${toggle ? 'opacity-0' : 'opacity-100'}`}> Operations</p>
                </div>


                {
                    menuItems.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => (index === 5 ? handleLogout(index) : handleMenuClick(index))}
                            className={`flex flex-row cursor-pointer items-center w-full h-11 p-4 mb-3 transition-all duration-500 rounded-md
            ${activeIndex === index ? 'bg-blue-500 text-white' : 'hover:bg-blue-500 hover:text-white group'}
            ${toggle ? 'w-full h-11 pr-8' : ''}`}
                        >
                            <div className='mr-0'>
                                {index !== 5 ? (
                                    <Link to={item.url ?? "/"}>
                                        <FontAwesomeIcon
                                            icon={item.icon}
                                            className={`transition-colors duration-300 
                  ${activeIndex === index ? '' : ' text-blue-500 group-hover:text-white'}`}
                                        />
                                    </Link>
                                ) : (
                                    <FontAwesomeIcon
                                        icon={faSignOutAlt}
                                        className="pl-1 text-blue-500 group-hover:text-white"
                                    />
                                )}
                            </div>

                            <div
                                className={`flex justify-center items-center w-full pr-5 overflow-hidden  
              ${toggle ? 'max-w-0 opacity-0' : 'max-w-full opacity-100'}`}
                            >
                                <p
                                    className={`pl-2 duration-500 whitespace-nowrap transition-opacity
                ${activeIndex === index ? 'text-white' : ' group-hover:text-white'}`}
                                >
                                    {index !== 5 ? (
                                        <Link to={item.url ?? "/"}>{item.text}</Link>
                                    ) : (
                                        <span className="cursor-pointer">Logout</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    ))
                }
            </nav>

            {toggleLog && (
                <Modal
                    isOpen={toggleLog}
                    title="Confirm Logout"
                    message="Are you sure you want to logout?"
                    onClose={handleClose}
                    onConfirm={adminLogout}
                />
            )}
        </aside>
    );
};

export default Sidebar;