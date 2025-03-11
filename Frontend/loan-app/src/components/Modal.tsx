import { motion } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onConfirm: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, message, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500/50  bg-opacity-40 bg-opacity-50 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6"
      >
        
        {title && <h2 className="text-lg font-semibold text-gray-800">{title}</h2>}

       
        {message && <p className="text-gray-600 mt-2">{message}</p>}

       
        <div className="mt-4 flex justify-end space-x-3">
          <button 
            className="px-4 py-2 cursor-pointer text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;
