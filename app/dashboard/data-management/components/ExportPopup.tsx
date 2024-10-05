import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Modal from "react-modal";

interface ExportPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (exportAll: boolean) => void;
}

const ExportPopup: React.FC<ExportPopupProps> = ({
  isOpen,
  onClose,
  onExport,
}) => {
  const [exportAll, setExportAll] = useState(false);

  const handleExport = () => {
    onExport(exportAll);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Import Data Modal"
      ariaHideApp={false}
      className="flex items-center justify-center mt-52"
      overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75"
    >
      <div className="bg-white w-full max-w-md rounded-lg overflow-hidden shadow-md">
        <div className="px-6 py-4">
          <div className="text-xl font-semibold mb-4 text-center">
            EXPORT DATA
          </div>
          <div className="mb-4">
            <label className="block mb-2">
              <input
                type="radio"
                value="thisPage"
                checked={!exportAll}
                onChange={() => setExportAll(false)}
                className="mr-2"
              />
              Export Current Page Only
            </label>
            <label className="block">
              <input
                type="radio"
                value="allPages"
                checked={exportAll}
                onChange={() => setExportAll(true)}
                className="mr-2"
              />
              Export All Pages
            </label>
          </div>
          <div className="w-full flex justify-end gap-2">
            <Button
              onClick={handleExport}
              className="bg-blue-600 hover:bg-blue-800 text-white w-full"
            >
              EXPORT
            </Button>
            <Button onClick={onClose} variant="outline" className="w-full">
              CANCEL
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ExportPopup;
