import React from "react";

interface ImageModalProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-4xl w-full h-auto relative flex justify-center items-center">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 cursor-pointer bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-full shadow-md transition-all hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Make the image wider */}
        <div className=" w-[600px] h-[80vh] flex justify-center items-center">
          <img
            src={imageUrl}
            alt="User"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>


      </div>
    </div>
  );
};

export default ImageModal;
