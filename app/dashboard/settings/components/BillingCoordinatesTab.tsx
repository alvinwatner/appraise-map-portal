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
import { Skeleton } from "@/components/ui/skeleton";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
      setLoading(true);
      const result = await fetchSettingsData();
      console.log(`settingsData result = ${JSON.stringify(result)}`);
      setSettingsData(result);
      setLoading(false);
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
    <>
      <CardHeader>
        <CardTitle className="text-lg">Billing & Coordinates</CardTitle>
        <CardDescription>
          Configure billing limits and default map coordinates
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="maxBilling">Maximum Billing</Label>
          {loading ? (
            <Skeleton className="h-10" />
          ) : (
            <Input
              id="maxBilling"
              value={settingsData?.maxBilling?.toString() || ""}
              onChange={(event) => {
                handleOnChangeSettingsData("maxBilling", event.target.value);
              }}
              type="number"
              placeholder="Enter Maximum Billing"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">Default Longitude</Label>
          {loading ? (
            <Skeleton className="h-10" />
          ) : (
            <Input
              id="longitude"
              value={settingsData?.longitude?.toString() || ""}
              onChange={(event) => {
                handleOnChangeSettingsData("longitude", event.target.value);
              }}
              type="text"
              placeholder="Enter Default Longitude"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="latitude">Default Latitude</Label>
          {loading ? (
            <Skeleton className="h-10" />
          ) : (
            <Input
              id="latitude"
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
          variant="success"
          className="w-full"
          disabled={loading}
          onClick={handleUpdateSettingsData}
        >
          {loading ? (
            <Loading size="w-5 h-5" strokeWidth="border-2 border-t-2" />
          ) : (
            "Save Changes"
          )}
        </Button>
      </CardContent>

      <ModalUpdateResult
        isOpen={modalInfo.isOpen}
        onClose={() => setModalInfo({ ...modalInfo, isOpen: false })}
        isSuccess={modalInfo.isSuccess}
        message={modalInfo.message}
      />
    </>
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
          <IoCheckmarkCircleOutline size={48} className="text-teal-600" />
        ) : (
          <IoCloseCircleOutline size={48} className="text-destructive" />
        )}
        <p className="text-lg my-2">{message}</p>
        <Button className="mt-3" variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};
