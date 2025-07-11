import React, { use } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud } from "@fortawesome/free-solid-svg-icons";
import { useCarContext } from "../../../context/CarContext";
import { SubmitDisbursement } from "../../../constants/interfaces/disbursement";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { sendCarLoanPayment } from "../../../services/rental/carDisbursement";
import { useQuery } from "@tanstack/react-query";

import { useEffect } from "react";
import { fetchCarLoanDisbursement } from "../../../services/rental/carDisbursement";
interface Step4Props {
  prevStep: () => void;
  setStep: (step: number) => void; // ✅ Define setStep prop type
}

const Step4: React.FC<Step4Props> = ({ prevStep, setStep }) => {
  const { setCarDisbursement, carDisbursement } = useCarContext();
  const { data, isLoading, isError } = useQuery(["userCarLoanSubmission4"], fetchCarLoanDisbursement);
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCarDisbursement((prev: SubmitDisbursement) => ({ ...prev, receipt: file }))
      e.target.value = "";

    }
  };

  console.log(data);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCarDisbursement((prev: SubmitDisbursement) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleRemoveFile = (side: "receipt") => {
    setCarDisbursement((prev: SubmitDisbursement) => ({
      ...prev,
      [side]: null,
    }));
  };


  const handleSubmit = async () => {
    try {
      const response = await sendCarLoanPayment(carDisbursement);

      localStorage.removeItem("selectedOption");

      if (response.status === 201) {

        queryClient.invalidateQueries(["carLoanDisbursementProccess"]);

        setStep(1);
        setCarDisbursement({
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


    } catch (error) {
      console.log(error);
      alert("NetWork Error");
    }
  }

  useEffect(() => {
    if (data) {
      setCarDisbursement((prev: SubmitDisbursement) => ({
        ...prev,
        disbursementId: data.id,
      }));
    }
  }, [data]);

  // Check if receipt is uploaded
  const isReceiptUploaded = carDisbursement.receipt !== null;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-300 w-full max-w-md">
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

        {carDisbursement.receipt && (
          <div className="relative flex justify-center items-center w-full mt-2">
            <img
              src={URL.createObjectURL(carDisbursement.receipt)}
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
          value={carDisbursement.email}
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
            disabled={!isReceiptUploaded}
            className={`w-full px-6 py-3 rounded-lg text-lg transition-transform transform ${
              isReceiptUploaded 
                ? 'bg-blue-500 text-white cursor-pointer hover:scale-105' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step4;