import {
  fetchSettingsData,
  updateSettingsData,
} from "@/app/services/dataManagement.service";
import { Settings } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component
import Loading from "@/app/components/Loading";

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
      await updateSettingsData(settingsData?.id ?? 0, updatedSettingsData);
      setLoading(false);
      setModalInfo({
        isOpen: true,
        isSuccess: true,
        message: "Successfully Updated Settings Data",
      });
    } catch (error) {
      console.error("Failed to update settings data", error);
      setLoading(false);
      setModalInfo({
        isOpen: true,
        isSuccess: false,
        message: "Gagal mengubah data",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true when fetching data
      const result = await fetchSettingsData();
      console.log(`settingsData result = ${JSON.stringify(result)}`);
      setSettingsData(result);
      setLoading(false); // Set loading to false after fetching data
    };

    fetchData();
  }, []);

  const handleOnChangeSettingsData = (field: keyof Settings, value: any) => {
    setUpdatedSettingsData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSettingsData((prev) => {
      if (prev) {
        return { ...prev, [field]: value };
      }
      return prev;
    });
  };

  return (
    <div className="relative p-8">
      <div className="mb-4">
        <label className="block text-xs">Maximum Billing</label>
        {loading ? (
          <Skeleton className="h-10" /> // Show skeleton while loading
        ) : (
          <Input
            value={settingsData?.maxBilling?.toString() || ""}
            onChange={(event) => {
              handleOnChangeSettingsData("maxBilling", event.target.value);
            }}
            type="number"
            placeholder="Enter Maximum Billing"
          />
        )}
      </div>
      <div className="mb-4">
        <label className="block text-xs">Default Longtitude</label>
        {loading ? (
          <Skeleton className="h-10" />
        ) : (
          <Input
            value={settingsData?.longitude?.toString() || ""}
            onChange={(event) => {
              handleOnChangeSettingsData("longitude", event.target.value);
            }}
            type="text"
            placeholder="Enter Default Longtitude"
          />
        )}
      </div>
      <div className="mb-4">
        <label className="block text-xs">Default Latitude</label>
        {loading ? (
          <Skeleton className="h-10" />
        ) : (
          <Input
            value={settingsData?.latitude?.toString() || ""}
            onChange={(event) => {
              handleOnChangeSettingsData("latitude", event.target.value);
            }}
            type="text"
            placeholder="Enter Default Latitude"
          />
        )}
      </div>
      <Button
        className="bg-blue-600 hover:bg-blue-800 text-white w-full"
        disabled={loading}
        onClick={handleUpdateSettingsData}
      >
        {loading ? (
          <Loading size="w-5 h-5" strokeWidth="border-2 border-t-2" />
        ) : (
          "SAVE"
        )}
      </Button>
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-5 mx-4 rounded-lg flex flex-col items-center">
        {isSuccess ? (
          <IoCheckmarkCircleOutline size={48} color="green" />
        ) : (
          <IoCloseCircleOutline size={48} color="red" />
        )}
        <p className="text-lg my-2">{message}</p>
        <Button className="mt-3" variant="outline" onClick={onClose}>
          CLOSE
        </Button>
      </div>
    </div>
  );
};
