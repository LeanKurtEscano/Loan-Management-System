import React, { useState, useEffect } from 'react';
import { Car, Calendar, User, Phone, Mail, MapPin, CreditCard, DollarSign, Clock, Shield, Info, HelpCircle, CheckCircle, AlertCircle, FileText, Building, Star, Award, Users } from 'lucide-react';
import { CarLoanDetails } from '../../constants/interfaces/carLoan';
import { formatDateWithWords } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import { useQuery } from '@tanstack/react-query';
import { getExistingCarApplication } from '../../services/rental/Cars';
import Cards from '../../components/rental/Cards';
import { useParams } from 'react-router-dom';
import LoanApplicationForm from '../../components/rental/LoanApplicationForm';

const ApplyCarLoan = () => {
  const carId = useParams();
  console.log(carId.id)
  const [carDetails, setCarDetails] = useState<CarLoanDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const { data: applicationData, isLoading: applicationLoading, isError, error } = useQuery({
    queryKey: ['carLoanApplication', carId.id],
    queryFn: () => getExistingCarApplication(Number(carId.id))
  });

  console.log(applicationData);

  useEffect(() => {
    const fetchCarDetails = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockCarLoanDetails = {
        id: "1",
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
      setLoading(false);
    };

    fetchCarDetails();
  }, [carId]);

  // Determine application status based on the message from backend
  const getApplicationStatus = () => {
    // Check if we have application data
    if (!applicationData) return null;
    
    // Check the status field first (if available)
    if (applicationData.status) {
      if (status === 'approved') return 'approved';
      if (status === 'pending') return 'pending';
    }
    
    // Fallback to checking the message field
    if (applicationData.message) {
      const message = applicationData.message.toLowerCase();
      if (message.includes('approved')) return 'approved';
      if (message.includes('pending')) return 'pending';
    }
    
    return null;
  };

  const applicationStatus = getApplicationStatus();
  const isApplicationPending = applicationStatus === 'pending';
  const isApplicationApproved = applicationStatus === 'approved';
  const isApplicationNotFound = isError && error?.response?.status === 404;
  
  // Show form only when application is not found (404 error)
  const showForm = isApplicationNotFound;
  
  // Debug logging
  console.log('Debug Info:', {
    applicationData,
    isError,
    error,
    applicationStatus,
    isApplicationPending,
    isApplicationApproved,
    isApplicationNotFound,
    showForm,
    applicationLoading,
    rawStatus: applicationData?.status,
    rawMessage: applicationData?.message
  });

  if (loading || applicationLoading) {
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

  const PendingCard = () => (
    <div className="bg-orange-50 border flex items-center justify-center border-orange-200 rounded-2xl shadow-lg p-8 animate-slide-in-right">
      <div className="text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-orange-800 mb-2">Application Pending</h2>
        <p className="text-orange-700 mb-6">
          {applicationData?.message || "Your loan application for this vehicle is currently under review. Our team will get back to you within 24 hours."}
        </p>
        <div className="bg-white rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-center text-orange-600">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">Status: {applicationData?.status || "Under Review"}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const ApprovedCard = () => (
    <div className="bg-green-50 border border-green-200 flex items-center justify-center rounded-2xl shadow-lg p-8 animate-slide-in-right">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-800 mb-2">Loan Approved!</h2>
        <p className="text-green-700 mb-6">
          {applicationData?.message || "Congratulations! Your loan application has been approved. You can now proceed with the vehicle purchase."}
        </p>
        <div className="bg-white rounded-lg p-4 border border-green-200 mb-4">
          <div className="flex items-center justify-center text-green-600 mb-2">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">Status: {applicationData?.status || "Approved"}</span>
          </div>
        </div>
        <button className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors">
          Proceed to Purchase
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            {isApplicationApproved ? 'Loan Approved' : isApplicationPending ? 'Application Status' : 'Apply for Car Loan'}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {isApplicationApproved 
              ? 'Your loan has been approved for this vehicle.' 
              : isApplicationPending 
                ? 'Your application is currently being reviewed.'
                : 'Complete your loan application for this vehicle. Our team will review and get back to you within 24 hours.'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
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
                {isApplicationApproved && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approved
                  </div>
                )}
                {isApplicationPending && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Pending
                  </div>
                )}
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
                    <span className="text-sm">{formatDateWithWords(carDetails.date_offered)}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="text-sm">ID: {carDetails.car_id}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Only show Cards component if no application exists or application not found */}
            {showForm && <Cards/>}
          </div>

          {/* Conditional rendering based on application status */}
          {isApplicationPending && <PendingCard />}
          {isApplicationApproved && <ApprovedCard />}
          {showForm && (
            <LoanApplicationForm 
              id={carId.id ?? ""} 
              loanSalePrice={carDetails.loan_sale_price}
            />
          )}
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