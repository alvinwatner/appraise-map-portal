import React, { useEffect, useState } from "react";
import { fetchUserDataSession } from "@/app/services/dataManagement.service";
import {
  BaseAddValuationForm,
  BaseAddValuationFormProps,
} from "./BaseValuationForm";

interface AddAssetValuationFormProps extends BaseAddValuationFormProps {
  onChangeReportNumber: (value: string) => void;
  onChangeAppraiser: (value: string) => void;
  assetValuationErrors: {
    appraiser: string;
    reportNumber: string;
  };
}

export const AddAssetValuationForm: React.FC<AddAssetValuationFormProps> = ({
  onChangeLandValue,
  onChangeBuildingValue,
  onChangeTotalValue,
  onChangeValuationDate,
  onChangeReportNumber,
  onChangeAppraiser,
  assetValuationErrors,
  errors,
}: AddAssetValuationFormProps) => {
  const [reportNumber, setReportNumber] = useState<string>("");
  const [appraiser, setAppraiser] = useState<string>("");

  useEffect(() => {
    onChangeAppraiser(appraiser);
  }, [appraiser, onChangeAppraiser]);

  useEffect(() => {
    const fetchSession = async () => {
      const result = await fetchUserDataSession();
      console.log(`add data session result = ${JSON.stringify(result)}`);
      setAppraiser(result.name ?? "");
    };

    fetchSession();
  }, []);

  return (
    <div>
      <BaseAddValuationForm
        errors={errors}
        onChangeLandValue={onChangeLandValue}
        onChangeBuildingValue={onChangeBuildingValue}
        onChangeTotalValue={onChangeTotalValue}
        onChangeValuationDate={onChangeValuationDate}
      />
      <div className="ml-4">
        <p className="text-2sm font-thin mb-2 mt-5">Dinilai Oleh :</p>
        <input
          className="w-full pl-2 py-2 rounded-lg placeholder:placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
          value={appraiser}
          type="text"
          onChange={(e) => {
            var value = e.target.value;
            setAppraiser(value);
            onChangeAppraiser(value);
          }}
          placeholder="Penilai :"
        />
        {assetValuationErrors.appraiser && (
          <p className="text-red-500 text-xs">
            {assetValuationErrors.appraiser}
          </p>
        )}
        <p className="text-2sm font-thin mb-2 mt-5">No Laporan :</p>
        <input
          className="w-full pl-2 py-2 rounded-lg placeholder:placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm overflow-hidden whitespace-nowrap text-overflow-ellipsis"
          value={reportNumber}
          type="text"
          onChange={(e) => {
            var value = e.target.value;
            setReportNumber(value);
            onChangeReportNumber(value);
          }}
          placeholder="No Laporan :"
        />
        {assetValuationErrors.reportNumber && (
          <p className="text-red-500 text-xs">
            {assetValuationErrors.reportNumber}
          </p>
        )}
      </div>
    </div>
  );
};
