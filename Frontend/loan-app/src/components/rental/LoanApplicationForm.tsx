import React from 'react'
import { useState } from 'react';
import { Car, Calendar, User, Phone, Mail, MapPin, CreditCard, DollarSign, Clock, Shield, Info, HelpCircle, CheckCircle, AlertCircle, FileText, Building, Star, Award, Users } from 'lucide-react';
import { rentalApi } from '../../services/axiosConfig';
import { useQueryClient } from '@tanstack/react-query';
interface CarId { 
 id: string;
 loanSalePrice?: number;
}
const LoanApplicationForm:React.FC<CarId> = ({id, loanSalePrice}) => {
    
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        maritalStatus: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        employer: '',
        jobTitle: '',
        employmentType: '',
        yearsEmployed: '',
        monthlyIncome: '',
        otherIncome: '',
        loanAmount: loanSalePrice ? loanSalePrice.toString() : '',
        loanTerm: '',
        downPayment: '',
        hasOtherLoans: '',
        carId: Number(id),
      });
      const queryClient = useQueryClient();
    
      const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value
        }));
      };
    
      const handleSubmit = async () => {
        setIsSubmitting(true);
    
        try {
          const response = await rentalApi.post('/apply/', formData);
          if (response.status === 201) {
            console.log("success");
            queryClient.invalidateQueries(['carLoanApplication', id]);
            
    
          }
        } catch (error) {
          alert("something went wrong, please try again later");
    
        } finally {
          setIsSubmitting(false);
    
        }
    
    
      };
  return (
    <>
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-slide-in-right">
                <div className="flex items-center justify-center mb-8">
                  <DollarSign className="w-10 h-10 text-blue-600 mr-4" />
                  <h1 className="text-3xl font-bold text-gray-900">Loan Application</h1>
                </div>
    
                <div className="space-y-8">
                  {/* Personal Information */}
                  {/* Personal Information */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <User className="w-6 h-6 mr-3 text-blue-600" />
                      Personal Information
                    </h2>
    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                          placeholder="Enter your first name"
                        />
                      </div>
    
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Middle Name*
                        </label>
                        <input
                          type="text"
                          name="middleName"
                          value={formData.middleName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                          placeholder="Enter your middle name"
                        />
                      </div>
    
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                          placeholder="Enter your last name"
                        />
                      </div>
    
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Date of Birth *
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-12 pr-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                          />
                        </div>
                      </div>
    
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Gender *
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          required
                          className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                      </div>
    
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Marital Status *
                        </label>
                        <select
                          name="maritalStatus"
                          value={formData.maritalStatus}
                          onChange={handleInputChange}
                          required
                          className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                        >
                          <option value="">Select Status</option>
                          <option value="single">Single</option>
                          <option value="married">Married</option>
                          <option value="divorced">Divorced</option>
                          <option value="widowed">Widowed</option>
                          <option value="separated">Separated</option>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    
    
    
    
    
    
    
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-12 pr-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>
    
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-12 pr-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                            placeholder="+63 912 345 6789"
                          />
                        </div>
                      </div>
    
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                          placeholder="Enter your city"
                        />
                      </div>
    
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Complete Address *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            rows={4}
                            className="w-full pl-12 pr-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-base"
                            placeholder="Enter your complete address"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
    
                  {/* Employment Information */}
                  <div className="bg-green-50 rounded-xl p-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-8 flex items-center">
                      <Building className="w-6 h-6 mr-3 text-blue-600" />
                      Employment Information
                    </h2>
    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Employer/Company *
                        </label>
                        <input
                          type="text"
                          name="employer"
                          value={formData.employer}
                          onChange={handleInputChange}
                          required
                          className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                          placeholder="Company name"
                        />
                      </div>
    
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Job Title *
                        </label>
                        <input
                          type="text"
                          name="jobTitle"
                          value={formData.jobTitle}
                          onChange={handleInputChange}
                          required
                          className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                          placeholder="Your position"
                        />
                      </div>
    
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Employment Type *
                        </label>
                        <select
                          name="employmentType"
                          value={formData.employmentType}
                          onChange={handleInputChange}
                          required
                          className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
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
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Years Employed *
                        </label>
                        <select
                          name="yearsEmployed"
                          value={formData.yearsEmployed}
                          onChange={handleInputChange}
                          required
                          className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
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
    
    
                  <div className="bg-purple-50 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <CreditCard className="w-6 h-6 mr-3 text-blue-600" />
                      Financial Information
                    </h2>
    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Monthly Income *
                        </label>
                        <input
                          type="number"
                          name="monthlyIncome"
                          value={formData.monthlyIncome}
                          onChange={handleInputChange}
                          required
                          min="0"
                          className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                          placeholder="₱50,000"
                        />
                      </div>
    
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Other Income
                        </label>
                        <input
                          type="number"
                          name="otherIncome"
                          value={formData.otherIncome}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                          placeholder="₱0"
                        />
                      </div>
    
    
    
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-3">
                          Loan Amount *
                        </label>
                        <input
                          type="number"
                          name="loanAmount"
                          value={formData.loanAmount}
                          onChange={handleInputChange}
                          required
                          disabled
                          min="0"
                          className="w-full px-5 py-4 border border-gray-300 bg-gray-100 text-gray-500 rounded-lg focus:ring-0 focus:border-gray-300 transition-all duration-200 text-base"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Loan Term *
                        </label>
                        <select
                          name="loanTerm"
                          value={formData.loanTerm}
                          onChange={handleInputChange}
                          required
                          className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                        >
                          <option value="" disabled>Select Term</option>
                          <option value="12">12 months</option>
                          <option value="24">24 months</option>
                          <option value="36">36 months</option>
                          <option value="48">48 months</option>
                          <option value="60">60 months</option>
                          <option value="72">72 months</option>
                        </select>
                      </div>
    
    
    
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Down Payment
                        </label>
                        <input
                          type="number"
                          name="downPayment"
                          value={formData.downPayment}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                          placeholder="₱100,000"
                        />
                      </div>
    
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Do you have other existing loans?
                        </label>
                        <div className="flex space-x-8">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="hasOtherLoans"
                              value="yes"
                              checked={formData.hasOtherLoans === 'yes'}
                              onChange={handleInputChange}
                              className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-3 text-base text-gray-700">Yes</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="hasOtherLoans"
                              value="no"
                              checked={formData.hasOtherLoans === 'no'}
                              onChange={handleInputChange}
                              className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-3 text-base text-gray-700">No</span>
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
                      onClick={handleSubmit}
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
    </>
  )
}

export default LoanApplicationForm