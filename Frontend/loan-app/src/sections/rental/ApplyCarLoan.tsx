import React, { useState, useEffect } from 'react';
import { Car, Calendar, User, Phone, Mail, MapPin, CreditCard, DollarSign, Clock, Shield, Info, HelpCircle, CheckCircle, AlertCircle,FileText, Building, Star, Award, Users } from 'lucide-react';


interface CarLoanDetails {
  id: string;
  car_id: number;
  make: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  loan_sale_price: number;
  commission_rate: number;
  date_offered: string;
  description: string;
  image_url: string;
}

interface LoanFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  monthlyIncome: string;
  loanAmount: string;
  loanTerm: string;
  downPayment: string;
}

const ApplyCarLoan = () => {
  const carId = "1"; // Mock car ID for demonstration
  const [carDetails, setCarDetails] = useState<CarLoanDetails | null>(null);
  const [loading, setLoading] = useState(true);
   const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    employer: '',
    jobTitle: '',
    employmentType: '',
    yearsEmployed: '',
    monthlyIncome: '',
    otherIncome: '',
    loanAmount: '',
    loanTerm: '12',
    loanPurpose: '',
    downPayment: '',
    creditScore: '',
    bankingHistory: '',
    hasOtherLoans: 'no',
    agreeToTerms: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock API call
  useEffect(() => {
    const fetchCarDetails = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data from your API endpoint
      const mockCarLoanDetails = {
        id: carId || "1",
        car_id: 101,
        make: "Toyota",
        model: "Camry",
        year: 2022,
        color: "Silver",
        license_plate: "ABC123",
        loan_sale_price: 1250000,
        commission_rate: 0.05,
        date_offered: "2024-01-15T10:30:00",
        description: "Well-maintained sedan with low mileage, perfect for family use",
        image_url: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&h=300&fit=crop"
      };
      
      setCarDetails(mockCarLoanDetails);
      setFormData(prev => ({
        ...prev,
        loanAmount: mockCarLoanDetails.loan_sale_price.toString()
      }));
      setLoading(false);
    };

    fetchCarDetails();
  }, [carId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Loan application submitted successfully!');
    setIsSubmitting(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateMonthlyPayment = () => {
    if (!carDetails || !formData.loanAmount || !formData.loanTerm || !formData.downPayment) return 0;
    
    const principal = parseFloat(formData.loanAmount) - parseFloat(formData.downPayment);
    const monthlyRate = 0.08 / 12; // 8% annual interest rate
    const numPayments = parseInt(formData.loanTerm);
    
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    return monthlyPayment;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!carDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Car not found</h2>
          <p className="text-gray-600">The requested car details could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Apply for Car Loan
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Complete your loan application for this vehicle. Our team will review and get back to you within 24 hours.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Car Details Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 animate-slide-in-left">
              <div className="relative">
                <img 
                  src={carDetails.image_url} 
                  alt={`${carDetails.make} ${carDetails.model}`}
                  className="w-full h-64 sm:h-80 object-cover"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {carDetails.year}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {carDetails.make} {carDetails.model}
                  </h2>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-600">
                      {formatCurrency(carDetails.loan_sale_price)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {(carDetails.commission_rate * 100).toFixed(1)}% commission
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {carDetails.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-700">
                    <Car className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="text-sm">{carDetails.color}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Shield className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="text-sm">{carDetails.license_plate}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="text-sm">{formatDate(carDetails.date_offered)}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="text-sm">ID: {carDetails.car_id}</span>
                  </div>
                </div>

                {/* Loan Calculator Preview */}
                {formData.downPayment && formData.loanTerm && (
                  <div className="bg-blue-50 rounded-lg p-4 animate-fade-in">
                    <h3 className="font-semibold text-blue-900 mb-2">Estimated Monthly Payment</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(calculateMonthlyPayment())}
                    </p>
                    <p className="text-sm text-blue-700">
                      Based on {formData.loanTerm} months term
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Loan Information Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-slide-in-left">
              <div className="flex items-center mb-6">
                <Info className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Loan Information</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="font-semibold text-green-900">Competitive Rates</h3>
                  </div>
                  <p className="text-green-700 text-sm mt-1">Starting from 8% annual interest rate</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="font-semibold text-blue-900">Quick Approval</h3>
                  </div>
                  <p className="text-blue-700 text-sm mt-1">Get approved within 24-48 hours</p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-purple-600 mr-2" />
                    <h3 className="font-semibold text-purple-900">Flexible Terms</h3>
                  </div>
                  <p className="text-purple-700 text-sm mt-1">Choose from 12 to 72 months repayment</p>
                </div>
              </div>
            </div>

           
           

            {/* Company Trust Indicators */}
          

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-slide-in-left">
              <div className="flex items-center mb-6">
                <Phone className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Need Help?</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-semibold text-gray-900">Customer Service</p>
                    <p className="text-gray-600">+63 2 8888 9999</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-semibold text-gray-900">Email Support</p>
                    <p className="text-gray-600">loans@company.com</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-semibold text-gray-900">Business Hours</p>
                    <p className="text-gray-600">Mon - Fri: 8:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loan Application Form */}
         <div className="bg-white rounded-2xl shadow-lg p-6 animate-slide-in-right">
           <div className="flex items-center justify-center mb-8">
            <DollarSign className="w-10 h-10 text-blue-600 mr-4" />
            <h1 className="text-3xl font-bold text-gray-900">Loan Application</h1>
          </div>

          <div className="space-y-8">
            {/* Personal Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <User className="w-6 h-6 mr-3 text-blue-600" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your first name"
                  />
                </div>
                
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your last name"
                  />
                </div>

                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marital Status *
                  </label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Phone className="w-6 h-6 mr-3 text-blue-600" />
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="+63 912 345 6789"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your city"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complete Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Enter your complete address"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="bg-green-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Building className="w-6 h-6 mr-3 text-blue-600" />
                Employment Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employer/Company *
                  </label>
                  <input
                    type="text"
                    name="employer"
                    value={formData.employer}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Your position"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Type *
                  </label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="self-employed">Self-employed</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years Employed *
                  </label>
                  <select
                    name="yearsEmployed"
                    value={formData.yearsEmployed}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Years</option>
                    <option value="less-than-1">Less than 1 year</option>
                    <option value="1-2">1-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="more-than-10">More than 10 years</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="bg-purple-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <CreditCard className="w-6 h-6 mr-3 text-blue-600" />
                Financial Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Income *
                  </label>
                  <input
                    type="number"
                    name="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="₱50,000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Other Income
                  </label>
                  <input
                    type="number"
                    name="otherIncome"
                    value={formData.otherIncome}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="₱0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credit Score Range
                  </label>
                  <select
                    name="creditScore"
                    value={formData.creditScore}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Range</option>
                    <option value="excellent">Excellent (750+)</option>
                    <option value="good">Good (700-749)</option>
                    <option value="fair">Fair (650-699)</option>
                    <option value="poor">Poor (600-649)</option>
                    <option value="very-poor">Very Poor (Below 600)</option>
                    <option value="unknown">Don't know</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Amount *
                  </label>
                  <input
                    type="number"
                    name="loanAmount"
                    value={formData.loanAmount}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="₱500,000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Term *
                  </label>
                  <select
                    name="loanTerm"
                    value={formData.loanTerm}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="12">12 months</option>
                    <option value="24">24 months</option>
                    <option value="36">36 months</option>
                    <option value="48">48 months</option>
                    <option value="60">60 months</option>
                    <option value="72">72 months</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Purpose *
                  </label>
                  <select
                    name="loanPurpose"
                    value={formData.loanPurpose}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Purpose</option>
                    <option value="car">Car Purchase</option>
                    <option value="home">Home Purchase</option>
                    <option value="business">Business</option>
                    <option value="education">Education</option>
                    <option value="debt-consolidation">Debt Consolidation</option>
                    <option value="personal">Personal</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Down Payment
                  </label>
                  <input
                    type="number"
                    name="downPayment"
                    value={formData.downPayment}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="₱100,000"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Do you have other existing loans?
                  </label>
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasOtherLoans"
                        value="yes"
                        checked={formData.hasOtherLoans === 'yes'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasOtherLoans"
                        value="no"
                        checked={formData.hasOtherLoans === 'no'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Agreement */}
            <div className="bg-orange-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Shield className="w-6 h-6 mr-3 text-blue-600" />
                Agreement
              </h2>
              
              <div className="space-y-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    required
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 mr-3"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and 
                    <a href="#" className="text-blue-600 hover:underline ml-1">Privacy Policy</a>. 
                    I authorize the lender to verify the information provided and perform credit checks as necessary.
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting || !formData.agreeToTerms}
                className="w-full max-w-md bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center justify-center shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Processing Application...
                  </>
                ) : (
                  <>
                    <FileText className="w-6 h-6 mr-3" />
                    Submit Loan Application
                  </>
                )}
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out 0.2s both;
        }
      `}</style>
    </div>
  );
};

export default ApplyCarLoan;