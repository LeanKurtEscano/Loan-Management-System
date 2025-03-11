import React from "react";

interface ImageModalProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 cursor-pointer bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-full shadow-md transition-all hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
          onClick={onClose}
        >
          ✕
        </button>
        
        {/* Image */}
        <img src={imageUrl} alt="User" className="w-full h-auto rounded-lg" />
      </div>
    </div>
  );
};

export default ImageModal;
