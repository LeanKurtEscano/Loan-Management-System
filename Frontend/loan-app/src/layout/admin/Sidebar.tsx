import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { menuItems } from '../../constants/render';
import { Link } from 'react-router-dom';
import { faBars, faChartLine, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useMyContext } from '../../context/MyContext';
import Modal from '../../components/Modal';
import { logOutAdmin } from '../../services/admin/adminAuth';

  const Sidebar: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const { setIsAuthenticated,toggleLog,setToggleLog,toggle,setToggle, setIsAdminAuthenticated} = useMyContext();
    
    // @ts-ignore
    const [toggleDboard, setToggleDboard] = useState(false);
    // @ts-ignore
    const toggleDash: React.MouseEventHandler<HTMLDivElement> = () => {
        setToggleDboard((prevState) => !prevState);
    };

     const handleLogout = () => {
        logOutAdmin(setIsAdminAuthenticated, setToggleLog, navigate);
      };

    const navigate = useNavigate();


    const toUserProfile = () => {
        navigate('/dashboard/analytics');
        setActiveIndex(10);
    };

    const handleMenuClick = (index: number) => {
        const selectedPath = menuItems[index]?.url;
      
        // If it's NOT index 5, navigate as usual
        if (index !== 5 && selectedPath) {
          navigate(selectedPath);
          localStorage.setItem("currentPath", selectedPath);
          setActiveIndex(index);
        }
      
        // If index is 5, open modal but stay on the same page (skip navigation)
        if (index === 5) {
          setToggleLog(true);
          setActiveIndex(index);
        }
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
                <button onClick={showSideBar} className='w-4'>
                    <FontAwesomeIcon icon={toggle ? faBars : faTimes} className='text-blue-500' />
                </button>
            </div>

            <div
                className={`flex items-center justify-center transition-all duration-300 cursor-pointer ${toggle ? 'opacity-0' : 'opacity-100'}`}
                onClick={toUserProfile}
                style={{ height: '80px', visibility: toggle ? 'hidden' : 'visible' }}
            >
                <div className='flex p-2 rounded-lg flex-col items-center'>
                    <div className='w-full flex flex-row'>
                        <p className=' text-xs'>Hello Admin!</p>
                    </div>
                    <div className='overflow-hidden'>
                        <p className='flex text-gray-700 text-xs whitespace-nowrap'>
                            Loan Management System
                        </p>
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


                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => handleMenuClick(index)}
                        className={`flex flex-row items-center  w-full h-11 p-4 mb-3 transition-all duration-500 rounded-md
            ${activeIndex === index ? 'bg-blue-500 text-white' : 'hover:bg-blue-500 hover:text-white group'}
            ${toggle ? 'w-full h-11 pr-8' : ''}`}
                    >
                        <div className='mr-0'>
                            <Link to={item.url ?? "/"}>
                                <FontAwesomeIcon
                                    icon={item.icon}
                                    className={`transition-colors duration-300 
                  ${activeIndex === index ? 'text-white' : ' text-blue-500 group-hover:text-white'}`}
                                />
                            </Link>
                        </div>

                        <div
                            className={`flex justify-center items-center w-full pr-5 overflow-hidden  
              ${toggle ? 'max-w-0 opacity-0' : 'max-w-full opacity-100'}`}
                        >
                            <p
                                className={`pl-2 duration-500 whitespace-nowrap transition-opacity  // Reduced padding-left
                ${activeIndex === index ? 'text-white' : ' group-hover:text-white'}`}
                            >
                                <Link to={item.url ?? "/"}>{item.text}</Link>
                            </p>
                        </div>
                    </div>
                ))}
            </nav>

            {toggleLog && (
                <Modal
                isOpen={toggleLog}
                title="Confirm Verification"
                message="Are you sure you want to verify this user?"
                onClose={() => setToggleLog(false)}
                onConfirm={handleLogout}
            />
              )}
        </aside>

        

    );
};

export default Sidebar;
