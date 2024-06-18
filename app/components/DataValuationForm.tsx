import { format } from "date-fns";
import { Valuation } from "../types/types";
import { formatRupiah } from "../utils/helper";
import { useEffect, useState } from "react";

interface DataValuationFormsProps {
  valuations: Valuation[];
  isEdit: boolean;
}

interface DataValuationFormProps {
  valuation?: Valuation | null;
}

export const DataValuationForm: React.FC<DataValuationFormProps> = ({
  valuation,
}: DataValuationFormProps) => {
  return (
    <>
      <p className="text-2sm font-thin mb-2 mt-5">Indikasi Penawaran:</p>
      <div className="ml-4">
        <p className="text-2sm font-thin mb-2 mt-5">Nilai Tanah/meter :</p>
        <input
          className="w-full pl-2 py-2 rounded-lg placeholder:placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
          value={formatRupiah(valuation != null ? valuation.landValue : 0)}
          type="text"
          placeholder="Nama Debitur"
        />

        <p className="text-2sm font-thin mb-2 mt-5">Nilai Bangunan/meter :</p>
        <input
          className="w-full pl-2 py-2 rounded-lg placeholder:placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
          value={formatRupiah(valuation != null ? valuation.buildingValue : 0)}
          type="text"
          placeholder="Nama Debitur"
        />

        <p className="text-2sm font-thin mb-2 mt-5">Total Nilai :</p>
        <input
          className="w-full pl-2 py-2 rounded-lg placeholder:placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
          value={formatRupiah(valuation != null ? valuation.totalValue : 0)}
          type="text"
          placeholder="Nama Debitur"
        />
        <p className="text-2sm font-thin mb-2 mt-5">Tanggal :</p>
        <input
          className="w-full pl-2 py-2 rounded-lg mb-4  placeholder:placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
          value={
            valuation != null
              ? format(valuation.valuationDate, "dd MMMM yyyy")
              : ""
          }
          type="text"
          placeholder="Nama Debitur"
        />
      </div>
    </>
  );
};

export const DataValuationForms: React.FC<DataValuationFormsProps> = ({
  valuations,
  isEdit,
}: DataValuationFormsProps) => {
  const [valuationComponents, setValuationComponents] = useState(
    valuations.map((valuation, index) => (
      <DataValuationForm key={index} valuation={valuation} />
    ))
  );

  const handleAddValuation = () => {
    const newValuation = (
      <DataValuationForm key={valuationComponents.length} valuation={null} />
    );
    setValuationComponents([newValuation, ...valuationComponents]);
  };

  useEffect(() => {
    const addInitialForm = async () => {
      setValuationComponents([
        <DataValuationForm key={valuationComponents.length} valuation={null} />,
      ]);
    };
    if (!isEdit) {
      addInitialForm();
    }
  }, [isEdit, valuationComponents.length]);

  return (
    <div className="flex flex-col">
      {isEdit && (
        <button
          className="flex items-center w-full hover:text-blue-500 group mt-6 mb-2"
          onClick={handleAddValuation}
        >
          <div className="h-[2px] flex-1 bg-gray-300 group-hover:bg-blue-500 mr-2"></div>
          <div className="text-sm whitespace-nowrap">+ Tambahkan Nilai</div>
          <div className="h-[2px] flex-1 bg-gray-300 group-hover:bg-blue-500 ml-2"></div>
        </button>
      )}
      <div className="flex flex-col divide-y-2">{valuationComponents}</div>
    </div>
  );
};
