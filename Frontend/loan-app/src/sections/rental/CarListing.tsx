import React, { useState } from 'react';
import { Car, Filter, Search, Calendar, DollarSign, Percent, Eye, Heart, ArrowLeft, AlertCircle, ArrowRight } from 'lucide-react';
import { getCars } from '../../services/rental/Cars';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchCarLoanDisbursement } from '../../services/rental/carDisbursement';

const CarListing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const { data: cars = [], isLoading, error } = useQuery({
    queryKey: ['cars'],
    queryFn: getCars,
  });

  const {data: carsDisbursement, isLoading: isLoadingDisbursement, error: errorDisbursement} = useQuery({
    queryKey: ['carsDisbursementData'],
    queryFn: fetchCarLoanDisbursement,
  })

  console.log(carsDisbursement)

  const navigate = useNavigate();

  const applyForLoan = (carId: number) => {
    navigate(`/user/car-list/${carId}`);
  }

  const goToActiveLoan = () => {
  
    navigate('/user/my-car-loan');
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredCars = cars.filter(car => {
    const matchesSearch = 
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.color.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMake = selectedMake ? car.make === selectedMake : true;
    
    const matchesPrice = priceRange ? 
      (priceRange === 'under1M' && car.loan_sale_price < 1000000) ||
      (priceRange === '1M-1.5M' && car.loan_sale_price >= 1000000 && car.loan_sale_price <= 1500000) ||
      (priceRange === 'over1.5M' && car.loan_sale_price > 1500000)
      : true;

    return matchesSearch && matchesMake && matchesPrice;
  });

  const uniqueMakes = [...new Set(cars.map(car => car.make))];


  const hasActiveLoan = carsDisbursement && carsDisbursement.is_active === true;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-8">
        
        {hasActiveLoan ? (
        
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">You Have an Ongoing Car Loan</h2>
              <p className="text-gray-600 mb-6">
                You currently have an active car loan. Please complete your existing loan before applying for a new one.
              </p>
              <div className="flex justify-center mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 inline-flex items-center gap-2 text-blue-700">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium text-sm">Active Loan Status</span>
                </div>
              </div>
            </div>
            <button 
              onClick={goToActiveLoan}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              View Active Loan
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
       
          <>
           
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Cars for Loan</h1>
              <p className="text-gray-600">Choose from our selection of quality vehicles with competitive loan rates</p>
            </div>

         
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search make, model, color..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={selectedMake}
                  onChange={(e) => setSelectedMake(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Makes</option>
                  {uniqueMakes.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
                
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Prices</option>
                  <option value="under1M">Under ₱1M</option>
                  <option value="1M-1.5M">₱1M - ₱1.5M</option>
                  <option value="over1.5M">Over ₱1.5M</option>
                </select>
                
                <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  <Filter className="w-5 h-5" />
                  Filter
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredCars.length} of {cars.length} available cars
              </p>
            </div>

            {/* Car Grid - Fixed for uniform height */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <div key={car.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full">
                  {/* Image Section - Fixed height */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={car.image_url}
                      alt={`${car.year} ${car.make} ${car.model}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {car.year}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content Section - Flexible height with fixed structure */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Car Details - Fixed height section */}
                    <div className="mb-4 flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
                        {car.make} {car.model}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                        {car.color} • {car.license_plate}
                      </p>
                      <p className="text-gray-600 text-sm line-clamp-2 min-h-[2.5rem]">
                        {car.description}
                      </p>
                    </div>
                    
                    {/* Price and Info Section - Fixed height */}
                    <div className="space-y-3 mb-6 flex-shrink-0">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600">
                          {formatPrice(car.loan_sale_price)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Percent className="w-4 h-4" />
                          <span>{((car.commission_rate )).toFixed(1)}% commission</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(car.date_offered)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons - Fixed at bottom */}
                    <div className="flex gap-3 mt-auto">
                      <button 
                        onClick={() => applyForLoan(car.id)} 
                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Apply for Loan
                      </button>
                      <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Eye className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredCars.length === 0 && (
              <div className="text-center py-12">
                <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No cars found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search filters to find more cars.</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedMake('');
                    setPriceRange('');
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Floating Action Button */}
            <div className="fixed bottom-6 right-6">
              <button className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CarListing;