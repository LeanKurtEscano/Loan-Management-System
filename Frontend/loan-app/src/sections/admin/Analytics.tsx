import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { adminDisbursementApi } from '../../services/axiosConfig';
import { useQuery } from '@tanstack/react-query';
import { Line, Pie } from 'react-chartjs-2';
import { Users, UserCheck, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

import { formatCurrency } from '../../utils/formatCurrency';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

// Simple mock data structure


// Line Chart Component that accepts data as a prop
// Line Chart Component that accepts data as a prop
const DisbursementLineChart = ({ data }) => {
  // Create chart data from the provided data
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Total Disbursement',
        data: data.values,
        borderColor: 'rgba(14, 165, 233, 0.8)', // Updated line color
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(56, 189, 248, 0.8)');
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
          return gradient;
        },
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: 'rgba(14, 165, 233, 0.8)', // match point border color with line color
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgba(14, 165, 233, 0.8)',
        pointHoverBorderColor: '#ffffff',
      }
    ],
  };

  // Line chart options
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          color: '#64748b'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(226, 232, 240, 0.6)',
          drawBorder: false
        },
        border: {
          dash: [5, 5]
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          color: '#64748b',
          padding: 10,
          callback: function (value) {
            return '₱' + value.toLocaleString(); // Display Peso symbol
          }
        }
      },
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1e293b',
        bodyColor: '#2563EB', // Changed to Blue 600
        borderColor: 'rgba(226, 232, 240, 1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: '600'
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 13
        },
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += '₱' + context.parsed.y.toLocaleString(); // Show Peso in tooltip as well
            }
            return label;
          }
        }
      }
    },
    elements: {
      line: {
        borderJoinStyle: 'round'
      }
    }
  };

  return <Line data={chartData} options={lineOptions} />;
};


const Analytics = () => {
  // Define date ranges
  const dateRanges = [
    { label: 'Jan-Mar', value: 'q1', months: ['January', 'February', 'March'] },
    { label: 'Apr-Jun', value: 'q2', months: ['April', 'May', 'June'] },
    { label: 'Jul-Sep', value: 'q3', months: ['July', 'August', 'September'] },
    { label: 'Oct-Dec', value: 'q4', months: ['October', 'November', 'December'] }
  ];

  // Available years
  const years = ['2025', '2026', '2027', '2028', '2029', '2030'];

  // State for selected range and year
  const [selectedRange, setSelectedRange] = useState('q1'); // Default to Jan-Mar
  const [selectedYear, setSelectedYear] = useState('2025'); // Default to 2025

  const selectedMonths = dateRanges.find(range => range.value === selectedRange)?.months || [];

  // React Query fetcher
  const fetchAnalytics = async () => {
    const response = await adminDisbursementApi.get('/data/', {
      params: {
        year: selectedYear,
        months: selectedMonths.join(','), // e.g., 'January,February,March'
      },
    });
    return response.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics', selectedYear, selectedRange],
    queryFn: fetchAnalytics,
    enabled: !!selectedRange && !!selectedYear,
    select: (response) => {
      if (!response || !response.line_chart) return response;

      // Transform the line chart data into the format that the Line chart component needs
      const transformedLineChart = {
        labels: response.line_chart.map((item) => item.month),
        values: response.line_chart.map((item) => item.total_amount),
      };

      return {
        ...response,
        transformedLineChart,
      };
    },
  });


  console.log(data);



  const pieData = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        data: data.pie_chart.data,
        backgroundColor: [
          'rgba(56, 189, 248, 0.8)', // Light blue
          'rgba(14, 165, 233, 0.8)', // Medium blue
          'rgba(3, 105, 161, 0.8)', // Dark blue
        ],
        borderWidth: 0,
        hoverOffset: 4
      },
    ],
  };

  // Pie chart data

  // Pie chart options with percentage display
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 10,
          padding: 15,
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          color: '#334155'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1e293b',
        bodyColor: '#334155',
        borderColor: 'rgba(226, 232, 240, 1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: '600'
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 13
        },
        callbacks: {
          label: function (context) {
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

  // Handle dropdown changes
  const handleRangeChange = (e) => {
    setSelectedRange(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
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
            <span className="text-4xl font-bold text-gray-900">{data?.stats?.active_loans}</span>
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
            <span className="text-4xl font-bold text-gray-900">{data?.stats?.total_borrowers}</span>
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
            <span className="text-4xl font-bold text-gray-900">{data?.stats?.total_users}</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <motion.div
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
          className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div>
              <h3 className="font-bold text-xl text-gray-900 mb-1">Disbursement Analytics</h3>
              <p className="text-sm text-gray-500">Tracking total disbursement over time</p>
            </div>

            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
              {/* Year Selector */}
              <select
                id="yearSelector"
                value={selectedYear}
                onChange={handleYearChange}
                className="block w-full sm:w-32 pl-4 pr-8 py-2 text-base border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer focus:border-blue-500 sm:text-sm rounded-lg shadow-sm bg-white"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: `right 0.5rem center`,
                  backgroundRepeat: `no-repeat`,
                  backgroundSize: `1.5em 1.5em`,
                  appearance: `none`
                }}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              {/* Quarter Selector */}
              <select
                id="dateRange"
                value={selectedRange}
                onChange={handleRangeChange}
                className="block w-full sm:w-36 pl-4 pr-8 py-2 text-base border-gray-200 focus:outline-none focus:ring-2  focus:ring-blue-500 cursor-pointer focus:border-blue-500 sm:text-sm rounded-lg shadow-sm bg-white"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: `right 0.5rem center`,
                  backgroundRepeat: `no-repeat`,
                  backgroundSize: `1.5em 1.5em`,
                  appearance: `none`
                }}
              >
                {dateRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm font-medium text-gray-700">Total Disbursement</span>
              <div className="ml-auto text-sm font-medium">
                <span className="text-gray-500 mr-1">Current:</span>
                <span className="text-blue-600">{formatCurrency(data?.line_chart[0].total_amount + data?.line_chart[1].total_amount + data?.line_chart[2].total_amount)}</span>
              </div>
            </div>
          </div>

          <div className="h-80">
            {!isLoading && data && data.transformedLineChart && (
              <DisbursementLineChart data={data.transformedLineChart} />
            )}
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
          <h3 className="font-bold text-xl text-gray-900 mb-1">Loan Applications</h3>
          <p className="text-sm text-gray-500 mb-4">Approval status distribution</p>
          <div className="h-64 flex items-center justify-center">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;