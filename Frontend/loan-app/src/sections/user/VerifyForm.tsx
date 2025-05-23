import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faUpload } from "@fortawesome/free-solid-svg-icons";
import { sendVerifyData } from "../../services/user/userData";
import { VerifyData } from "../../constants/interfaces/authInterface";
import { useQueryClient } from "@tanstack/react-query";
import { validateFirstName, validateMiddleName, validateLastName, validateAddress, validatePostalCode } from "../../utils/validation";
import { ValidationError } from "../../constants/interfaces/errorInterface";

const VerifyForm = ({ onClose }: { onClose: () => void }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const queryClient = useQueryClient();
  const [termsAgreed, setTermsAgreed] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<ValidationError>({
    fnameError: "",
    lnameError: "",
    mnameError: "",
    addressError: "",
    postalError: "",
  });

  const [formData, setFormData] = useState<VerifyData>({
    firstName: "",
    middleName: "",
    lastName: "",
    address: "",
    birthdate: "",
    age: "",
    contactNumber: "",
    gender: "",
    civilStatus: "",
    postalCode: "",
    suffix: ""
  });

  console.log(formData);

  // Function to check if form is valid and complete
  const isFormValid = () => {
    return (
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.address.trim() !== "" &&
      formData.birthdate !== "" &&
      formData.gender !== "" &&
      formData.civilStatus !== "" &&
      formData.postalCode.trim() !== "" &&
      formData.age !== "" &&
      termsAgreed &&
      Object.values(errors).every(error => error === "") &&
      Object.values(validationError).every(error => error === "")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setValidationError({
      fnameError: "",
      lnameError: "",
      mnameError: "",
      addressError: "",
      postalError: "",
    });

    const fnameError = validateFirstName(formData.firstName);
    const lnameError = validateLastName(formData.lastName);
    const mnameError = validateMiddleName(formData.middleName || "");
    const addressError = validateAddress(formData.address);
    const postalError = validatePostalCode(formData.postalCode || "");

    setValidationError({
      fnameError: fnameError,
      lnameError: lnameError,
      mnameError: mnameError,
      addressError: addressError,
      postalError: postalError
    });

    if (fnameError || lnameError || mnameError || addressError || postalError) {
      return;
    }

    // Ensure suffix is properly handled before submitting
    const dataToSubmit = {
      ...formData,
      // Ensure suffix is empty string if it's the N/A option
      suffix: formData.suffix === "" ? "" : formData.suffix
    };

    try {
      const response = await sendVerifyData(dataToSubmit);

      if (response?.status === 201) {
        queryClient.invalidateQueries(["userDetails"]);
        queryClient.invalidateQueries(["userAccountDetails"]);
        onClose();

        localStorage.removeItem("formData")
      }
    } catch (error) {
      alert("something went wrong");
    }
  };

  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setFullYear(today.getFullYear() - 21); // 21 years ago

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const today = new Date();
    let updatedFormData = { ...formData, [name]: value };
  
    if (name === "birthdate") {
      const birthDate = new Date(value);
  
      if (isNaN(birthDate.getTime())) {
        // Invalid date format
        setErrors((prev) => ({
          ...prev,
          birthdate: "Please enter a valid birthdate.",
        }));
      } else {
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
  
        // Adjust age if birthday hasn't happened this year
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          age--;
        }
      
        if (age > 90) {
          setErrors((prev) => ({
            ...prev,
            birthdate: "Age must not exceed 90 years.",
          }));
        } else if (age < 21) {
          setErrors((prev) => ({
            ...prev,
            birthdate: "You must be at least 21 years old.",
          }));
        } else {
          setErrors((prev) => ({ ...prev, birthdate: "" }));
          updatedFormData = { ...updatedFormData, age: age.toString() };
        }
      }
    }
  
    setFormData(updatedFormData);
    localStorage.setItem("formData", JSON.stringify(updatedFormData));
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAgreed(e.target.checked);
  };
  
  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative p-6 rounded-lg h-[550px] overflow-y-auto bg-white shadow-lg max-w-2xl w-full z-50"
    >
      <button
        onClick={onClose}
        className="absolute top-4 cursor-pointer right-4 text-gray-500 hover:text-gray-700"
        aria-label="Close"
      >
        <FontAwesomeIcon icon={faTimes} size="lg" />
      </button>

      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        Verify Your Account
      </h2>
      <p className="text-gray-600 text-center mt-2">
        Complete your details to verify. Verification may take up to 3-5 business days.
      </p>

      <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
        {/* Name Section - First Name and Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label htmlFor="firstName" className="block text-gray-700 font-medium">First Name</label>
            <input
              value={formData.firstName}
              id="firstName"
              type="text"
              name="firstName"
              onChange={handleChange}
              placeholder="First Name"
              className="border p-3 rounded w-full"
              required
            />
            {validationError.fnameError && <p className="text-red-500 text-xs mt-1">{validationError.fnameError}</p>}
          </div>

          <div className="relative">
            <label htmlFor="lastName" className="block text-gray-700 font-medium">Last Name</label>
            <input
              value={formData.lastName}
              onChange={handleChange}
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Last Name"
              className="border p-3 rounded w-full"
              required
            />
            {validationError.lnameError && <p className="text-red-500 text-xs mt-1">{validationError.lnameError}</p>}
          </div>
        </div>

        {/* Middle Name and Suffix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label htmlFor="middleName" className="block text-gray-700 font-medium">Middle Name (Optional)</label>
            <input
              value={formData.middleName}
              onChange={handleChange}
              id="middleName"
              name="middleName"
              type="text"
              placeholder="Middle Name"
              className="border p-3 rounded w-full"
            />
            {validationError.mnameError && <p className="text-red-500 text-xs mt-1">{validationError.mnameError}</p>}
          </div>

          <div className="relative">
            <label htmlFor="suffix" className="block text-gray-700 font-medium">Suffix (Optional)</label>
            <select
              value={formData.suffix}
              onChange={handleChange}
              id="suffix"
              name="suffix"
              className="border p-3 rounded w-full"
            >
              <option value="">N/A</option>
              <option value="Jr.">Jr. (Junior)</option>
              <option value="Sr.">Sr. (Senior)</option>
              <option value="I">I (First)</option>
              <option value="II">II (Second)</option>
              <option value="III">III (Third)</option>
              <option value="IV">IV (Fourth)</option>
              <option value="V">V (Fifth)</option>
            </select>
          </div>
        </div>

        {/* Birthdate and Age */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label htmlFor="birthdate" className="block text-gray-700 font-medium">Birthdate</label>
            <input
              value={formData.birthdate}
              onChange={handleChange}
              id="birthdate"
              name="birthdate"
              type="date"
              className="border p-3 rounded w-full"
              required
              min={new Date(new Date().setFullYear(new Date().getFullYear() - 90)).toISOString().split("T")[0]}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 21)).toISOString().split("T")[0]}
            />
            {errors.birthdate && <p className="text-red-500 text-xs mt-1">{errors.birthdate}</p>}
          </div>

          <div className="relative">
            <label htmlFor="age" className="block text-gray-700 font-medium">Age</label>
            <input
              value={formData.age}
              onChange={handleChange}
              id="age"
              name="age"
              type="number"
              placeholder="Enter Age"
              className="border p-3 rounded w-full"
              required
              disabled
            />
            {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
          </div>
        </div>

        {/* Gender and Civil Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label htmlFor="gender" className="block text-gray-700 font-medium">Gender</label>
            <select
              value={formData.gender}
              onChange={handleChange}
              id="gender"
              name="gender"
              className="border p-3 rounded w-full"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="relative">
            <label htmlFor="civilStatus" className="block text-gray-700 font-medium">Civil Status</label>
            <select
              value={formData.civilStatus}
              onChange={handleChange}
              id="civilStatus"
              name="civilStatus"
              className="border p-3 rounded w-full"
              required
            >
              <option value="">Select Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>
        </div>

        {/* Address and Postal Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label htmlFor="address" className="block text-gray-700 font-medium">Address</label>
            <input
              value={formData.address}
              onChange={handleChange}
              name="address"
              id="address"
              type="text"
              placeholder="e.g., 123 Rizal St., Barangay..."
              className="border p-3 rounded w-full"
              required
            />
            {validationError.addressError && <p className="text-red-500 text-xs mt-1">{validationError.addressError}</p>}
          </div>

          <div className="relative">
            <label htmlFor="postalCode" className="block text-gray-700 font-medium">Postal Code</label>
            <input
              value={formData.postalCode}
              onChange={handleChange}
              id="postalCode"
              name="postalCode"
              type="text"
              placeholder="Enter Postal Code"
              className="border p-3 rounded w-full"
              required
            />
            {validationError.postalError && <p className="text-red-500 text-xs mt-1">{validationError.postalError}</p>}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mt-4">
          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input 
              type="checkbox" 
              className="mt-1 cursor-pointer" 
              checked={termsAgreed}
              onChange={handleTermsChange}
              required
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
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid()}
          className={`w-full cursor-pointer py-3 rounded-lg transition ${
            isFormValid() 
              ? "bg-blue-600 text-white hover:bg-blue-700" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Submit
        </button>
      </form>
    </motion.div>
  );
}

export default VerifyForm;