import React, { use } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud } from "@fortawesome/free-solid-svg-icons";
import { useMyContext } from "../../../context/MyContext";
import { SubmitDisbursement } from "../../../constants/interfaces/disbursement";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "@tanstack/react-query";
import { userDisbursementApi } from "../../../services/axiosConfig";
import { useNavigate } from "react-router-dom";
import { sendLoanPayment } from "../../../services/user/disbursement";
import { useQuery } from "@tanstack/react-query";
import { getLoanSubmission } from "../../../services/user/userData";
import { useEffect } from "react";
interface Step4Props {
  prevStep: () => void;
  setStep: (step: number) => void; // ✅ Define setStep prop type
}

const Step4: React.FC<Step4Props> = ({ prevStep, setStep }) => {
  const { setDisbursement, disbursement } = useMyContext();
  const { data, isLoading, isError } = useQuery(["userLoanSubmission4"], getLoanSubmission);
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setDisbursement((prev: SubmitDisbursement) => ({ ...prev, receipt: file }))
      e.target.value = "";

    }
  };

  console.log(data);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisbursement((prev: SubmitDisbursement) => ({ ...prev, [e.target.name]: e.target.value }))
  }

    const handleRemoveFile = (side: "receipt") => {
      setDisbursement((prev: SubmitDisbursement) => ({
        ...prev,
        [side]: null,
      }));
    };


  const handleSubmit = async () => {
     try {
      const response = await sendLoanPayment(disbursement);

      if(response.status === 201) {
        
        queryClient.invalidateQueries(["userLoanSubmission"]);
        queryClient.invalidateQueries(["userApplication"]);
        setStep(1);
        setDisbursement({
          receipt: null,
          email: "",
          disbursementId: null, // Adjust based on your default values
          periodPayment: {
            label: "",
            amount: "",
            duration: "",
          },
        });
      }
      

     } catch(error) {
      alert("NetWork Error");
     }
  }

  useEffect(() => {
    if (data) {
      setDisbursement((prev: SubmitDisbursement) => ({
        ...prev,
        disbursementId: data.id, 
      }));
    }
  }, [data]); 

  return (
    <div className="flex min-h-screen mt-9 items-center pb-20 h-auto">
      <div className="bg-white p-6 shadow-lg rounded-lg  border border-gray-300">
        <h2 className="text-center text-lg font-semibold mb-4">
          Confirmation of Payment
        </h2>
        <p className="text-center text-sm mb-4">
          Please submit the screenshot of the receipt.
        </p>
        <div className="relative">
          <label htmlFor="fileUploadBack" className="block text-gray-700 font-medium mb-2">

          </label>
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg w-full flex flex-col items-center bg-gray-100 hover:bg-gray-200 transition cursor-pointer">
            <label htmlFor="fileUploadBack" className="flex flex-col items-center cursor-pointer">
              <FontAwesomeIcon icon={faCloud} className="text-gray-500 text-2xl mb-2" />
              <p className="text-gray-600 font-medium">Drag & Drop or Click to Upload</p>
              <span className="text-xs text-gray-500">(JPG, PNG, or PDF - Max 5MB)</span>
            </label>
            <input
              id="fileUploadBack"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {disbursement.receipt && (
  <div className="relative flex justify-center items-center w-full mt-2">
    <img
      src={URL.createObjectURL(disbursement.receipt)}
      alt="Receipt"
      className="h-60 w-64 object-cover rounded-lg shadow"
    />
    <button
      onClick={() => handleRemoveFile("receipt")}
      className="absolute top-2 right-2 bg-red-500 cursor-pointer text-white rounded-full px-1 hover:bg-red-600 transition"
    >
      <FontAwesomeIcon icon={faTimesCircle} />
    </button>
  </div>
)}

        
        <p className="text-center text-sm mt-4">
          You may also provide your email address (optional) for confirmation.
        </p>
        <input
          onChange={handleChange}
          value={disbursement.email}
          name="email"
          type="email"

          placeholder="Email Address"
          className="w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-between mt-6 gap-4">
          <button
            className="w-full bg-gray-500 cursor-pointer text-white px-6 py-3 rounded-lg text-lg transition-transform transform hover:scale-105"
            onClick={prevStep}
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 cursor-pointer text-white px-6 py-3 rounded-lg text-lg transition-transform transform hover:scale-105"

          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step4;
