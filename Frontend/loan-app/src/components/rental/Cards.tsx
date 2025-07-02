import React from 'react'
import { Car, Calendar, User, Phone, Mail, MapPin, CreditCard, DollarSign, Clock, Shield, Info, HelpCircle, CheckCircle, AlertCircle, FileText, Building, Star, Award, Users } from 'lucide-react';
const Cards = () => {
  return (
    <>
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

            <div className="bg-white rounded-2xl shadow-lg p-6 animate-slide-in-left">
              <div className="flex items-center mb-6">
                <Shield className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Why Choose Us?</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-700 font-semibold">Trusted by Thousands</p>
                  <p className="text-sm text-gray-700">Over 10,000 satisfied customers nationwide.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-700 font-semibold">Transparent Process</p>
                  <p className="text-sm text-gray-700">No hidden fees. Everything is explained upfront.</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-purple-700 font-semibold">Flexible Options</p>
                  <p className="text-sm text-gray-700">We offer terms that suit your financial capacity.</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-yellow-700 font-semibold">24/7 Support</p>
                  <p className="text-sm text-gray-700">Our team is ready to help anytime, anywhere.</p>
                </div>
              </div>
            </div>




            {/* Company Trust Indicators */}


            {/* Contact Information */}

            <div className="bg-white rounded-2xl shadow-lg p-6 animate-slide-in-left">
              <div className="flex items-center mb-6">
                <Info className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
                <li>Select a car from our wide selection.</li>
                <li>Review car details and estimated loan payment.</li>
                <li>Submit your application with necessary documents.</li>
                <li>Get approval within 24-48 hours.</li>
                <li>Drive home your new car!</li>
              </ol>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-slide-in-left">
              <div className="flex items-center mb-6">
                <Info className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <p className="font-semibold text-gray-900">Can I apply with no credit history?</p>
                  <p>Yes. We consider various factors beyond credit history.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Is there a penalty for early repayment?</p>
                  <p>No penalties. You can repay anytime without extra charges.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">How do I track my application?</p>
                  <p>After submission, you'll receive a tracking number via SMS or email.</p>
                </div>
              </div>
            </div>

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
    
    </>
  )
}

export default Cards