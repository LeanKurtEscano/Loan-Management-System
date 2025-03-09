import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { loginAuth } from '../../services/user/userAuth';
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

  const goToVerification = () => {
    navigate('/email-verification');
  }

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
          <Link to="/register">
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
          <div onClick={goToVerification} className='flex items-end justify-end pr-2'>
            <p className='text-textHeading cursor-pointer '>Forgot Password?</p>
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
              "Login"
            )}
          </button>

        </form>
      </div>
    </section>


  );
}

export default Login;