import React, { useState } from 'react';
import { Car, Filter, Search, Calendar, DollarSign, Percent, Eye, Heart, ArrowLeft } from 'lucide-react';

// Mock data based on your API structure
const mockCarsData = [
  {
    id: 1,
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
  },
  {
    id: 2,
    car_id: 102,
    make: "Honda",
    model: "Civic",
    year: 2023,
    color: "White",
    license_plate: "DEF456",
    loan_sale_price: 980000,
    commission_rate: 0.045,
    date_offered: "2024-01-20T14:15:00",
    description: "Sporty and fuel-efficient, ideal for city driving",
    image_url: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&h=300&fit=crop"
  },
  {
    id: 3,
    car_id: 103,
    make: "Nissan",
    model: "Altima",
    year: 2021,
    color: "Black",
    license_plate: "GHI789",
    loan_sale_price: 1100000,
    commission_rate: 0.055,
    date_offered: "2024-01-18T09:45:00",
    description: "Luxurious interior with advanced safety features",
    image_url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop"
  },
  {
    id: 4,
    car_id: 104,
    make: "Hyundai",
    model: "Elantra",
    year: 2023,
    color: "Blue",
    license_plate: "JKL012",
    loan_sale_price: 850000,
    commission_rate: 0.04,
    date_offered: "2024-01-22T16:20:00",
    description: "Brand new with warranty, excellent fuel economy",
    image_url: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=300&fit=crop"
  },
  {
    id: 5,
    car_id: 105,
    make: "Mazda",
    model: "CX-5",
    year: 2022,
    color: "Red",
    license_plate: "MNO345",
    loan_sale_price: 1450000,
    commission_rate: 0.06,
    date_offered: "2024-01-25T11:30:00",
    description: "SUV with spacious interior and all-wheel drive",
    image_url: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=500&h=300&fit=crop"
  },
  {
    id: 6,
    car_id: 106,
    make: "Subaru",
    model: "Outback",
    year: 2021,
    color: "Green",
    license_plate: "PQR678",
    loan_sale_price: 1320000,
    commission_rate: 0.052,
    date_offered: "2024-01-28T13:45:00",
    description: "Adventure-ready with excellent ground clearance",
    image_url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop"
  }
];

const CarListing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [cars] = useState(mockCarsData);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
     

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Cars for Loan</h1>
          <p className="text-gray-600">Choose from our selection of quality vehicles with competitive loan rates</p>
        </div>

        {/* Filters */}
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

        {/* Car Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <div key={car.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative">
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
              
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {car.make} {car.model}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">{car.color} • {car.license_plate}</p>
                  <p className="text-gray-600 text-sm line-clamp-2">{car.description}</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(car.loan_sale_price)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Percent className="w-4 h-4" />
                      <span>{(car.commission_rate * 100).toFixed(1)}% commission</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(car.date_offered)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
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
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <button className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
          <DollarSign className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default CarListing;