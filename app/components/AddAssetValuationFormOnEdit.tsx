import { useCallback, useState } from "react";
import { Valuation } from "../types/types";
import { filterNumeric, formatRupiah } from "../utils/helper";

interface AddAssetValuationFormOnEditProps {
  index: number;
  valuation: Valuation;
  onChange: (field: keyof Valuation, value: any, index: number) => void;
}

export const AddAssetValuationFormOnEdit: React.FC<
  AddAssetValuationFormOnEditProps
> = ({ index, valuation, onChange }: AddAssetValuationFormOnEditProps) => {
  const [landValue, setLandValue] = useState<number>(0);
  const [buildingValue, setBuildingValue] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [valuationDate, setValuationDate] = useState<string>("");
  const [reportNumber, setReportNumber] = useState<string>("");
  const [localValuation, setLocalValuation] =
    useState<Valuation>(valuation);

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
            localValuation.landValue = value;            
            onChange("landValue", value, index);
          }}
          type="text"
          placeholder="Nilai Tanah"
        />

        <p className="text-2sm font-thin mb-2 mt-5">Nilai Bangunan/meter :</p>
        <input
          className="w-full pl-2 py-2 rounded-lg placeholder:placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
          value={formatRupiah(buildingValue)}
          onChange={(e) => {
            var value = Number(filterNumeric(e.target.value));
            setBuildingValue(value);
            localValuation.buildingValue = value;
            onChange("buildingValue", value, index);
          }}
          type="text"
          placeholder="Nilai Bangunan"
        />

        <p className="text-2sm font-thin mb-2 mt-5">Total Nilai :</p>
        <input
          className="w-full pl-2 py-2 rounded-lg placeholder:placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
          value={formatRupiah(totalValue)}
          onChange={(e) => {
            var value = Number(filterNumeric(e.target.value));
            setTotalValue(value);
            localValuation.totalValue = value;
            onChange("totalValue", value, index);
          }}
          type="text"
          placeholder="Total Nilai"
        />
        <p className="text-2sm font-thin mb-2 mt-5">Tanggal Penilaian :</p>
        <input
          className="w-full pl-2 py-2 rounded-lg placeholder:placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
          value={valuationDate}
          onChange={(e) => {
            var value = e.target.value;
            setValuationDate(value);
            localValuation.valuationDate = new Date(value);
            onChange("valuationDate", value, index);
          }}
          type="date"
          placeholder="Tanggal Penilaian"
        />
        <p className="text-2sm font-thin mb-2 mt-5">No Laporan :</p>
        <input
          className="w-full pl-2 py-2 rounded-lg placeholder:placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm mb-4 overflow-hidden whitespace-nowrap text-overflow-ellipsis"
          value={reportNumber}
          type="text"
          onChange={(e) => {
            var value = e.target.value;
            setReportNumber(value);
            localValuation.reportNumber = value;
            onChange("reportNumber", value, index);
          }}
          placeholder="No Laporan :"
        />
      </div>
    </div>
  );
};
