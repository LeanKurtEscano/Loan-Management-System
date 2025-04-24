import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { loginAuth } from '../../services/user/userAuth';
import { useNavigate, Link } from 'react-router-dom';
import { useMyContext } from '../../context/MyContext';

import logo2 from '../../assets/tuloan3.png'

const Login: React.FC = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useMyContext();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const toggleIcon = () => {
    setShow(!show);
  };

  const loginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    
    if (!password.trim()) {
      setPasswordError("Password is required");
      return;
    }
    
    setLoading(true);

    try {
      const response = await loginAuth({ email, password });

      if (response.data.success) {
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("password", password);
        setEmailError("");
        setPasswordError("");
        setLoading(false);
        navigate('/otp-verify');
      }
    } catch (error: any) {
      setLoading(false);
      if (error.response) {
        const { data, status } = error.response;
        console.log(data.error);
        if (status === 401) {
          setPasswordError(data.error);
        } else if (status === 404) {
          setEmailError(data.error);
        }
      }
    }
  };

  const goToVerification = () => {
    navigate('/email-verification');
  }

  return (
    <section className="min-h-screen w-full flex justify-center bg-gradient-to-b from-blue-50 to-gray-100 items-center py-8">
      <div className="flex flex-col p-8 bg-white border border-gray-200 rounded-xl shadow-lg w-full max-w-md transition-all duration-300 hover:shadow-xl">
        <div className="flex justify-center mb-6">
          <img src={logo2} alt="TuLoan Logo" className="h-28 w-28 object-contain" />
        </div>
        
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome Back
        </h2>
        
        <p className="text-center text-gray-500 mb-6">
          Log in to access your account
        </p>
        
        <div className="flex items-center justify-center mb-6">
          <p className="text-center text-gray-500 mr-1">Don't have an account?</p>
          <Link to="/register">
            <p className="text-center text-blue-600 font-medium hover:text-blue-800 hover:underline transition-colors">
              Sign up
            </p>
          </Link>
        </div>
        
        <form className="flex flex-col space-y-5" onSubmit={loginSubmit}>
          <div className="relative">
            <label htmlFor="email" className="font-medium text-gray-700 mb-1 block">
              Email Address
            </label>
            <div className="relative">
              <FontAwesomeIcon 
                icon={faEnvelope} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                id="email"
                className="border border-gray-300 text-gray-800 pl-10 rounded-lg p-3 w-full bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                autoComplete="email"
                placeholder="your.email@example.com"
              />
            </div>
            {emailError && (
              <p className="text-red-500 text-sm mt-1 ml-1">{emailError}</p>
            )}
          </div>
          
          <div className="relative">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="font-medium text-gray-700 block">
                Password
              </label>
              <div onClick={goToVerification} className="cursor-pointer">
                <p className="text-blue-600 text-sm font-medium hover:text-blue-800 hover:underline transition-colors">
                  Forgot Password?
                </p>
              </div>
            </div>
            <div className="relative">
              <FontAwesomeIcon 
                icon={faLock} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
                type={show ? 'text' : 'password'}
                id="password"
                className="border border-gray-300 text-gray-800 pl-10 pr-10 rounded-lg p-3 w-full bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                placeholder="••••••••"
              />
              <FontAwesomeIcon
                icon={show ? faEyeSlash : faEye}
                onClick={toggleIcon}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                style={{ cursor: 'pointer' }}
              />
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm mt-1 ml-1">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg aria-hidden="true" className="w-5 h-5 mr-2 text-white animate-spin fill-blue-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            By logging in, you agree to our 
            <Link to="/terms" className="text-blue-600 hover:underline mx-1">Terms of Service</Link>
            and
            <Link to="/privacy" className="text-blue-600 hover:underline mx-1">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;