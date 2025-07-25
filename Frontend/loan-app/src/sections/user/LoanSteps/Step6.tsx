import { useState, useEffect } from 'react';
import { useMyContext } from '../../../context/MyContext';
import { sendLoanSubmission } from '../../../services/user/loan';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getLoanApplication } from '../../../services/user/userData';
import { LoanSubmission } from '../../../constants/interfaces/loanInterface';
import { formatDate, formatDateWithWords, formatDateWords } from '../../../utils/formatDate';

const Step6 = ({
    prevStep,
}: {
    prevStep: () => void;
}) => {
    const { loanSubmission, setLoanSubmission } = useMyContext();
    const nav = useNavigate();
    const [loading, setLoading] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery(
        ["userLoanApplication"],
        getLoanApplication
    );

    useEffect(() => {
        if (data?.id) {
            setLoanSubmission((prev: LoanSubmission) => ({ ...prev, loanId: data.id }));
        }
    }, [data, setLoanSubmission]);

    const handleSubmit = async () => {
        if (!termsAccepted) return;
        
        setLoading(true);
        try {
            const response = await sendLoanSubmission(loanSubmission);

            if (response.status === 201) {
                setLoading(false);
                setLoanSubmission((prev: LoanSubmission) => ({ ...prev, idSelfie: null }));
                queryClient.invalidateQueries(['userLoanApplication']);
                queryClient.invalidateQueries(['userLoanSubmission']);
                nav('/user/my-loan');
            }
        } catch (error: any) {
            setLoading(false);
            console.log("Something went wrong");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen py-12 px-4">
            <div className="bg-white p-8 border border-gray-300 rounded-xl shadow-xl w-full max-w-md mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-gray-700 text-center">Review Your Submission</h2>

                {loanSubmission.idSelfie ? (
                    <div className="mb-8">
                        <img
                            src={URL.createObjectURL(loanSubmission.idSelfie)}
                            alt="Selfie ID"
                            className="w-full h-48 object-cover border border-gray-300 shadow-md rounded-md mx-auto"
                        />
                    </div>
                ) : (
                    <p className="text-red-500 text-lg mb-8 text-center">No selfie provided</p>
                )}

                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="font-semibold text-gray-700">Repay Date:</span>
                            <span className="text-gray-600">{formatDateWords  (data.end_date)|| 'Not selected'}</span>
                        </div>
                        
                        <div className="flex justify-between">
                            <span className="font-semibold text-gray-700">Contact Number:</span>
                            <span className="text-gray-600">{loanSubmission.contactNumber}</span>
                        </div>
                        
                        <div className="flex justify-between">
                            <span className="font-semibold text-gray-700">Loan Amount:</span>
                            <span className="text-gray-600">{loanSubmission.loanAmount || '0'} PHP</span>
                        </div>
                        
                        <div className="flex justify-between">
                            <span className="font-semibold text-gray-700">Total Payment:</span>
                            <span className="text-gray-600">{loanSubmission.totalPayment || '0'} PHP</span>
                        </div>
                    </div>
                </div>

                <label className="flex items-start gap-3 text-sm text-gray-700 mb-8">
                    <input 
                        type="checkbox" 
                        className="mt-1 cursor-pointer" 
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                    <span>
                        I certify that I am at least 21 years old and that I agree to the{" "}
                        <a
                            href="/terms"
                            className="text-blue-600 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Terms and Policies
                        </a>{" "}
                        and{" "}
                        <a
                            href="/privacy"
                            className="text-blue-600 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Privacy Policy
                        </a>
                        . This service is for the Philippines only.
                    </span>
                </label>

                <div className="flex justify-between mt-6 gap-4">
                    <button
                        onClick={prevStep}
                        className="w-1/2 text-gray-700 border border-gray-300 font-medium py-3 px-6 rounded-md hover:bg-gray-50 transition flex items-center justify-center"
                    >
                        ← Go Back
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={!termsAccepted}
                        className={`${
                            termsAccepted ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300 cursor-not-allowed'
                        } text-white w-1/2 font-medium py-3 px-6 rounded-md transition flex items-center justify-center`}
                    >
                        {loading ? (
                            <svg aria-hidden="true" className="w-6 h-6 text-slate-200 animate-spin dark:text-slate-100 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                        ) : (
                            "Submit"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step6;