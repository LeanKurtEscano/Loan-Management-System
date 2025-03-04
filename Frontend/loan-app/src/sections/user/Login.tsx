import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { loginAuth } from '../../services/userAuth';
import { useNavigate, Link } from 'react-router-dom';
import { useMyContext } from '../../context/MyContext';



const Login: React.FC = () => {
  const [show, setShow] = useState(false);
  const { setIsAuthenticated } = useMyContext();
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const toggleIcon = () => {
    setShow(!show);
  };

  const loginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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


  return (
    <section className="h-screen w-full flex bg-gray-100 justify-center items-center">
      <div className="flex flex-col p-6 border-gray-300 bg-white border-2 rounded-lg shadow-xl w-96">
        <div className="flex justify-center mb-3">
          <img alt="Logo" className="h-10" />
        </div>
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Log in
        </h2>
        <div className="flex items-center justify-center flex-row mb-2">
          <p className="text-center text-gray-500 mr-1">or </p>
          <Link to="/verify-otp">
            <p className="text-center text-blue-600 hover:underline">
              sign up for an account
            </p>
          </Link>
        </div>
        <form className="flex flex-col" onSubmit={loginSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2 text-gray-700">
              Email Address:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="username"
              className="border border-gray-300 text-gray-800 placeholder-gray-400 rounded p-2 w-full bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              autoComplete="off"
              placeholder="Enter your email"
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>
          <div className='mb-2 relative'>
            <label htmlFor='password' className='block mb-2 text-gray-700'>Password:</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={show ? 'text' : 'password'}
              id='password'
              className='border border-gray-300 bg-inputcolor text-gray-800 placeholder-gray-400  bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 rounded p-2 pr-10 w-full'
              placeholder='Enter your password'
            />
            <FontAwesomeIcon
              icon={show ? faEyeSlash : faEye}
              onClick={toggleIcon}
              className="absolute right-2  top-1/2 pt-2"
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div className='flex flex-row'>
            {
              passwordError && (
                <p className='text-red-600'>{passwordError}</p>
              )
            }



          </div>
          <div className='flex items-end justify-end pr-2'>
            <p className='text-textHeading cursor-pointer '>Forgot Password?</p>
          </div>


          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-blue-600 mt-4 text-white rounded p-2 hover:opacity-90 transition duration-300 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="mr-2 animate-spin"
                  viewBox="0 0 1792 1792"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"></path>
                </svg>
                Loading...
              </>
            ) : (
              "Log in"
            )}
          </button>
        </form>
      </div>
    </section>


  );
}

export default Login;