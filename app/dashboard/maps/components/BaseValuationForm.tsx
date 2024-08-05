import React, { useState } from "react";
import { filterNumeric, formatRupiah } from "../../../utils/helper";

export interface BaseAddValuationFormProps {
  onChangeLandValue: (value: number) => void;
  onChangeBuildingValue: (value: number) => void;
  onChangeTotalValue: (value: number) => void;
  onChangeValuationDate: (value: string) => void;
  errors: {
    landValue: string;
    buildingValue: string;
    totalValue: string;
    valuationDate: string;
  };
}

export const BaseAddValuationForm: React.FC<BaseAddValuationFormProps> = ({
  onChangeLandValue,
  onChangeBuildingValue,
  onChangeTotalValue,
  onChangeValuationDate,
  errors,
}: BaseAddValuationFormProps) => {
  const [landValue, setLandValue] = useState<number>(0);
  const [buildingValue, setBuildingValue] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [valuationDate, setValuationDate] = useState<string>("");

  return (
    <div>
      <p className="text-2sm font-thin mb-2 mt-5">Nilai:</p>
      <div className="ml-4">
        <p className="text-2sm font-thin mb-2 mt-5">Nilai Tanah/meter :</p>
        <input
          className="w-full pl-2 py-2 rounded-lg placeholder:placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
          value={formatRupiah(landValue)}
          onChange={(e) => {
            var value = Number(filterNumeric(e.target.value));
            setLandValue(value);
            onChangeLandValue(value);
          }}
          type="text"
          placeholder="Nilai Tanah"
        />
        {errors.landValue && (
          <p className="text-red-500 text-xs">{errors.landValue}</p>
        )}

        <p className="text-2sm font-thin mb-2 mt-5">Nilai Bangunan/meter :</p>
        <input
          className="w-full pl-2 py-2 rounded-lg placeholder:placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
          value={formatRupiah(buildingValue)}
          onChange={(e) => {
            var value = Number(filterNumeric(e.target.value));
            setBuildingValue(value);
            onChangeBuildingValue(value);
          }}
          type="text"
          placeholder="Nilai Bangunan"
        />
        {errors.buildingValue && (
          <p className="text-red-500 text-xs">{errors.buildingValue}</p>
        )}        

        <p className="text-2sm font-thin mb-2 mt-5">Total Nilai :</p>
        <input
          className="w-full pl-2 py-2 rounded-lg placeholder:placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
          value={formatRupiah(totalValue)}
          onChange={(e) => {
            var value = Number(filterNumeric(e.target.value));
            setTotalValue(value);
            onChangeTotalValue(value);
          }}
          type="text"
          placeholder="Total Nilai"
        />
        {errors.totalValue && (
          <p className="text-red-500 text-xs">{errors.totalValue}</p>
        )}        


        <p className="text-2sm font-thin mb-2 mt-5">Tanggal Penilaian :</p>
        <input
          className="w-full pl-2 py-2 rounded-lg placeholder:placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
          value={valuationDate}
          onChange={(e) => {
            var value = e.target.value;
            setValuationDate(value);
            onChangeValuationDate(value);
          }}
          type="date"
          placeholder="Tanggal Penilaian"
        />
        {errors.valuationDate && (
          <p className="text-red-500 text-xs">{errors.valuationDate}</p>
        )}            
      </div>
    </div>
  );
};
