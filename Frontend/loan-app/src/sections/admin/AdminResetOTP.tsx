import React, { useState, useEffect, useRef } from 'react';
import { useMyContext } from '../../context/MyContext';
import { useNavigate } from 'react-router-dom';
import Notification from '../../components/Notification';
import { userEmailResendReset } from '../../services/user/userAuth';
import { OtpDetails } from '../../constants/interfaces/authInterface';
import { adminEmailResendReset, verifyAdminOtpReset } from '../../services/admin/adminAuth';

const AdminResetOTP: React.FC = () => {
    const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''));
    const [invalid, setInvalid] = useState('');

    const [timer, setTimer] = useState(120);
    const [isResendDisabled, setIsResendDisabled] = useState(true); // Start with resend disabled
    const { isAdminAuthenticated } = useMyContext();
    // @ts-ignore
    const [expired, setExpired] = useState(false);
    const [toggleNotif, setToggleNotif] = useState(false);
    const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(6).fill(null));
    const heading = "OTP Sent!"
    const message = "A new OTP has been sent to your registered email."
    const navigate = useNavigate();

    useEffect(() => {
        if (isAdminAuthenticated) {
            navigate('/dashboard-analytics');
        }
    }, [isAdminAuthenticated, navigate]);

    // Start the timer as soon as component mounts
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;

        // Always start the timer when component mounts
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        setIsResendDisabled(false);
                        if (interval) clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timer]);

    useEffect(() => {
        if (toggleNotif) {
            const timeout = setTimeout(() => {
                setToggleNotif(false);
            }, 5000);

            return () => clearTimeout(timeout);
        }
    }, [toggleNotif]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (/^[0-9]?$/.test(value)) {
            const newOtpValues = [...otpValues];
            newOtpValues[index] = value;
            setOtpValues(newOtpValues);
        }

        if (value !== '' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setInvalid('');

        const userEmail = sessionStorage.getItem("admin_email") ?? "";
        const otpCode = otpValues.join('');

        const data: OtpDetails = {
            email: userEmail,
            otpCode: otpCode,
        }

        try {
            const response = await verifyAdminOtpReset(data);

            if (response.status === 200) {
                setTimer(120);
                navigate('/reset-admin-password');
            }
        } catch (error: any) {
            const { status, data } = error.response;

            if (status === 400) {
                setInvalid(data.error);
            } else if (status === 401) {
                setInvalid(data.error);
            } else if (status === 404) {
                setInvalid(data.error);
            } else if (status === 500) {
                setInvalid(data.error);
            } else {
                alert("Lexscribe is under maintenance. Please try again later.");
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && otpValues[index] === '') {
            // Move to the previous input box if backspace is pressed
            if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleResendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setInvalid('');

        try {
            const response = await adminEmailResendReset();

            if (response.status === 200) {
                setToggleNotif(true);
                setIsResendDisabled(true);
                setTimer(120); // Reset timer when OTP is resent
            }
        } catch (error: any) {
            if (!error.response) {
                alert("No response received. Check your internet connection.");
                return;
            }

            const { status, data } = error.response;

            switch (status) {
                case 400:
                    setInvalid(data.error);
                    break;
                case 401:
                    setInvalid(data.error);
                    break;
                case 404:
                    setInvalid(data.error);
                    break;
                case 500:
                    setInvalid(data.error);
                    break;
                default:
                    alert("Lexscribe is under maintenance. Please try again later.");
            }
        }
    }

    return (
        <section className="flex items-center min-h-screen justify-center bg-white">
            <div className="relative border border-gray-300 bg-white rounded-lg shadow-lg px-6 pt-6 pb-9 mx-auto w-full max-w-lg">
                <div className="mx-auto flex w-full max-w-md flex-col space-y-9">

                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                        <div className="font-bold text-gray-800 text-3xl">
                            <p>Reset Your Admin Account Password</p>
                        </div>
                        <div className="flex flex-row text-sm font-medium text-gray-600">
                            <p>We have sent a 6-digit verification code to your email address</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col space-y-2">

                            <div className="flex flex-row justify-between mx-auto w-full max-w-sm space-x-4">
                                {[...Array(6)].map((_, index) => (
                                    <div key={index} className=" h-14 flex justify-center">
                                        <input
                                            ref={(el) => { inputRefs.current[index] = el; }}
                                            className="w-full h-full text-center text-xl font-semibold border-2 border-gray-300 rounded-lg shadow-sm bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                            type="text"
                                            maxLength={1}
                                            value={otpValues[index]}
                                            onChange={(e) => handleChange(e, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                        />
                                    </div>
                                ))}
                            </div>

                            {invalid && (
                                <div className=" pl-8 ">
                                    <p className="text-md text-red-600">{invalid}</p>
                                </div>
                            )}

                            {timer > 0 && (
                            <div className="flex items-end justify-end pr-4 mt-2">
                                {/* Always show the timer countdown */}
                                <p className="text-blue-500 font-bold">OTP expires in: {timer} seconds</p>
                            </div>
                            )

                            }

                           

                            <div className="flex flex-col mt-4 space-y-5">
                                <div>
                                    <button
                                        type="submit"
                                        className="flex cursor-pointer items-center justify-center w-full py-4 bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 text-white text-sm rounded-lg shadow-md transition duration-200"
                                    >
                                        Verify Account
                                    </button>
                                </div>

                                <div className="flex flex-row items-center justify-center text-sm font-medium space-x-1 text-gray-500">
                                    <p>Didn't receive the code?</p>
                                    <div onClick={handleResendOTP}>
                                        <button
                                            disabled={isResendDisabled}
                                            className={`text-blue-500 hover:underline cursor-pointer ${isResendDisabled ? 'text-gray-400' : 'text-blue-500'}`}
                                        >
                                            Resend
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>

                </div>
            </div>

            {/* Notification */}
           
        </section>
    );
};

export default AdminResetOTP;