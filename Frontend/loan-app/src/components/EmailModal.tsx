import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  buttonText?: string;
  heading:string;
  onConfirm: () => void;
  loading: boolean
}

interface SendEmail {
  subject: String;
  description: String;
}

const EmailModal: React.FC<EmailModalProps> = ({
    heading,
  isOpen,
  onClose,
  buttonText,
  onConfirm 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/50   bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
      
        <div className="flex justify-center mb-4">
          <FontAwesomeIcon icon={faEnvelope} className="text-blue-500 text-4xl" />
        </div>
        <h1 className="text-xl font-semibold mb-4 text-center">{heading}</h1>

        <h2 className="text-lg font-semibold mb-4 text-center">Send Email</h2>

        <input
          type="text"
          placeholder="Subject"
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 mb-4 border rounded h-32 resize-none"
        ></textarea>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white rounded">
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
