import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faUpload } from "@fortawesome/free-solid-svg-icons";

export default function VerifyForm({ onClose }: { onClose: () => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation logic here
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = URL.createObjectURL(e.target.files[0]);
      setPreview(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative p-6 rounded-lg bg-white shadow-lg max-w-2xl w-full"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        aria-label="Close"
      >
        <FontAwesomeIcon icon={faTimes} size="lg" />
      </button>

      {/* Form Header */}
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        Verify Your Account
      </h2>
      <p className="text-gray-600 text-center mt-2">
        Complete your details to verify. Verification may take up to 3-5 business days.
      </p>

      {/* Form */}
      <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
        {/* Name Fields - Horizontal Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <label htmlFor="firstName" className="block text-gray-700 font-medium">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="First Name"
              className="border p-3 rounded w-full"
              required
            />
            {errors.firstName && (
              <p className="absolute text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="middleName" className="block text-gray-700 font-medium">
              Middle Name (Optional)
            </label>
            <input
              id="middleName"
              type="text"
              placeholder="Middle Name"
              className="border p-3 rounded w-full"
            />
          </div>

          <div className="relative">
            <label htmlFor="lastName" className="block text-gray-700 font-medium">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Last Name"
              className="border p-3 rounded w-full"
              required
            />
            {errors.lastName && (
              <p className="absolute text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Other Fields - Full Width */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label htmlFor="address" className="block text-gray-700 font-medium">
              Address
            </label>
            <input
              id="address"
              type="text"
              placeholder="e.g., 123 Rizal St., Barangay San Juan, Manila"
              className="border p-3 rounded w-full"
              required
            />
            {errors.address && (
              <p className="absolute text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="contactNumber" className="block text-gray-700 font-medium">
              Contact Number
            </label>
            <input
              id="contactNumber"
              type="tel"
              placeholder="Contact Number"
              className="border p-3 rounded w-full"
              required
            />
            {errors.contactNumber && (
              <p className="absolute text-red-500 text-xs mt-1">{errors.contactNumber}</p>
            )}
          </div>
        </div>

        {/* Modern Image Upload Section */}
        <div className="relative">
          <label htmlFor="fileUpload" className="block text-gray-700 font-medium mb-2">
            Upload ID
          </label>
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg w-full flex flex-col items-center bg-gray-100 hover:bg-gray-200 transition cursor-pointer">
            <label htmlFor="fileUpload" className="flex flex-col items-center cursor-pointer">
              <FontAwesomeIcon icon={faUpload} className="text-gray-500 text-2xl mb-2" />
              <p className="text-gray-600 font-medium">Drag & Drop or Click to Upload</p>
              <span className="text-xs text-gray-500">(JPG, PNG, or PDF - Max 5MB)</span>
            </label>
            <input
              id="fileUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Image Preview */}
        {preview && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-md flex flex-col items-center">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Preview</h4>
            <img
              src={preview}
              alt="ID Preview"
              className="w-32 h-32 object-cover rounded-md border shadow"
            />
          </div>
        )}

       
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </motion.div>
  );
}
