import React from 'react';
import { useParams } from 'react-router-dom';
import { getNotification } from '../../services/notification';
import { useQuery } from '@tanstack/react-query';
import { 
  CheckCircle, XCircle, AlertCircle, Mail, 
  ArrowLeft, ArrowRight, RefreshCw, Clock, Calendar, Hash
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { userApi } from '../../services/axiosConfig';
// Animation variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

const cardVariants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

const staggerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const NotificationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const handleGoBack = () => {
    navigate('/notifications');
  };

  const verifyAgain = () => {
    navigate('/user/account');
  }

  const navSupport = () => {
    navigate('/support');
  }
  

  
  
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["userNotificationDetails", id],
    queryFn: () => getNotification(id),
    enabled: !!id,
  });


  // Handle loading state
  if (isLoading) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-6"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <div className="w-full max-w-5xl p-8 bg-white rounded-xl shadow-xl">
          <button 
            onClick={handleGoBack}
            className="mb-6 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </button>
          <div className="flex flex-col items-center py-16">
            <motion.div 
              className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            ></motion.div>
            <h2 className="text-2xl font-semibold text-gray-700">Loading notification details...</h2>
          </div>
        </div>
      </motion.div>
    );
  }
  
  // Handle error or non-existent notification
  if (isError || !data) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-6"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <div className="w-full max-w-5xl p-8 bg-white rounded-xl shadow-xl border-l-6 border-blue-700">
          <button 
            onClick={handleGoBack}
            className="mb-6 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </button>
          <div className="flex flex-col items-center py-16">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <AlertCircle size={64} className="text-blue-700 mb-6" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Notification Not Found</h2>
            <p className="text-xl text-gray-600 text-center max-w-lg">The notification you're looking for doesn't exist or has been removed.</p>
            <motion.button 
              onClick={() => refetch()}
              className="mt-8 inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Try Again
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }
  
  // Format date
  const formattedDate = new Date(data.created_at).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
  
  // Check if the message contains verification word for rejected status
  const containsVerification = data.status === "Rejected" && 
    data.message.toLowerCase().includes("verification");
  
  // Gmail link
  const gmailLink = `https://mail.google.com/mail/u/${data.email}`;
  
  // Determine status colors and icons
  const statusConfig = {
    Approved: {
      bgColor: "bg-blue-500",
      textColor: "text-blue-800",
      lightBg: "bg-blue-50",
      borderColor: "border-blue-500",
      icon: <CheckCircle className="h-8 w-8 text-blue-500" />
    },
    Rejected: {
      bgColor: "bg-blue-700",
      textColor: "text-blue-800",
      lightBg: "bg-blue-100",
      borderColor: "border-blue-700",
      icon: <XCircle className="h-8 w-8 text-blue-700" />
    },
    Pending: {
      bgColor: "bg-blue-300",
      textColor: "text-blue-600",
      lightBg: "bg-blue-50",
      borderColor: "border-blue-300",
      icon: <Clock className="h-8 w-8 text-blue-300" />
    }
  };
  
  const statusInfo = statusConfig[data.status] || statusConfig.Pending;

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6 md:p-8"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <div className="max-w-7xl mx-auto">
        {/* Top navigation */}
        <motion.div 
          className="flex justify-between items-center mb-8"
          variants={cardVariants}
        >
          <motion.button 
            onClick={handleGoBack}
            className="inline-flex cursor-pointer items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Notifications
          </motion.button>
          
          <motion.button
            onClick={() => refetch()}
            className="inline-flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </motion.button>
        </motion.div>
        
        {/* Main content */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          variants={cardVariants}
        >
          {/* Status banner */}
          <motion.div 
            className={`${statusInfo.bgColor} py-4 px-8 text-white flex items-center justify-between`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center">
              <motion.div
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {statusInfo.icon}
              </motion.div>
              <h1 className="text-2xl font-bold ml-3">Disbursement {data.status}</h1>
            </div>
            <motion.span 
              className={`px-4 py-2 rounded-full text-base font-medium ${statusInfo.bgColor} bg-white/20 text-white`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {data.status.toUpperCase()}
            </motion.span>
          </motion.div>
          
          {/* Content grid */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8"
            variants={staggerVariants}
          >
            {/* Left column - Notification details */}
            <div className="lg:col-span-2 space-y-7 flex flex-col">
              {/* Notification details card */}
              <motion.div 
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex-1 h-full"
                variants={cardVariants}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <AlertCircle className="mr-3 h-6 w-6 text-blue-600" />
                  Notification Details
                </h2>
                
                <div className="space-y-4">
                  {/* ID */}
                  <div className="flex items-start">
                    <Hash className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Notification ID</p>
                      <p className="text-gray-700 font-medium">REF-#{data.id}</p>
                    </div>
                  </div>
                  
                  {/* Date */}
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Received on</p>
                      <p className="text-gray-700 font-medium">{formattedDate}</p>
                    </div>
                  </div>
                  
                  {/* Email */}
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Associated Email</p>
                      <p className="text-gray-700 font-medium">{data.email}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Message box */}
              <motion.div 
                className={`bg-white rounded-xl p-6 border-l-4 ${statusInfo.borderColor} shadow-sm flex-1 h-full`}
                variants={cardVariants}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Message</h2>
                <div className="bg-gray-50 rounded-lg p-6 h-auto">
                  <p className="text-gray-700 text-lg">{data.message}</p>
                </div>
              </motion.div>
            </div>
            
            {/* Right column - Status and actions */}
            <div className="space-y-8 flex flex-col">
              {/* Status card */}
              <motion.div 
                className={`${statusInfo.lightBg} rounded-xl p-6 border border-l-4 ${statusInfo.borderColor} flex-1`}
                variants={cardVariants}
              >
                <div className="flex items-center mb-4">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {statusInfo.icon}
                  </motion.div>
                  <h3 className="text-lg font-semibold ml-3 text-gray-800">Status: {data.status}</h3>
                </div>
                
                <p className={`${statusInfo.textColor} mb-6`}>
                  {data.status === "Approved" 
                    ? "Your disbursement has been approved. Please check your email for further instructions."
                    : data.status === "Rejected"
                    ? "Your disbursement request could not be processed. Please review the details below."
                    : "Your request is being processed. We'll notify you once a decision has been made."
                  }
                </p>
                
                {/* Status-based actions */}
                <div className="space-y-3 mt-auto">
                  {data.status === "Approved" && (
                    <motion.a 
                      href={gmailLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Mail className="mr-2 h-5 w-5" />
                      Check Your Email
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </motion.a>
                  )}
                  
                  {data.status === "Rejected" && (
                    <>
                      {containsVerification && (
                        <motion.button
                          className="inline-flex w-full items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mb-3"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={verifyAgain}
                        >
                          <RefreshCw className="mr-2 h-5 w-5" />
                          Try Verification Again
                        </motion.button>
                      )}
                      <motion.a 
                        href={gmailLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-colors"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Mail className="mr-2 h-5 w-5" />
                        Check Email
                      </motion.a>
                    </>
                  )}
                  
                  {data.status === "Pending" && (
                    <motion.button
                      className="inline-flex w-full items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-colors"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <RefreshCw className="mr-2 h-5 w-5" />
                      Check Status Again
                    </motion.button>
                  )}
                </div>
              </motion.div>
              
              {/* Help box */}
              <motion.div 
                className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex-1"
                variants={cardVariants}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Need Help?</h3>
                <p className="text-gray-600 mb-6">If you have any questions about this notification, please contact customer support.</p>
                <motion.button 
                onClick={navSupport}
                  className="inline-flex w-full cursor-pointer items-center justify-center px-6 py-3 border border-blue-600 text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mt-auto"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Contact Support
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotificationDetail;