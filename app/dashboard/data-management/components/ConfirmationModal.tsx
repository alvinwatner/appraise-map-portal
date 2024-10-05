// components/ConfirmationModal.tsx
import { Button } from "@/components/ui/button";
import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4 text-center">CONFIRMATION</h2>
        <p className="mb-6">{message}</p>
        <div className="w-full flex justify-end gap-2">
          <Button variant="outline" className="w-full" onClick={onClose}>
            CANCEL
          </Button>
          <Button
            className="w-full bg-red-600 hover:bg-red-800 text-white"
            onClick={onConfirm}
          >
            CONFIRM
          </Button>
        </div>
      </div>
    </div>
  );
};
