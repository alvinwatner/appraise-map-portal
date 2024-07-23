import {
  fetchSettingsData,
  updateSettingsData,
} from "@/app/services/dataManagement.service";
import { Settings } from "@/app/types/types";
import { useEffect, useState } from "react";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";

export const BillingCoordinatesTab: React.FC = () => {
  const [settingsData, setSettingsData] = useState<Settings | null>(null);
  const [updatedSettingsData, setUpdatedSettingsData] = useState<
    Partial<Settings>
  >({});
  const [loading, setLoading] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    isOpen: false,
    isSuccess: false,
    message: "",
  });

  const handleUpdateSettingsData = async () => {
    setLoading(true);

    try {
      updateSettingsData(settingsData?.id ?? 0, updatedSettingsData);
      setLoading(false);
      setModalInfo({
        isOpen: true,
        isSuccess: true,
        message: "Sukses mengubah data",
      });
    } catch (error) {
      console.error("Failed to update settigns data", error);
      // TODO: show modal fail
      setLoading(false);
      setModalInfo({
        isOpen: true,
        isSuccess: true,
        message: "Gagal mengubah data",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchSettingsData();
      console.log(`settingsData result = ${JSON.stringify(result)}`);
      console.log(`id = ${result.id}`);
      setSettingsData(result);
    };

    fetchData();
  }, []);

  const handleOnChangeSettingsData = (field: keyof Settings, value: any) => {
    setUpdatedSettingsData((prev) => {
      return { ...prev, [field]: value };
    });
    setSettingsData((prev) => {
      if (prev) {
        return { ...prev, [field]: value };
      }
      return prev;
    });
  };

  return (
    <div className="relative p-8">
      <h2 className="text-xl font-bold mb-4">Billing Coordinates</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Maximum Billing</label>
        <input
          value={settingsData?.maxBilling?.toString()}
          onChange={(event) => {
            handleOnChangeSettingsData("maxBilling", event.target.value);
          }}
          type="number"
          className="p-2 border border-gray-300 rounded-md w-full"
          placeholder="Enter maximum billing"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Default Longitude</label>
        <input
          value={settingsData?.longitude?.toString() || ""}
          onChange={(event) => {
            handleOnChangeSettingsData("longitude", event.target.value);
          }}
          type="text"
          className="p-2 border border-gray-300 rounded-md w-full"
          placeholder="Enter default longitude"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Default Latitude</label>
        <input
          value={settingsData?.latitude?.toString() || ""}
          onChange={(event) => {
            handleOnChangeSettingsData("latitude", event.target.value);
          }}
          type="text"
          className="p-2 border border-gray-300 rounded-md w-full"
          placeholder="Enter default latitude"
        />
      </div>
      <button
        className="p-2 bg-blue-500 text-white rounded-md"
        disabled={loading}
        onClick={handleUpdateSettingsData}
      >
        {loading ? "Saving..." : "Save"}
      </button>
      <ModalUpdateResult
        isOpen={modalInfo.isOpen}
        onClose={() => setModalInfo({ ...modalInfo, isOpen: false })}
        isSuccess={modalInfo.isSuccess}
        message={modalInfo.message}
      />
    </div>
  );
};

const ModalUpdateResult: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  isSuccess: boolean;
  message: string;
}> = ({ isOpen, onClose, isSuccess, message }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute top-0 left-0  w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-5 mx-4 rounded-lg flex flex-col items-center">
        {isSuccess ? (
          <IoCheckmarkCircleOutline size={48} color="green" />
        ) : (
          <IoCloseCircleOutline size={48} color="red" />
        )}
        <p className="text-lg my-2">{message}</p>
        <button
          className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};
