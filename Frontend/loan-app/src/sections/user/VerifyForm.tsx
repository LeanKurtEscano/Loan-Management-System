import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faUpload } from "@fortawesome/free-solid-svg-icons";
import { sendVerifyData } from "../../services/user/userData";
import { VerifyData } from "../../constants/interfaces/authInterface";
import { useQueryClient } from "@tanstack/react-query";

const VerifyForm = ({ onClose }: { onClose: () => void }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const queryClient = useQueryClient();

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
    postalCode: ""
  });

  console.log(formData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();



    try {
      const response = await sendVerifyData(formData);

      if (response?.status === 201) {
        queryClient.invalidateQueries(["userDetails"]);
        queryClient.invalidateQueries(["userAccountDetails"]);

        onClose();

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
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();

      // Adjust age if birthday hasn't happened this year
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }

      if (age < 21) {
        setErrors((prev) => ({ ...prev, birthdate: "You must be exactly 21 years or older." }));
      } else {
        setErrors((prev) => ({ ...prev, birthdate: "" }));
        updatedFormData = { ...updatedFormData, age: age.toString() };
      }
    }

    setFormData(updatedFormData);

    // Save to localStorage
    localStorage.setItem("formData", JSON.stringify(updatedFormData));
  };



  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
      e.target.value = "";
    }
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
      className="relative p-6 rounded-lg h-[550px] overflow-y-auto bg-white shadow-lg max-w-2xl w-full"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            {errors.firstName && <p className="absolute text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>

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
            {errors.lastName && <p className="absolute text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
            {errors.age && <p className="absolute text-red-500 text-xs mt-1">{errors.age}</p>}
          </div>

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
            {errors.birthdate && <p className="absolute text-red-500 text-xs mt-1">{errors.birthdate}</p>}
          </div>
        </div>

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
          </div>

        </div>


        <label className="flex items-start gap-2 text-sm text-gray-700 mt-2">
          <input type="checkbox" className="mt-1 cursor-pointer" />
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



        <button
          type="submit"
          className="w-full cursor-pointer bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>



      </form>
    </motion.div>
  );
}

export default VerifyForm