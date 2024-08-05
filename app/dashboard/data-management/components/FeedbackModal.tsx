import React from "react";
import Modal from "react-modal";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type: "success" | "error";
  onOk?: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  message,
  type,
  onOk,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Feedback Modal"
      ariaHideApp={false}
      className="flex items-center justify-center mt-52"
      overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75"
    >
      <div
        className={`bg-white w-full max-w-md rounded-lg overflow-hidden shadow-md p-4 text-center ${
          type === "success" ? "border-green-500" : "border-red-500"
        }`}
      >
        <div
          className={`text-xl font-bold mb-4 ${
            type === "success" ? "text-green-500" : "text-red-500"
          }`}
        >
          {type === "success" ? "Success" : "Error"}
        </div>
        <div className="mb-4 text-gray-700">{message}</div>
        <div className="flex justify-center">
          {type === "success" ? (
            <button
              onClick={() => {
                if (onOk) onOk();
                onClose();
              }}
              className="bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Ok
            </button>
          ) : (
            <button
              onClick={onClose}
              className="bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default FeedbackModal;
