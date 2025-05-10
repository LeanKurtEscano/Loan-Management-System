import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMyContext } from '../../context/MyContext';
import { loginAdmin, sendEmailAdmin } from '../../services/admin/adminAuth';
import Logo from '../../assets/tuloan3.png';

const AdminLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { isAdminAuthenticated, setIsAdminAuthenticated } = useMyContext();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();



  const emailVerify = () => {
    navigate('/admin-email-verification');
  }

  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/dashboard/analytics');
    }
  }, [isAdminAuthenticated, navigate]);

  const loginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!username.trim()) {
      setEmailError("Username is required");
      return;
    }
    
    if (!password.trim()) {
      setPasswordError("Password is required");
      return;
    }
    
    setLoading(true);
    setEmailError("");
    setPasswordError("");

    try {
      const response = await loginAdmin({ username, password });
      
      if (response.status === 200) {
        localStorage.setItem("admin_token", response.data.access_token);
        localStorage.setItem("admin_refresh_token", response.data.refresh_token);
        setIsAdminAuthenticated(true);
        navigate('/dashboard/analytics');
      }
    } catch (error: any) {
      if (error.response) {
        const { data, status } = error.response;
        if (status === 403) {
          setPasswordError(data.error);
        } else if (status === 404) {
          setEmailError(data.error);
        }
      } else {
        setEmailError("Connection error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="px-8 pt-8 pb-6 text-center">
        <div className="flex justify-center mb-6">
          <img src={Logo} alt="TuLoan Logo" className="h-28 w-28 object-contain" />
        </div>
        
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Portal</h1>
          <p className="text-gray-500 text-sm mb-6">Sign in to your admin dashboard</p>
        </div>
        
        <form onSubmit={loginSubmit} className="px-8 pb-8">
          <div className="mb-5">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className={`w-full px-4 py-3 bg-gray-50 rounded-lg border ${
                  emailError ? 'border-red-400' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
              />
              {emailError && (
                <div className="flex items-center mt-1 text-sm text-red-500">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {emailError}
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <button 
                type="button" 
                onClick={emailVerify}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 bg-gray-50 rounded-lg border ${
                  passwordError ? 'border-red-400' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-2.891 0-5.729-1.313-7.749-3.759-.834-1.005-.834-2.477 0-3.482C6.271 9.313 9.109 8 12 8c2.891 0 5.729 1.313 7.749 3.759.834 1.005.834 2.477 0 3.482M13.875 18.825C13.257 18.937 12.634 19 12 19c-2.891 0-5.729-1.313-7.749-3.759-.834-1.005-.834-2.477 0-3.482C6.271 9.313 9.109 8 12 8c.634 0 1.257.063 1.875.175" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
              {passwordError && (
                <div className="flex items-center mt-1 text-sm text-red-500">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {passwordError}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-6 flex justify-center items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center text-sm text-gray-600">
          Admin access only. Contact IT support for assistance.
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;