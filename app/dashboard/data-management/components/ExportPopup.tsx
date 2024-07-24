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
          <div className="text-center font-bold text-xl mb-4">Export Data</div>
          <div className="mb-4">
            <label className="block mb-2">
              <input
                type="radio"
                value="thisPage"
                checked={!exportAll}
                onChange={() => setExportAll(false)}
                className="mr-2"
              />
              Halaman ini saja
            </label>
            <label className="block">
              <input
                type="radio"
                value="allPages"
                checked={exportAll}
                onChange={() => setExportAll(true)}
                className="mr-2"
              />
              Semua halaman
            </label>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleExport}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mr-2"
            >
              Export
            </button>
            <button
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ExportPopup;
