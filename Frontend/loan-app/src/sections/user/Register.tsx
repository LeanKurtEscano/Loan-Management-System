import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faUser, faEnvelope, faLock, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { RegisterData } from "../../constants/interfaces/authInterface";
import { sendRegister } from "../../services/user/userAuth";
import { useNavigate, Link } from "react-router-dom";
import { useMyContext } from "../../context/MyContext";
import { validateEmail } from "../../utils/validation";
import { validateUsername } from "../../utils/validation";
import logo2 from '../../assets/tuloan3.png';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<RegisterData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { isAuthenticated } = useMyContext();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { username: "", email: "", password: "", confirmPassword: "" };

    // Validate username using your validation function
    const usernameError = validateUsername(formData.username);
    if (usernameError) {
      newErrors.username = usernameError;
      valid = false;
    }

    // Validate email using your validation function
    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
      valid = false;
    }
    
    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }
    
    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
      valid = false;
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await sendRegister(formData);

      if (response.status === 200) {
        sessionStorage.setItem("username", formData.username);
        sessionStorage.setItem("email", formData.email);
        sessionStorage.setItem("password", formData.password);
        setLoading(false);
        navigate('/otp-register');
      }
    } catch (error: any) {
      setLoading(false);
      if (error.response) {
        const { data, status } = error.response;
        if (status === 403) {
          setErrors((prev) => ({ ...prev, email: data.error }));
        }

        if (status === 400) {
          setErrors((prev) => ({ ...prev, username: data.error }));
        }
      }
    }
  };

  return (
    <section className="min-h-screen w-full flex justify-center bg-gradient-to-b from-blue-50 to-gray-100 items-center py-8">
      <div className="flex flex-col p-8 bg-white border border-gray-200 rounded-xl shadow-lg w-full max-w-md transition-all duration-300 hover:shadow-xl">
        <div className="flex justify-center mb-6">
          <img src={logo2} alt="TuLoan Logo" className="h-28 w-28 object-contain" />
        </div>
        
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create Account
        </h2>
        
        <p className="text-center text-gray-500 mb-6">
          Join us today and start your journey
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          {/* Username Field */}
          <div className="relative">
            <label htmlFor="username" className="font-medium text-gray-700 mb-1 block">
              Username
            </label>
            <div className="relative">
              <FontAwesomeIcon 
                icon={faUser} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                id="username"
                name="username"
                className={`border ${errors.username ? 'border-red-500' : 'border-gray-300'} text-gray-800 pl-10 rounded-lg p-3 w-full bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300`}
                placeholder="Type your username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm mt-1 ml-1">{errors.username}</p>
            )}
          </div>

          {/* Email Field */}
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
                id="email"
                name="email"
                className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} text-gray-800 pl-10 rounded-lg p-3 w-full bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300`}
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 ml-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="relative">
            <label htmlFor="password" className="font-medium text-gray-700 mb-1 block">
              Password
            </label>
            <div className="relative">
              <FontAwesomeIcon 
                icon={faLock} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className={`border ${errors.password ? 'border-red-500' : 'border-gray-300'} text-gray-800 pl-10 pr-10 rounded-lg p-3 w-full bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300`}
                placeholder="Create a secure password"
                value={formData.password}
                onChange={handleChange}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                style={{ cursor: 'pointer' }}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 ml-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <label htmlFor="confirmPassword" className="font-medium text-gray-700 mb-1 block">
              Confirm Password
            </label>
            <div className="relative">
              <FontAwesomeIcon 
                icon={faCheckCircle} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                className={`border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} text-gray-800 pl-10 pr-10 rounded-lg p-3 w-full bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300`}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                style={{ cursor: 'pointer' }}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1 ml-1">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="mt-2">
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
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>
        
        <div className="flex items-center justify-center mt-6">
          <p className="text-center text-gray-500 mr-1">Already have an account?</p>
          <Link to="/login">
            <p className="text-center text-blue-600 font-medium hover:text-blue-800 hover:underline transition-colors">
              Log in
            </p>
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            By creating an account, you agree to our 
            <Link to="/terms" className="text-blue-600 hover:underline mx-1">Terms of Service</Link>
            and
            <Link to="/privacy" className="text-blue-600 hover:underline mx-1">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;