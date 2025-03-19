import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDetail, verifyUser } from "../../services/admin/adminData";
import { motion } from "framer-motion";
import { ApplicationData } from "../../constants/interfaces/adminInterface";
import { cleanImageUrl } from "../../utils/imageClean";
import Modal from "../../components/Modal";
import ImageModal from "../../components/ImageModal";
import { ApplicationId } from "../../constants/interfaces/adminInterface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faArrowLeft, faCamera } from "@fortawesome/free-solid-svg-icons";

const Verification: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const endpoint = "users"
    const { data, isLoading, isError } = useQuery<ApplicationData>({
        queryKey: ["userDetail", id],
        queryFn: () => getDetail(id!, endpoint),
        enabled: !!id,
    });

    if (isLoading) return <p className="text-center text-gray-600 mt-10">Loading user details...</p>;
    if (isError) return <p className="text-center text-red-500 mt-10">Error fetching user details.</p>;

    const handleVerifyUser = async () => {
        setLoading(true);
        const details: ApplicationId = {
            id: data.id,
            user: data.user,
        };

        try {
            const response = await verifyUser(details);

            if (response?.status === 200) {
                setIsModalOpen(false);
                setLoading(false);
                queryClient.invalidateQueries(["userDetail", id]);
            }
        } catch (error) {
            setLoading(false);
            alert("Something went wrong");
        }
    };

    return (
        <motion.div
            className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-6 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >

            <div className="mb-6 md:pl-7 w-1/2">
                <button
                    onClick={() => navigate(-1)}
                    className="top-4  left-3 md:left-40  cursor-pointer bg-blue-500 text-white font-medium px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center gap-2 active:scale-95"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="text-white" />
                    Go Back
                </button>

            </div>



            <div  className="bg-white p-8 shadow-xl rounded-lg overflow-hidden w-full max-w-3xl relative">

                <motion.img
                    src={cleanImageUrl(data?.image)}
                    alt="User"
                    className="w-full h-48 sm:h-64 cursor-pointer object-cover border-b-2 border-gray-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    onClick={() => setIsImageModalOpen(true)}

                />
                  <button
                    className="absolute top-9 right-9 hover:bg-blue-600 bg-blue-500 px-3 cursor-pointer bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300"
                    onClick={() => setIsImageModalOpen(true)}
                >
                    <FontAwesomeIcon icon={faCamera} />
                </button>



                <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-gray-800 text-center md:text-left w-full">
                            {data?.first_name} {data?.middle_name} {data?.last_name}
                        </p>
                    </div>

                    <div className="mt-5 border-t border-gray-200 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600 font-medium">Birthdate</p>
                            <p className="text-gray-500 text-sm">{data?.birthdate}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 font-medium">Age</p>
                            <p className="text-gray-500 text-sm">{data?.age}</p>
                        </div>
                        <div className="sm:col-span-2">
                            <p className="text-gray-600 font-medium">Address</p>
                            <p className="text-gray-500 text-sm">{data?.address}</p>
                        </div>
                        <div className="sm:col-span-2">
                            <p className="text-gray-600 font-medium">Contact Number</p>
                            <p className="text-gray-500 text-sm">{data?.contact_number}</p>
                        </div>
                    </div>
                </div>


                <div className="p-4 flex justify-center">
                    {data?.status.trim() === "pending" ? (
                        <motion.button
                            className="bg-blue-500 cursor-pointer text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all hover:bg-blue-600 active:scale-95"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsModalOpen(true)}
                        >
                            Verify
                        </motion.button>
                    ) : (
                        <div className="flex items-center text-blue-600 font-semibold text-lg">
                            <FontAwesomeIcon icon={faCircleCheck} className="text-2xl mr-2" />
                            Verified
                        </div>
                    )}
                </div>
            </div>

            {isImageModalOpen && (
                <ImageModal
                    imageUrl={cleanImageUrl(data?.image)}
                    isOpen={isImageModalOpen}
                    onClose={() => setIsImageModalOpen(false)}
                />
            )}

            {/* Confirmation Modal */}
            <Modal
                loading={loading}
                isOpen={isModalOpen}
                title="Confirm Verification"
                message="Are you sure you want to verify this user?"
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleVerifyUser}
            />
        </motion.div>
    );
};

export default Verification;
