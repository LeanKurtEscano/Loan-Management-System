import React from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Users, UserCheck, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  // Bar chart data
  const barData = {
    labels: ['January', 'February', 'March'],
    datasets: [
      {
        label: 'Total Disbursement',
        data: [12000, 13000, 15000],
        backgroundColor: '#1E40AF', // Dark blue
      },
      {
        label: 'Total Collected',
        data: [17000, 19000, 43000],
        backgroundColor: '#10B981', // Green
      },
      {
        label: 'Outstanding Loan',
        data: [51000, 33000, 48000],
        backgroundColor: '#EF4444', // Red
      },
    ],
  };

  // Bar chart options
  const barOptions = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#f0f0f0',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'start',
      },
    },
  };

  // Pie chart data
  const pieData = {
    labels: ['Approved', 'Pending ', 'Rejected'],
    datasets: [
      {
        data: [62.5, 25, 12.5],
        backgroundColor: [
          '#67E8F9', // Light blue
          '#0EA5E9', // Medium blue
          '#0369A1', // Dark blue
        ],
        borderWidth: 0,
      },
    ],
  };

  // Pie chart options with percentage display
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 10,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.formattedValue;
            return `${label}: ${value}%`;
          }
        }
      }
    },
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
      }
    },
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  const chartVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        delay: 0.3 
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 max-w-7xl min-h-screen">
      {/* Dashboard Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center mb-8"
      >
        <div className="text-2xl font-bold text-gray-800">Dashboard</div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Active Loans Card */}
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-900">ACTIVE LOANS</h3>
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="bg-gray-100 p-2 rounded-full"
            >
              <Wallet size={24} className="text-gray-800" />
            </motion.div>
          </div>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-4"
          >
            <span className="text-4xl font-bold text-gray-900">50</span>
          </motion.div>
        </motion.div>

        {/* Total Borrowers Card */}
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-900">TOTAL BORROWERS</h3>
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="bg-gray-100 p-2 rounded-full"
            >
              <UserCheck size={24} className="text-gray-800" />
            </motion.div>
          </div>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4"
          >
            <span className="text-4xl font-bold text-gray-900">230</span>
          </motion.div>
        </motion.div>

        {/* Total Users Card */}
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-900">TOTAL USERS</h3>
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="bg-gray-100 p-2 rounded-full"
            >
              <Users size={24} className="text-gray-800" />
            </motion.div>
          </div>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-4"
          >
            <span className="text-4xl font-bold text-gray-900">403</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <motion.div 
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
          className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="mb-6">
            <div className="flex items-center mb-4 flex-wrap">
              <div className="h-3 w-3 rounded-full bg-blue-600 mr-2"></div>
              <span className="text-sm mr-6">Total Disbursement</span>
              
              <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm mr-6">Total Collected</span>
              
              <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-sm">Outstanding Loan</span>
            </div>
          </div>
          <div className="h-80">
            <Bar data={barData} options={barOptions} />
          </div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div 
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
          <h3 className="font-bold text-lg text-gray-900 mb-4">Loan Applications</h3>
          <div className="h-64 flex items-center  justify-center">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;