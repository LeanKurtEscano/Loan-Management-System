import React, { useState, FormEvent, ChangeEvent } from 'react';
import { validateEmail } from '../../utils/validation';
import { validateFirstName } from '../../utils/validation';
import { userApi } from '../../services/axiosConfig';
interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
}


interface FormErrors {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  }
  
const Support: React.FC = () => {
const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (validateFirstName(formData.name)) {
      errors.name = validateFirstName(formData.name);
    }

    if (validateEmail(formData.email)) {
      errors.email = validateEmail(formData.email);
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required.';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message cannot be empty.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    if (!validateForm()) {
        setIsLoading(false);
        return;
      }
    try {

        const response = await userApi.post('/support/', formData)
        if(response.status === 200)
     
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
    } catch (error) {
      console.error('Error sending email:', error);
      setError('Failed to send your request. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen">
      {/* Header */}
      <header className="bg-blue-600 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Customer Support</h1>
          <p className="mt-2">We're here to help with your loan inquiries</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Support Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">How We Can Help</h2>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">Common Questions</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-2 mt-1">?</div>
                  <div>
                    <strong>How do I apply for a loan?</strong>
                    <p className="text-gray-600">Visit our Get Started page and follow the application process.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-2 mt-1">?</div>
                  <div>
                    <strong>What are the interest rates?</strong>
                    <p className="text-gray-600">Our rates vary based on loan type and term. Check our rates page for details.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-2 mt-1">?</div>
                  <div>
                    <strong>How long does approval take?</strong>
                    <p className="text-gray-600">Most applications are processed within minutes to 24 hours.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">Contact Methods</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-blue-600">support@toloan.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-blue-600">(02) 8123-4567</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-2">Loan Management Tips</h3>
              <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Always check your payment due dates</li>
                  <li>Set up automatic payments to avoid late fees</li>
                  <li>Monitor your credit score regularly</li>
                  <li>Contact us early if you anticipate payment difficulties</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-600 mb-2">Support Request Sent!</h3>
                <p className="text-gray-600 mb-4">Thank you for reaching out. Our team will contact you within 24 hours.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-blue-800 mb-4">Send Us a Message</h2>
                <p className="text-gray-600 mb-6">Fill out the form below and our support team will get back to you as soon as possible.</p>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                      {formErrors.name && <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>}

                  </div>
                
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                           {formErrors.email && <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>}
                  </div>
           

                  <div className="mb-4">
                    <label htmlFor="category" className="block text-gray-700 font-medium mb-1">Support Category</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="general">General Inquiry</option>
                      <option value="application">Loan Application</option>
                      <option value="payment">Payment Issues</option>
                      <option value="account">Account Management</option>
                      <option value="technical">Technical Support</option>
                    </select>
                   
                  </div>
               
                  <div className="mb-4">
                    <label htmlFor="subject" className="block text-gray-700 font-medium mb-1">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                        {formErrors.subject && <p className="text-red-600 text-sm mt-1">{formErrors.subject}</p>}
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-1">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    ></textarea>
                       {formErrors.message && <p className="text-red-600 text-sm mt-1">{formErrors.message}</p>}

                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Submit Support Request'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-10 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-6">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">What documents do I need to apply for a loan?</h3>
              <p className="text-gray-600">For standard loans, you'll need a valid government ID, proof of income (such as payslips or bank statements), and proof of address. Additional documents may be required depending on the loan type and amount.</p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">How do I check my loan status?</h3>
              <p className="text-gray-600">You can check your loan status by logging into your account dashboard. Navigate to "My Applications" to see the current status of all your loan applications.</p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">Can I pay off my loan early?</h3>
              <p className="text-gray-600">Yes, you can pay off your loan before the end of the term. There may be prepayment fees depending on your loan agreement. Contact our support team for the exact amount needed to close your loan.</p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">What happens if I miss a payment?</h3>
              <p className="text-gray-600">Missing a payment may result in late fees and could affect your credit score. If you anticipate difficulty making a payment, please contact our support team immediately to discuss possible solutions.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-2">How secure is my information?</h3>
              <p className="text-gray-600">We employ industry-standard encryption and security measures to protect your personal and financial information. Our systems are regularly audited to ensure compliance with data protection regulations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;