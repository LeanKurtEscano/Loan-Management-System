import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { RegisterData } from "../../constants/interfaces/authInterface";
import { sendRegister } from "../../services/user/userAuth"
import { useNavigate } from "react-router-dom";
import { useMyContext } from "../../context/MyContext";
import { useEffect } from "react";

import logo2 from '../../assets/tuloan3.png'
const Register: React.FC = () => {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false)
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

      const {isAuthenticated} = useMyContext();
  
  
  
        useEffect(() => {
          if (isAuthenticated) {
            nav('/');
          }
        }, [isAuthenticated, nav]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { username: "", email: "", password: "", confirmPassword: "" };

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      valid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    if (!validateForm()) {
      setLoading(false);
      return

    }

    try {


      const response = await sendRegister(formData);

      if (response.status === 200) {
        setLoading(false);
        sessionStorage.setItem("username", formData.username);
        sessionStorage.setItem("email", formData.email);
        sessionStorage.setItem("password", formData.password);
        nav('/otp-register')

      }

    } catch (error: any) {
      setLoading(false);
      const { data, status } = error.response;
      if (status === 403) {
        setErrors((prev) => ({ ...prev, email: data.error }));
      }

      return

    }
  };

  return (
    <div className="flex w-full justify-center pt-14 pb-14 items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[450px]">
        

        <div className="flex justify-center mb-3">
                  <img  src={logo2} alt="Logo" className="h-24 w-24" />
                </div>

                <h2 className="text-xl font-semibold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit}>

          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4 relative">
            <label className="block text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full p-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>


          <div className="mb-6 relative">
            <label className="block text-gray-700">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="w-full p-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </span>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>



          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 cursor-pointer bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg aria-hidden="true" className="w-6 h-7 mr-2 text-slate-200 animate-spin dark:text-slate-100 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                Loading...
              </>
            ) : (
              "Register"
            )}
          </button>

          <div className="text-center mt-4">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Login
              </a>
            </p>
          </div>


        </form>
      </div>
    </div>
  );
};

export default Register;
