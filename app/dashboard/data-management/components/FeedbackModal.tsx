import { Button } from "@/components/ui/button";
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
      contentLabel="FEEDBACK MODAL"
      ariaHideApp={false}
      className="fixed inset-0 flex items-center justify-center p-4"
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
        <div className="flex justify-center gap-2">
          {type === "success" ? (
            <Button
              onClick={() => {
                if (onOk) onOk();
                onClose();
              }}
              className="bg-green-600 hover:bg-green-800 text-white"
            >
              OK
            </Button>
          ) : (
            <Button onClick={onClose} variant="outline">
              CLOSE
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default FeedbackModal;
