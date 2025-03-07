import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendEmail } from '../../services/user/userAuth';

const EmailForm = () => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const navigate = useNavigate();

    const submitEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError("");

        try {
            const response = await sendEmail(email);
            if (response.status === 200) {
                sessionStorage.setItem("email", email);
                navigate('/otp');
            }
        } catch (error: any) {
            if (error.response) {
                if (error.response.status === 404) {
                    setEmailError("Email is not registered");
                } else {
                    alert(error.response.data.error || 'Something went wrong');
                }
            } else {
                alert('Network error. Please try again later.');
            }
        }
    };

    return (
        <section className='flex items-center min-h-screen justify-center bg-gray-100 p-6'>
            <div className="relative border bg-white border-gray-300 rounded-lg shadow-lg px-8 pt-10 pb-10 w-full max-w-md">
                <div className="mx-auto flex flex-col space-y-6">
                    <div className="text-center">
                        <h2 className="font-bold text-gray-800 text-2xl">Forgot your Password?</h2>
                        <p className="text-gray-600 text-sm mt-1">Send a 6-digit verification code to your email address</p>
                    </div>
                    <div className='text-center'>
                        <Link to='/login' className="text-blue-600 hover:underline">← Back to Login</Link>
                    </div>
                    <form onSubmit={submitEmail} className="space-y-2">
                        <div>
                            <label htmlFor='email' className='text-gray-700 font-medium'>Email Address:</label>
                            <input 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                type='email' 
                                className='border border-gray-300 bg-gray-50 text-gray-700 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500' 
                                placeholder="Enter your email"
                            />
                        </div>
                        {emailError && <p className='text-red-600 text-sm'>{emailError}</p>}
                        <button 
                            type="submit" 
                            className="w-full py-3 cursor-pointer bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
                        >
                            Verify Account
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default EmailForm;
