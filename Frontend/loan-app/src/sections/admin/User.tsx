import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchUserData } from '../../services/user/loan';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
const User = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserData("user", id ?? ""),
  });

  const handleRowClick = (applicationId) => {
    navigate(`/dashboard/verify/application/${applicationId}`);
  };

  console.log(user);

  const handleViewDisbursement = (e, submissionId) => {
    e.stopPropagation();
    navigate(`/dashboard/submission/approve/${submissionId}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: i => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: i * 0.05,
        duration: 0.3
      }
    })
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center bg-gray-50"
      >
        <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md max-w-md w-full mx-4">
          <motion.h2 
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }}
            className="text-red-500 text-xl font-bold mb-4"
          >
            Error loading user data
          </motion.h2>
          <p className="text-gray-600">Unable to fetch user information. Please try again later.</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Go Back
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const isVerified = user?.is_verified === "verified";
  
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-50 py-4 sm:py-8 px-3 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.div 
          variants={itemVariants}
          className="mb-4"
        >
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoBack}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Go Back
          </motion.button>
        </motion.div>
      
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-lg shadow-md overflow-hidden mb-6"
        >
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-3 sm:space-y-0">
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-white flex items-center justify-center text-xl sm:text-2xl font-bold text-indigo-600"
              >
                {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
              </motion.div>
              <div className="text-center sm:text-left">
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl sm:text-2xl font-bold text-white"
                >
                  {user?.first_name} {user?.middle_name} {user?.last_name}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-blue-100 break-all"
                >
                  {user?.email}
                </motion.p>
                {

                  user.is_good_payer && (
                    <span className="inline-flex items-center  px-2  py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    <FontAwesomeIcon icon={faStar} className="mr-1 text-yellow-500" />
                    Good Payer
                </span>

                  )
                }
               
              </div>
            </div>
          </div>
          
         
          <div className="p-4 sm:p-6">
            <motion.h2 
              variants={itemVariants}
              className="text-lg sm:text-xl font-semibold text-gray-800 mb-4"
            >
              Personal Details
            </motion.h2>
            <div className="grid sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
              {[
                { label: "Username", value: user?.username || 'N/A' },
                { label: "Contact Number", value: user?.contact_number || 'N/A' },
                { label: "Address", value: user?.address || user?.verification_request?.address || 'N/A' },
                { 
                  label: "Verification Status", 
                  value: isVerified ? 'Verified' : 'Not Verified',
                  isStatus: true,
                  statusClass: isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                },
                ...(user?.verification_request ? [
                  { label: "Age", value: user.verification_request.age || 'N/A' },
                  { label: "Gender", value: user.verification_request.gender || 'N/A' },
                  { label: "Date of Birth", value: user.verification_request.birthdate || 'N/A' },
                  { label: "Marital Status", value: user.verification_request.marital_status || 'N/A' }
                ] : [])
              ].map((item, index) => (
                <motion.div 
                  key={item.label}
                  variants={itemVariants}
                  custom={index}
                >
                  <p className="text-sm font-medium text-gray-500">{item.label}</p>
                  {item.isStatus ? (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.statusClass}`}>
                      {item.value}
                    </span>
                  ) : (
                    <p className="text-gray-800 break-words">{item.value}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

       
        {!isVerified ? (
          <motion.div 
            variants={itemVariants}
            className="bg-yellow-50 border-l-4 border-yellow-400 p-4 sm:p-6 rounded-lg shadow-sm mb-6"
          >
            <div className="flex flex-col sm:flex-row">
              <div className="flex-shrink-0 mb-2 sm:mb-0">
                <motion.svg 
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="h-5 w-5 text-yellow-400" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 102 0V6zm-1 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </motion.svg>
              </div>
              <div className="sm:ml-3">
                <h3 className="text-lg font-medium text-yellow-800">User Not Verified</h3>
                <div className="mt-2 text-yellow-700">
                  <p>
                    This user has not been verified yet. Loan applications and other features will be available after verification.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-4 sm:p-6">
              <motion.h2 
                variants={itemVariants}
                className="text-lg sm:text-xl font-semibold text-gray-800 mb-4"
              >
                Loan Applications
              </motion.h2>
              
              {user?.loan_applications?.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="overflow-x-auto -mx-4 sm:mx-0"
                >
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Purpose</th>
                          <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disbursement</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {user.loan_applications.map((application, i) => (
                          <tr 
                            key={application.id}
                            onClick={() => handleRowClick(application.id)}
                            className="cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-3 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                              {new Date(application.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                              ₱{parseFloat(application.loan_amount || 0).toLocaleString()}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                application.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                application.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                application.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {application.status}
                              </span>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden sm:table-cell">
                              {application.purpose || 'N/A'}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                              {application.loan_submissions?.length > 0 ? (
                                <div className="flex flex-col space-y-2">
                                  {application.loan_submissions.map(submission => (
                                    <div key={submission.id} className="flex items-center space-x-2">
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={(e) => handleViewDisbursement(e, submission.id)}
                                        className="inline-flex cursor-pointer items-center px-2 py-1 sm:px-3 sm:py-1.5 border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 rounded text-xs sm:text-sm font-medium transition-colors"
                                      >
                                        View
                                      </motion.button>
                                      
                                      {submission.is_fully_paid && (
                                        <motion.span 
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          transition={{ type: "spring", damping: 12 }}
                                          className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                        >
                                          <svg className="w-2 h-2 mr-1 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                          <span className="hidden sm:inline">Fully Paid</span>
                                          <span className="sm:hidden">Paid</span>
                                        </motion.span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                'None'
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  variants={itemVariants}
                  className="text-center py-6 sm:py-8"
                >
                  <motion.svg 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 8 }}
                    className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </motion.svg>
                  <motion.h3 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-2 text-sm font-medium text-gray-900"
                  >
                    No loan applications
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-1 text-sm text-gray-500"
                  >
                    The user hasn't submitted any loan applications yet.
                  </motion.p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default User;


{/* <div className='pl-3 w-full'>
                    <p className={`text-gray-700 text-[14px] mb-1 ${toggle ? 'opacity-0' : 'opacity-100'}`}> Insight</p>
                </div>
                 <div className='pl-3 w-full'>
                    <p className={`text-gray-700 text-[14px] mb-1 ${toggle ? 'opacity-0' : 'opacity-100'}`}> Operations</p>
                </div>  */}