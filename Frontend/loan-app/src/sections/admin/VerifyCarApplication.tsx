import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, Car, User, DollarSign, Calendar, Phone, Mail, MapPin, Briefcase, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { getCarById } from '../../services/rental/Cars';
import { fetchCarLoanApplicationDetails } from '../../services/admin/rental';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/Modal';
import { adminRentalApi } from '../../services/axiosConfig';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import EmailModal from '../../components/EmailModal';
import { useMutation } from '@tanstack/react-query';
import { useMyContext } from '../../context/MyContext';

const VerifyCarApplication: React.FC = () => {
  const { id, carId } = useParams<{ id: string; carId: string }>();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
   const [loading2, setLoading2] = useState(false);
  const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null);
  const navigate = useNavigate();
  const [isReject, setIsReject] = useState(false);
   const [selectedId, setSelectedId] = useState<number | null>(null);
    const { emailDetails, approveLoan } = useMyContext();
  const { data: carData, isLoading: isCarLoading, isError: isCarError } = useQuery({
    queryKey: ['carDetails', carId],
    queryFn: () => getCarById(Number(carId)),
    enabled: !!carId
  });

  const { data: carDetails, isLoading: isCarDetailsLoading, isError: isCarDetailsError } = useQuery({
    queryKey: ['carLoanApplicationDetails', id],
    queryFn: () => fetchCarLoanApplicationDetails(Number(id)),
    enabled: !!id
  });

  console.log("Car Data:", carData);
  

  const commissionRate = carData?.commission_rate * 10;

  const calculateTotalAmount = () => {
    const loanAmount = carData?.loan_sale_price || 0;
    const fivePercentOfTotal = (loanAmount * commissionRate * 10) / 100;
    return loanAmount + fivePercentOfTotal;
  };

  
  const openReject = (id: number) => {
    setIsReject(true);
    setSelectedId(id);
  };


  const rejectMutation = useMutation({
      mutationFn: async (id: number) => {
        setLoading2(true);
        await adminRentalApi.post(`/car-loans/${id}/reject/`, {
          id: id,
          subject: emailDetails.subject,
          description: emailDetails.description,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["carLoanApplicationDetails", id]);
        setLoading2(false);
        setIsReject(false);
      },
    });

     const handleReject = async () => {
    rejectMutation.mutateAsync(selectedId ?? 0);
  };
  


  const handleApprove = async () => {
    setLoading(true);
    try {
      const response = await adminRentalApi.post("/loan-approval/", {
        id: id,
        loan_amount: carData?.loan_sale_price,
        interest : carData?.commission_rate
      });

      if (response.status === 200) {
        setIsModalOpen(false);
        queryClient.invalidateQueries(["carLoanApplicationDetails", id]);
      }
    } catch (error) {
      console.error("Error approving payment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  // Loading state
  if (isCarLoading || isCarDetailsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-lg font-medium text-gray-700">Loading application details...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isCarError || isCarDetailsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-6">Unable to load the loan application details. Please try again.</p>
          <button
            onClick={handleBack}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Success state after decision
  if (decision) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center">
          {decision === 'approved' ? (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Approved!</h2>
              <p className="text-gray-600 mb-6">
                The loan application for {carDetails?.first_name} {carDetails?.last_name} has been approved successfully.
              </p>
            </>
          ) : (
            <>
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Rejected</h2>
              <p className="text-gray-600 mb-6">
                The loan application for {carDetails?.first_name} {carDetails?.last_name} has been rejected.
              </p>
            </>
          )}
          <div className="space-y-3">
            <button
              onClick={() => setDecision(null)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Review Another Application
            </button>
            <button
              onClick={handleBack}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="absolute bg-blue-500 text-white font-medium px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-white" />
            Go Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Loan Application Review</h1>
            <p className="text-white/80">Application ID: #{id}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Car Details Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <div className="flex items-center text-white">
                <Car className="h-6 w-6 mr-3" />
                <h2 className="text-xl font-bold">Vehicle Information</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={carData?.image_url || 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&h=300&fit=crop'}
                    alt={`${carData?.make} ${carData?.model}`}
                    className="w-full h-48 object-cover rounded-xl shadow-lg"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {carData?.year} {carData?.make} {carData?.model}
                    </h3>
                    <p className="text-gray-600">{carData?.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Color</p>
                      <p className="font-semibold">{carData?.color}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">License Plate</p>
                      <p className="font-semibold">{carData?.license_plate}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium">Sale Price</p>
                      <p className="text-2xl font-bold text-blue-700">
                        {formatCurrency(carData?.loan_sale_price || 0)}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-purple-600 font-medium">Commission Rate</p>
                      <p className="text-2xl font-bold text-purple-700">
                        {commissionRate ? `${commissionRate}%` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loan Application Details */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center">
                  <User className="h-6 w-6 mr-3" />
                  <h2 className="text-xl font-bold">Applicant Information</h2>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${carDetails?.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : carDetails?.status === 'Approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                  {carDetails?.status}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-semibold">
                          {carDetails?.first_name} {carDetails?.middle_name} {carDetails?.last_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Birth Date</p>
                        <p className="font-semibold">{carDetails?.birthdate ? formatDate(carDetails.birthdate) : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="font-semibold">{carDetails?.phone_number}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email Address</p>
                        <p className="font-semibold">{carDetails?.email_address}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-semibold">{carDetails?.complete_address}</p>
                        <p className="text-sm text-gray-500">{carDetails?.city}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Employment & Financial Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Employment & Financial</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Job Title</p>
                        <p className="font-semibold">{carDetails?.job_title}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Monthly Income</p>
                        <p className="font-semibold">{formatCurrency(carDetails?.monthly_income || 0)}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Employment Type</p>
                        <p className="font-semibold capitalize">{carDetails?.employment_type?.replace('-', ' ')}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Years Employed</p>
                        <p className="font-semibold">{carDetails?.years_employed} years</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Other Income</p>
                        <p className="font-semibold">{formatCurrency(carDetails?.other_income || 0)}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Existing Loans</p>
                        <p className="font-semibold">{carDetails?.existing_loans ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loan Details */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Loan Details</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Loan Amount</p>
                    <p className="text-xl font-bold text-blue-700">
                      {formatCurrency(carDetails?.loan_amount || 0)}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Down Payment</p>
                    <p className="text-xl font-bold text-green-700">
                      {formatCurrency(carDetails?.down_payment || 0)}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 font-medium">Loan Term</p>
                    <p className="text-xl font-bold text-purple-700">
                      {carDetails?.loan_term} months
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-orange-600 font-medium">Total Amount</p>
                    <p className="text-xl font-bold text-orange-700">
                      {formatCurrency(calculateTotalAmount())}
                    </p>
                    <p className="text-xs text-orange-500 mt-1">
                      (Including 5% additional charge)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conditionally render Action Buttons based on status */}
          {carDetails.status === "Approved" ? (
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-center space-x-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-green-600">Application Approved</h3>
                  <p className="text-gray-600 mt-1">This loan application has been successfully approved.</p>
                </div>
              </div>
            </div>
          ) : carDetails.status === "Rejected" ? (
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-center space-x-3">
                <XCircle className="h-8 w-8 text-red-500" />
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-red-600">Application Rejected</h3>
                  <p className="text-gray-600 mt-1">This loan application has been rejected.</p>
                </div>
              </div>
              
              {/* Additional rejection details section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800">Rejection Notice</h4>
                      <p className="text-sm text-red-700 mt-1">
                        The applicant has been notified of the rejection via email. No further action is required.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                  >
                    Back to Applications
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => openReject(carDetails.id)}
                  disabled={isProcessing}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <XCircle className="h-5 w-5" />
                      <span>Reject Application</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={isProcessing}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Approve Application</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        loading={loading}
        isOpen={isModalOpen}
        title="Approve Car Loan Application"
        message="Are you sure you want to approve the car loan application of this user?"
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleApprove}
      />


       {isReject && selectedId !== null ? (
        <EmailModal
          loading={loading2}
          isOpen={isReject}
          onClose={() => setIsReject(false)}
          onConfirm={handleReject}
          heading="Reject Loan Application"
          buttonText="Submit Rejection"
        />
      ) : null}
    </div>
  );
};

export default VerifyCarApplication;