import React from 'react';
import { useParams } from 'react-router-dom';
import { getAdminNotification } from '../../services/notification';
import { useQuery } from '@tanstack/react-query';
import { 
  AlertCircle, Mail, 
  ArrowLeft, RefreshCw, Clock, Calendar, Hash
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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

const AdminNotificationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const handleGoBack = () => {
    navigate('/dashboard/admin/notifications');
  };

  const navSupport = () => {
    navigate('/support');
  }
  
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["adminNotificationDetails", id],
    queryFn: () => getAdminNotification(id),
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
  
  // Notification styling
  const notificationStyle = {
    bgColor: "bg-blue-600",
    textColor: "text-blue-800",
    lightBg: "bg-blue-50",
    borderColor: "border-blue-600",
    icon: <AlertCircle className="h-8 w-8 text-blue-600" />
  };

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
          {/* Notification banner */}
          <motion.div 
            className={`${notificationStyle.bgColor} py-4 px-8 text-white flex items-center justify-between`}
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
                {notificationStyle.icon}
              </motion.div>
              <h1 className="text-2xl font-bold ml-3">Admin Notification</h1>
            </div>
            <motion.span 
              className={`px-4 py-2 rounded-full text-base font-medium ${notificationStyle.bgColor} bg-white/20 text-white`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              NOTIFICATION
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
                  
                  {/* Read Status */}
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className={`font-medium ${data.is_read ? 'text-green-600' : 'text-orange-600'}`}>
                        {data.is_read ? 'Read' : 'Unread'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Message box */}
              <motion.div 
                className={`bg-white rounded-xl p-6 border-l-4 ${notificationStyle.borderColor} shadow-sm flex-1 h-full`}
                variants={cardVariants}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Message</h2>
                <div className="bg-gray-50 rounded-lg p-6 h-auto">
                  <p className="text-gray-700 text-lg">{data.message}</p>
                </div>
              </motion.div>
            </div>
            
            {/* Right column - Notification info and actions */}
            <div className="space-y-8 flex flex-col">
              {/* Notification info card */}
              <motion.div 
                className={`${notificationStyle.lightBg} rounded-xl p-6 border border-l-4 ${notificationStyle.borderColor} flex-1`}
                variants={cardVariants}
              >
                <div className="flex items-center mb-4">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {notificationStyle.icon}
                  </motion.div>
                  <h3 className="text-lg font-semibold ml-3 text-gray-800">Admin Notification</h3>
                </div>
                
                <p className={`${notificationStyle.textColor} mb-6`}>
                  This is an important notification from the administration. Please review the message carefully.
                </p>
                
                {/* Actions */}
                <div className="space-y-3 mt-auto">
                  <motion.button
                    onClick={() => refetch()}
                    className="inline-flex w-full items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Refresh Notification
                  </motion.button>
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

export default AdminNotificationDetails;