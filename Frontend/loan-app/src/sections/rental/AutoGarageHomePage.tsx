import React from 'react';
import { Car, Shield, Clock, DollarSign, CheckCircle, Star, ArrowRight } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const loanFeatures = [
  {
    icon: DollarSign,
    title: 'Low Interest Rates',
    description: 'Starting from 8.9% per annum with flexible payment terms up to 5 years.'
  },
  {
    icon: Clock,
    title: 'Quick Approval',
    description: 'Get pre-approved in as fast as 24 hours with minimal requirements.'
  },
  {
    icon: Shield,
    title: 'Secure Process',
    description: 'Your data is protected with bank-level security and encryption.'
  }
];

// Loan options data
const loanOptions = [
  {
    title: 'Brand New & Used Cars',
    description: 'Finance both new and pre-owned vehicles from trusted dealers.'
  },
  {
    title: 'Up to 80% Financing',
    description: 'Low down payment options starting from 20% of vehicle value.'
  },
  {
    title: 'Flexible Terms',
    description: 'Choose payment terms from 1 to 5 years that fit your budget.'
  }
];

// Simple animation components (since we can't import framer-motion)
const FadeInUp = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef();

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const ScaleIn = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef();

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${
        isVisible 
          ? 'opacity-100 scale-100' 
          : 'opacity-0 scale-95'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const AutoGarageHomepage = () => {
    const navigate = useNavigate();

    const goToCarList = () => {
        navigate('/user/car-list');    
    }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
     
      {/* Hero Section */}
      <section className="relative py-20 px-8 sm:px-12 lg:px-16 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <FadeInUp>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Drive Your Dream Car
              <span className="block pb-2.5 text-blue-600 mt-2 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Sa JDM Car Rentals!
              </span>
            </h1>
          </FadeInUp>
          
          <FadeInUp delay={200}>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get pre-approved car loans with competitive rates. Choose from our wide selection 
              of quality vehicles and drive home today with flexible payment terms.
            </p>
          </FadeInUp>
          
          <FadeInUp delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button onClick = {goToCarList}className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 transform hover:scale-105 hover:shadow-lg group">
                View Available Cars
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105">
                Calculate Loan
              </button>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Loan Features */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-16">
          <FadeInUp>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose JDM Car Rentals?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We make car financing simple and accessible with transparent terms and competitive rates.
              </p>
            </div>
          </FadeInUp>

          <div className="grid md:grid-cols-3 gap-8">
            {loanFeatures.map((feature, index) => (
              <ScaleIn key={index} delay={index * 100}>
                <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 group">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-300 transform group-hover:scale-110">
                    <feature.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </ScaleIn>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Details */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeInUp>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Flexible Loan Options</h2>
                <div className="space-y-4">
                  {loanOptions.map((option, index) => (
                    <div key={index} className="flex items-start gap-3 group">
                      <CheckCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                      <div>
                        <h4 className="font-semibold text-gray-900">{option.title}</h4>
                        <p className="text-gray-600">{option.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInUp>

            <ScaleIn delay={200}>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Loan Calculator</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Car Price</label>
                    <input 
                      type="text" 
                      placeholder="₱1,000,000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment</label>
                    <input 
                      type="text" 
                      placeholder="₱200,000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                      <option>3 years</option>
                      <option>4 years</option>
                      <option>5 years</option>
                    </select>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                    Calculate Monthly Payment
                  </button>
                </div>
              </div>
            </ScaleIn>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-5xl mx-auto text-center px-8 sm:px-12 lg:px-16 relative z-10">
          <FadeInUp>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Your Car Loan?
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Browse our available cars or apply for pre-approval today.
            </p>
          </FadeInUp>
          
          <FadeInUp delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                Browse Cars
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                Apply Now
              </button>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Company Info Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-16">
          <div className="grid md:grid-cols-2 gap-8">
            <FadeInUp>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 h-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Car className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">JDM Car Rentals</h3>
                    <p className="text-blue-600 font-semibold">Your Trusted Car Financing Partner</p>
                  </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  We specialize in providing affordable and flexible car financing solutions to help you drive your dream vehicle. With competitive interest rates and personalized service, we make car ownership accessible for everyone.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">Over 5 years of trusted service</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">10,000+ satisfied customers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">Licensed and regulated financing</span>
                  </div>
                </div>
              </div>
            </FadeInUp>

            <FadeInUp delay={200}>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 h-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Contact Information</h3>
                    <p className="text-gray-600 font-semibold">Get in Touch With Us</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-lg">📞</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                      <p className="text-gray-700">(02) 8123-4567</p>
                      <p className="text-sm text-gray-500">Mon-Fri 8AM-6PM, Sat 9AM-3PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-lg">✉️</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                      <p className="text-gray-700">info@autogarage.com</p>
                      <p className="text-sm text-gray-500">We respond within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-lg">📍</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Office</h4>
                      <p className="text-gray-700">Makati City, Philippines</p>
                      <p className="text-sm text-gray-500">Visit us for personalized consultation</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInUp>
          </div>
          
          <FadeInUp delay={400}>
            <div className="text-center mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-500">&copy; 2024 JDM Car Rentals. All rights reserved.</p>
            </div>
          </FadeInUp>
        </div>
      </section>
    </div>
  );
};

export default AutoGarageHomepage;