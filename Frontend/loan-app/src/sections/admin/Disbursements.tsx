import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Car, User, CreditCard, DollarSign, Calendar, Phone, Mail, FileText, TrendingUp } from 'lucide-react'
import { adminRentalApi } from '../../services/axiosConfig'
import { fetchDisbursementData } from '../../services/admin/rental'

interface CarLoanDetails {
  id: number
  car_id: number
  make: string
  model: string
  year: number
  color: string
  license_plate: string
  loan_sale_price: number
  commission_rate: number
  date_offered: string
  description: string
  image_url: string
}

interface PersonalDetails {
  first_name: string
  last_name: string
  middle_name: string
  email: string
  phone_number: string
}

interface Payment {
  id: number
  disbursement: number
  payment_date: string
  amount: string
  status: string
}

interface DisbursementData {
  car_details: CarLoanDetails
  payments: Payment[]
  person: PersonalDetails
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.3
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
}

const tableRowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}

const Disbursements = () => {
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, error } = useQuery({
    queryKey: ['disbursement', id],
    queryFn: () => fetchDisbursementData(id!),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-blue-100 animate-ping mx-auto opacity-20"></div>
          </div>
          <p className="text-slate-600 text-lg font-medium">Loading disbursement details...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <motion.div 
          className="text-center bg-white rounded-2xl shadow-2xl p-8 max-w-md border border-slate-200"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Error Loading Data</h3>
          <p className="text-red-600">Unable to load disbursement information</p>
        </motion.div>
      </div>
    )
  }

  if (!data) return null

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(numAmount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'failed':
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  const totalPayments = data.payments.reduce((sum: number, payment: Payment) => sum + parseFloat(payment.amount), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="mb-8"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Car Loan Disbursement Details
              </h1>
              <p className="text-slate-600 text-lg">Comprehensive loan and payment management dashboard</p>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm border border-slate-200">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">ID: {id}</span>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Car Details Card */}
          <motion.div 
            className="xl:col-span-3"
            variants={cardVariants}
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center">
                  <Car className="w-6 h-6 text-white mr-3" />
                  <h2 className="text-xl font-semibold text-white">Vehicle Information</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative group">
                      <img
                        src={data.car_details.image_url}
                        alt={`${data.car_details.make} ${data.car_details.model}`}
                        className="w-full h-60 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </motion.div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">
                        {data.car_details.year} {data.car_details.make} {data.car_details.model}
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-sm">{data.car_details.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Color</label>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                          <p className="font-medium text-slate-900">{data.car_details.color}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">License Plate</label>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                          <p className="font-medium text-slate-900">{data.car_details.license_plate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div 
                      className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center mb-2">
                        <DollarSign className="w-4 h-4 text-blue-600 mr-2" />
                        <label className="text-xs font-medium text-blue-600 uppercase tracking-wider">Loan Sale Price</label>
                      </div>
                      <p className="text-2xl font-bold text-blue-900">
                        {formatCurrency(data.car_details.loan_sale_price)}
                      </p>
                    </motion.div>
                    <motion.div 
                      className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center mb-2">
                        <TrendingUp className="w-4 h-4 text-purple-600 mr-2" />
                        <label className="text-xs font-medium text-purple-600 uppercase tracking-wider">Commission Rate</label>
                      </div>
                      <p className="text-2xl font-bold text-purple-900">
                        {(data.car_details.commission_rate * 100).toFixed(1)}%
                      </p>
                    </motion.div>
                    <motion.div 
                      className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-4"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center mb-2">
                        <Calendar className="w-4 h-4 text-emerald-600 mr-2" />
                        <label className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Date Offered</label>
                      </div>
                      <p className="text-sm font-semibold text-emerald-900">
                        {formatDate(data.car_details.date_offered)}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            className="xl:col-span-1 space-y-6"
            variants={itemVariants}
          >
            {/* Borrower Details Card */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200"
              variants={cardVariants}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-white mr-2" />
                  <h2 className="text-lg font-semibold text-white">Personal Information</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {/* Full Name Section */}
                  <div>
                    <label className="text-sm font-medium text-slate-600 mb-3 block">Full Name</label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">First:</label>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                          <p className="font-medium text-blue-600 text-sm">{data.person.first_name}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Middle:</label>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                          <p className="font-medium text-blue-600 text-sm">{data.person.middle_name}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Last:</label>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                          <p className="font-medium text-blue-600 text-sm">{data.person.last_name}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-slate-500 mr-2" />
                        <label className="text-sm font-medium text-slate-600">Email Address</label>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                        <p className="font-medium text-slate-900 text-sm break-all">{data.person.email}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-slate-500 mr-2" />
                        <label className="text-sm font-medium text-slate-600">Phone Number</label>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                        <p className="font-medium text-slate-900">{data.person.phone_number}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Summary Card */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200"
              variants={cardVariants}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-white mr-2" />
                  <h2 className="text-lg font-semibold text-white">Payment Summary</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {/* Total Payments */}
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-4">
                    <label className="text-sm font-medium text-emerald-700 mb-2 block">Total Payments</label>
                    <p className="text-2xl font-bold text-emerald-900">{formatCurrency(totalPayments)}</p>
                  </div>
                  
                  {/* Payment Details Grid */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">Number of Payments</label>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                        <p className="text-lg font-bold text-slate-900">{data.payments.length}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">Loan Amount</label>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                        <p className="text-lg font-bold text-slate-900">
                          {formatCurrency(data.car_details.loan_sale_price)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">Remaining Balance</label>
                      <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        <p className="text-lg font-bold text-red-600">
                          {formatCurrency(data.car_details.loan_sale_price - totalPayments)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Payments Table */}
        <motion.div 
          className="mt-8"
          variants={itemVariants}
        >
          <motion.div 
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200"
            variants={cardVariants}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
              <div className="flex items-center">
                <CreditCard className="w-6 h-6 text-white mr-3" />
                <h2 className="text-xl font-semibold text-white">Payment History</h2>
              </div>
            </div>
            <div className="overflow-x-auto">
              {data.payments.length > 0 ? (
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Payment ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Payment Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {data.payments.map((payment: Payment, index: number) => (
                      <motion.tr 
                        key={payment.id} 
                        className="hover:bg-slate-50 transition-colors duration-150"
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.005 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                          #{payment.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-medium">
                          {formatDate(payment.payment_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <motion.div 
                  className="text-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-lg font-medium">No payments found for this disbursement</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Disbursements