import React from 'react'
import { useState } from 'react';
import { Car, Calendar, User, Phone, Mail, MapPin, CreditCard, DollarSign, Info, FileText, Building,  Upload, Image, X,Shield,AlertCircle } from 'lucide-react';
import { rentalApi } from '../../services/axiosConfig';
import { useQueryClient } from '@tanstack/react-query';
import { 
  validateAddress,
  validateEmail,
  validateContactNumber,
  validateFirstName,
  validateMiddleName,
  validateLastName,
  validateDateOfBirth,
  validateGender,
  validateMaritalStatus,
  validateCity,
  validateEmployer,
  validateJobTitle,
  validateEmploymentType,
  validateYearsEmployed,
  validateMonthlyIncome,
  validateOtherIncome,
  validateLoanAmount,
  validateLoanTerm,
  validateHasOtherLoans,
  validateFile,
  validateAgreeToTerms
} from '../../utils/validation';
interface CarId { 
 id: string;
 loanSalePrice?: number;
}

const LoanApplicationForm: React.FC<CarId> = ({id, loanSalePrice}) => {
      const queryClient = useQueryClient();
      const [errors, setErrors] = useState<Record<string, string>>({});
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
        hasOtherLoans: '',
        carId: Number(id),
        idFront: null,
        idBack: null,
        agreeToTerms: false,
      });


        const validateField = (name: string, value: any) => {
    let error = '';
    
    switch (name) {
      case 'firstName':
        error = validateFirstName(value);
        break;
      case 'middleName':
        error = validateMiddleName(value);
        break;
      case 'lastName':
        error = validateLastName(value);
        break;
      case 'dateOfBirth':
        error = validateDateOfBirth(value);
        break;
      case 'gender':
        error = validateGender(value);
        break;
      case 'maritalStatus':
        error = validateMaritalStatus(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'phone':
        error = validateContactNumber(value);
        break;
      case 'address':
        error = validateAddress(value);
        break;
      case 'city':
        error = validateCity(value);
        break;
      case 'employer':
        error = validateEmployer(value);
        break;
      case 'jobTitle':
        error = validateJobTitle(value);
        break;
      case 'employmentType':
        error = validateEmploymentType(value);
        break;
      case 'yearsEmployed':
        error = validateYearsEmployed(value);
        break;
      case 'monthlyIncome':
        error = validateMonthlyIncome(value);
        break;
      case 'otherIncome':
        error = validateOtherIncome(value);
        break;
      case 'loanAmount':
        error = validateLoanAmount(value);
        break;
      case 'loanTerm':
        error = validateLoanTerm(value);
        break;
      case 'hasOtherLoans':
        error = validateHasOtherLoans(value);
        break;
      case 'idFront':
        error = validateFile(value, 'ID Front');
        break;
      case 'idBack':
        error = validateFile(value, 'ID Back');
        break;
      case 'agreeToTerms':
        error = validateAgreeToTerms(value);
        break;
      default:
        break;
    }
    
    return error;
  };
    
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Validate field on change if it's been touched
   
      const error = validateField(name, newValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    
  };

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = e.target.files?.[0];
        if (file) {
          setFormData(prev => ({
            ...prev,
            [fieldName]: file
          }));
        }
      };

      const handleFileDelete = (fieldName: string) => {
        setFormData(prev => ({
          ...prev,
          [fieldName]: null
        }));
        // Clear the file input value to allow re-uploading the same file
        const fileInput = document.getElementById(fieldName) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      };
    
      const handleSubmit = async () => {
        setIsSubmitting(true);
    
        try {
          // Create FormData for multipart form submission
          const submitData = new FormData();
          
          // Append all form fields to FormData
          Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              // Handle file fields
              if (key === 'idFront' || key === 'idBack') {
                if (value instanceof File) {
                  submitData.append(key, value);
                }
              } else {
                // Handle regular form fields
                submitData.append(key, value.toString());
              }
            }
          });

          // Make the API call with multipart form data
          const response = await rentalApi.post('/apply/', submitData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          
          if (response.status === 201) {
            console.log("success");
            queryClient.invalidateQueries(['carLoanApplication', id]);
          }
    
        } catch (error) {
          console.error('Loan application error:', error);
          alert("Something went wrong, please try again later");
        } finally {
          setIsSubmitting(false);
        }
      };

      const checkRequiredFields = () => {
  const requiredFields = [
    'firstName', 'middleName', 'lastName', 'dateOfBirth', 'gender', 'maritalStatus',
    'email', 'phone', 'address', 'city', 'employer', 'jobTitle', 'employmentType',
    'yearsEmployed', 'monthlyIncome', 'loanAmount', 'loanTerm', 'hasOtherLoans',
    'idFront', 'idBack', 'agreeToTerms'
  ];
  
  return requiredFields.some(field => {
    const value = formData[field];
    return !value || value === '' || value === false;
  });
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
             className={`w-full px-5 py-4 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base`}
             placeholder="Enter your first name"
           />
           {errors.firstName && (
             <div className="flex items-center mt-2 text-red-600">
               <AlertCircle className="w-4 h-4 mr-2" />
               <span className="text-sm">{errors.firstName}</span>
             </div>
           )}
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
             className={`w-full px-5 py-4 border ${errors.middleName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base`}
             placeholder="Enter your middle name"
           />
           {errors.middleName && (
             <div className="flex items-center mt-2 text-red-600">
               <AlertCircle className="w-4 h-4 mr-2" />
               <span className="text-sm">{errors.middleName}</span>
             </div>
           )}
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
             className={`w-full px-5 py-4 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base`}
             placeholder="Enter your last name"
           />
           {errors.lastName && (
             <div className="flex items-center mt-2 text-red-600">
               <AlertCircle className="w-4 h-4 mr-2" />
               <span className="text-sm">{errors.lastName}</span>
             </div>
           )}
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
              min={new Date(new Date().setFullYear(new Date().getFullYear() - 90)).toISOString().split("T")[0]}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 21)).toISOString().split("T")[0]}
               className={`w-full pl-12 pr-5 py-4 border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base`}
             />
           </div>
           {errors.dateOfBirth && (
             <div className="flex items-center mt-2 text-red-600">
               <AlertCircle className="w-4 h-4 mr-2" />
               <span className="text-sm">{errors.dateOfBirth}</span>
             </div>
           )}
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
             className={`w-full px-5 py-4 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base`}
           >
             <option value="" disabled>Select Gender</option>
             <option value="male">Male</option>
             <option value="female">Female</option>
             <option value="other">Other</option>
             <option value="prefer-not-to-say">Prefer not to say</option>
           </select>
           {errors.gender && (
             <div className="flex items-center mt-2 text-red-600">
               <AlertCircle className="w-4 h-4 mr-2" />
               <span className="text-sm">{errors.gender}</span>
             </div>
           )}
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
             className={`w-full px-5 py-4 border ${errors.maritalStatus ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base`}
           >
             <option value="" disabled>Select Status</option>
             <option value="single">Single</option>
             <option value="married">Married</option>
             <option value="divorced">Divorced</option>
             <option value="widowed">Widowed</option>
             <option value="separated">Separated</option>
           </select>
           {errors.maritalStatus && (
             <div className="flex items-center mt-2 text-red-600">
               <AlertCircle className="w-4 h-4 mr-2" />
               <span className="text-sm">{errors.maritalStatus}</span>
             </div>
           )}
         </div>
       </div>
     </div>

     {/* ID Document Upload */}
     <div className="bg-yellow-50 rounded-xl p-6">
       <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
         <Image className="w-6 h-6 mr-3 text-blue-600" />
         Identity Verification
       </h2>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-3">
             ID Front Side *
           </label>
           <div className="relative">
             <input
               type="file"
               name="idFront"
               accept="image/*,.pdf"
               onChange={(e) => handleFileChange(e, 'idFront')}
               required
               className="hidden"
               id="idFront"
             />
             <label
               htmlFor="idFront"
               className={`w-full h-32 border-2 border-dashed ${errors.idFront ? 'border-red-500' : 'border-gray-300'} rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200`}
             >
               <Upload className="w-8 h-8 text-gray-400 mb-2" />
               <span className="text-sm text-gray-600">
                 {formData.idFront ? (formData.idFront as File).name : 'Upload ID Front'}
               </span>
               <span className="text-xs text-gray-400 mt-1">
                 JPG, PNG, PDF up to 10MB
               </span>
             </label>
             {formData.idFront && (
               <button
                 type="button"
                 onClick={() => handleFileDelete('idFront')}
                 className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200 shadow-md"
               >
                 <X className="w-4 h-4" />
               </button>
             )}
           </div>
           {errors.idFront && (
             <div className="flex items-center mt-2 text-red-600">
               <AlertCircle className="w-4 h-4 mr-2" />
               <span className="text-sm">{errors.idFront}</span>
             </div>
           )}
         </div>

         <div>
           <label className="block text-sm font-medium text-gray-700 mb-3">
             ID Back Side *
           </label>
           <div className="relative">
             <input
               type="file"
               name="idBack"
               accept="image/*,.pdf"
               onChange={(e) => handleFileChange(e, 'idBack')}
               required
               className="hidden"
               id="idBack"
             />
             <label
               htmlFor="idBack"
               className={`w-full h-32 border-2 border-dashed ${errors.idBack ? 'border-red-500' : 'border-gray-300'} rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200`}
             >
               <Upload className="w-8 h-8 text-gray-400 mb-2" />
               <span className="text-sm text-gray-600">
                 {formData.idBack ? (formData.idBack as File).name : 'Upload ID Back'}
               </span>
               <span className="text-xs text-gray-400 mt-1">
                 JPG, PNG, PDF up to 10MB
               </span>
             </label>
             {formData.idBack && (
               <button
                 type="button"
                 onClick={() => handleFileDelete('idBack')}
                 className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200 shadow-md"
               >
                 <X className="w-4 h-4" />
               </button>
             )}
           </div>
           {errors.idBack && (
             <div className="flex items-center mt-2 text-red-600">
               <AlertCircle className="w-4 h-4 mr-2" />
               <span className="text-sm">{errors.idBack}</span>
             </div>
           )}
         </div>
       </div>

       <div className="mt-4 p-4 bg-blue-50 rounded-lg">
         <div className="flex items-start">
           <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
           <div className="text-sm text-blue-800">
             <p className="font-medium mb-1">Acceptable ID Documents:</p>
             <p>Driver's License, Passport, National ID, SSS ID, PhilHealth ID, or any government-issued ID with photo</p>
           </div>
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
               className={`w-full pl-12 pr-5 py-4 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base`}
               placeholder="your.email@example.com"
             />
           </div>
           {errors.email && (
             <div className="flex items-center mt-2 text-red-600">
               <AlertCircle className="w-4 h-4 mr-2" />
               <span className="text-sm">{errors.email}</span>
             </div>
           )}
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
               className={`w-full pl-12 pr-5 py-4 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base`}
               placeholder="+63 912 345 6789"
             />
           </div>
           {errors.phone && (
             <div className="flex items-center mt-2 text-red-600">
               <AlertCircle className="w-4 h-4 mr-2" />
               <span className="text-sm">{errors.phone}</span>
             </div>
           )}
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
             className={`w-full px-5 py-4 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base`}
             placeholder="Enter your city"
           />
           {errors.city && (
             <div className="flex items-center mt-2 text-red-600">
               <AlertCircle className="w-4 h-4 mr-2" />
               <span className="text-sm">{errors.city}</span>
             </div>
           )}
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
               className={`w-full pl-12 pr-5 py-4 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-base`}
               placeholder="Enter your complete address"
             />
           </div>
           {errors.address && (
             <div className="flex items-center mt-2 text-red-600">
               <AlertCircle className="w-4 h-4 mr-2" />
               <span className="text-sm">{errors.address}</span>
             </div>
           )}
         </div>
       </div>
     </div>

     {/* Employment Information */}
     <div className="bg-green-50 rounded-xl p-6">
       <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
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
             className={`w-full px-5 py-4 border ${errors.employer ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base`}
             placeholder="Company name"
           />
           {errors.employer && (
             <div className="flex items-center mt-2 text-red-600">
               <AlertCircle className="w-4 h-4 mr-2" />
               <span className="text-sm">{errors.employer}</span>
             </div>
           )}
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
             className={`w-full px-5 py-4 border ${errors.jobTitle ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base`}
             placeholder="Your position"
           />
           {errors.jobTitle && (
             <div className="flex items-center mt-2 text-red-600">
               <AlertCircle className="w-4 h-4 mr-2" />
               <span className="text-sm">{errors.jobTitle}</span>
             </div>
           )}
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
             className={`w-full px-5 py-4 border ${errors.employmentType ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base`}
           >
             <option value="" disabled>Select Type</option>
             <option value="full-time">Full-time</option>
             <option value="part-time">Part-time</option>
             <option value="contract">Contract</option>
             <option value="self-employed">Self-employed</option>
             <option value="freelance">Freelance</option>
           </select>
           {errors.employmentType && (
             <div className="flex items-center mt-2 text-red-600">
               <AlertCircle className="w-4 h-4 mr-2" />
               <span className="text-sm">{errors.employmentType}</span>
             </div>
           )}
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
             className={`w-full px-5 py-4 border ${errors.yearsEmployed ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base`}
           >
             <option value="" disabled>Select Years</option>
             <option value="less-than-1">Less than 1 year</option>
             <option value="1-2">1-2 years</option>
             <option value="3-5">3-5 years</option>
             <option value="6-10">6-10 years</option>
             <option value="more-than-10">More than 10 years</option>
           </select>
           {errors.yearsEmployed && (
             <div className="flex items-center mt-2 text-red-600">
               <AlertCircle className="w-4 h-4 mr-2" />
               <span className="text-sm">{errors.yearsEmployed}</span>
             </div>
           )}
         </div>
       </div>
     </div>

     {/* Financial Information */}
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
             className={`w-full px-5 py-4 border ${errors.monthlyIncome ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base`}
             placeholder="₱50,000"
           />
           {errors.monthlyIncome && (
             <div className="flex items-center mt-2 text-red-600">
               <AlertCircle className="w-4 h-4 mr-2" />
               <span className="text-sm">{errors.monthlyIncome}</span>
             </div>
           )}
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
             className={`w-full px-5 py-4 border ${errors.otherIncome ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base`}
             placeholder="₱0"
           />
           {errors.otherIncome && (
             <div className="flex items-center mt-2 text-red-600">
               <AlertCircle className="w-4 h-4 mr-2" />
               <span className="text-sm">{errors.otherIncome}</span>
             </div>
           )}
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
             className={`w-full px-5 py-4 border ${errors.loanAmount ? 'border-red-500' : 'border-gray-300'} bg-gray-100 text-gray-500 rounded-lg focus:ring-0 focus:border-gray-300 transition-all duration-200 text-base`}
             placeholder="0"
           />
           {errors.loanAmount && (
             <div className="flex items-center mt-2 text-red-600">
               <AlertCircle className="w-4 h-4 mr-2" />
               <span className="text-sm">{errors.loanAmount}</span>
             </div>
           )}
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
             className={`w-full px-5 py-4 border ${errors.loanTerm ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base`}
           >
             <option value="" disabled>Select Term</option>
             <option value="12">12 months</option>
             <option value="24">24 months</option>
             <option value="36">36 months</option>
             <option value="48">48 months</option>
             <option value="60">60 months</option>
             <option value="72">72 months</option>
           </select>
           {errors.loanTerm && (
             <div className="flex items-center mt-2 text-red-600">
               <AlertCircle className="w-4 h-4 mr-2" />
               <span className="text-sm">{errors.loanTerm}</span>
             </div>
           )}
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
           {errors.hasOtherLoans && (
             <div className="flex items-center mt-2 text-red-600">
               <AlertCircle className="w-4 h-4 mr-2" />
               <span className="text-sm">{errors.hasOtherLoans}</span>
             </div>
           )}
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
         {errors.agreeToTerms && (
           <div className="flex items-center mt-2 text-red-600">
             <AlertCircle className="w-4 h-4 mr-2" />
             <span className="text-sm">{errors.agreeToTerms}</span>
           </div>
         )}
       </div>
     </div>

     {/* Submit Button */}
     <div className="flex justify-center pt-6">
       <button
         type="submit"
         onClick={handleSubmit}
         disabled={isSubmitting || !formData.agreeToTerms  || Object.values(errors).some(error => error)}
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
     {checkRequiredFields() && (
  <div className="flex items-center justify-center text-red-600 mb-4">
    <AlertCircle className="w-5 h-5 mr-2" />
    <span className="text-sm font-medium">* Please fill out all required fields.</span>
  </div>
)}
   </div>
   </div>
    </>
  )
}

export default LoanApplicationForm