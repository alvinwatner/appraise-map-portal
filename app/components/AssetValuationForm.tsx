import React, { useCallback, useEffect, useState } from "react";
import { Valuation } from "../types/types";
import { filterNumeric, formatRupiah } from "../utils/helper";
import { format } from "date-fns";

interface AssetValuationFormProps {
  valuations: Valuation[];
  isEdit: boolean;
  onUpdateValuation: (index: number, valuation: Valuation) => void;
}

interface AssetValuationDetailProps {
  onChangeLandValue: (value: number) => void;
  onChangeBuildingValue: (value: number) => void;
  onChangeTotalValue: (value: number) => void;
  onChangeValuationDate: (value: string) => void;
  onChangeReportNumber: (value: string) => void;
}

export const AsetValuationForm: React.FC<AssetValuationDetailProps> = ({
  onChangeLandValue,
  onChangeBuildingValue,
  onChangeTotalValue,
  onChangeReportNumber,
  onChangeValuationDate,
}: AssetValuationDetailProps) => {
  const [landValue, setLandValue] = useState<number>(0);
  const [buildingValue, setBuildingValue] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [valuationDate, setValuationDate] = useState<string>("");
  const [reportNumber, setReportNumber] = useState<string>("");

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
        <p className="text-2sm font-thin mb-2 mt-5">No Laporan :</p>
        <input
          className="w-full pl-2 py-2 rounded-lg placeholder:placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm mb-4 overflow-hidden whitespace-nowrap text-overflow-ellipsis"
          value={reportNumber}
          type="text"
          onChange={(e) => {
            var value = e.target.value;
            setReportNumber(value);
            onChangeReportNumber(value);
          }}
          placeholder="No Laporan :"
        />
      </div>
    </div>
  );
};

// export const AssetValuationForms: React.FC<AssetValuationFormProps> = ({
//   valuations,
//   isEdit,
//   onUpdateValuation,
// }: AssetValuationFormProps) => {
//   const [valuationComponents, setValuationComponents] = useState(
//     valuations.map((valuation, index) => <AsetValuationForm key={index} />)
//   );

//   const handleValuationChange = useCallback(
//     (index: number, field: keyof Valuation, value: any) => {
//       const updatedValuation = { ...valuations[index], [field]: value };
//       onUpdateValuation(index, updatedValuation);
//     },
//     [onUpdateValuation, valuations]
//   );

//   const handleAddValuation = () => {
//     const newValuation = <AsetValuationForm key={0} />;
//     setValuationComponents([newValuation, ...valuationComponents]);
//   };

//   useEffect(() => {
//     const addInitialForm = async () => {
//       setValuationComponents([<AsetValuationForm key={1} />]);
//     };
//     if (!isEdit) {
//       addInitialForm();
//     }
//   }, [handleValuationChange, isEdit, valuationComponents.length]);

//   return (
//     <div className="flex flex-col">
//       {isEdit && (
//         <button
//           className="flex items-center w-full hover:text-blue-500 group mt-6 mb-2"
//           onClick={handleAddValuation}
//         >
//           <div className="h-[2px] flex-1 bg-gray-300 group-hover:bg-blue-500 mr-2"></div>
//           <div className="text-sm whitespace-nowrap">+ Tambahkan Nilai</div>
//           <div className="h-[2px] flex-1 bg-gray-300 group-hover:bg-blue-500 ml-2"></div>
//         </button>
//       )}
//       <div className="flex flex-col divide-y-2">{valuationComponents}</div>
//     </div>
//   );
// };
