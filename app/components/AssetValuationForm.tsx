import React, { useCallback, useEffect, useState } from "react";
import { Valuation } from "../types/types";
import { formatRupiah } from "../utils/helper";
import { format } from "date-fns";

interface AssetValuationFormProps {
  valuations: Valuation[];
  isEdit: boolean;
  onUpdateValuation: (index: number, valuation: Valuation) => void;
}

interface AssetValuationDetailProps {
  valuation?: Valuation | null;
  onChange: (field: keyof Valuation, value: any) => void;
}

const AsetValuationForm: React.FC<AssetValuationDetailProps> = ({
  valuation,
  onChange,
}: AssetValuationDetailProps) => {
  return (
    <div>
      <p className="text-2sm font-thin mb-2 mt-5">Nilai:</p>
      <div className="ml-4">
        <p className="text-2sm font-thin mb-2 mt-5">Nilai Tanah/meter :</p>
        <input
          className="w-full pl-2 py-2 rounded-lg placeholder:placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
          value={formatRupiah(valuation != null ? valuation.landValue : 0)}
          onChange={(e) =>
            onChange(
              "landValue",
              formatRupiah(valuation != null ? valuation.landValue : 0)
            )
          }
          type="text"
          placeholder="Nilai Tanah"
        />

        <p className="text-2sm font-thin mb-2 mt-5">Nilai Bangunan/meter :</p>
        <input
          className="w-full pl-2 py-2 rounded-lg placeholder:placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
          value={formatRupiah(valuation != null ? valuation.buildingValue : 0)}
          onChange={(e) =>
            onChange(
              "buildingValue",
              formatRupiah(valuation != null ? valuation.buildingValue : 0)
            )
          }
          type="text"
          placeholder="Nilai Bangunan"
        />

        <p className="text-2sm font-thin mb-2 mt-5">Total Nilai :</p>
        <input
          className="w-full pl-2 py-2 rounded-lg placeholder:placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
          value={formatRupiah(valuation != null ? valuation.totalValue : 0)}
          onChange={(e) =>
            onChange(
              "totalValue",
              formatRupiah(valuation != null ? valuation.totalValue : 0)
            )
          }
          type="text"
          placeholder="Total Nilai"
        />
        <p className="text-2sm font-thin mb-2 mt-5">Tanggal Penilaian :</p>
        <input
          className="w-full pl-2 py-2 rounded-lg placeholder:placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
          value={
            valuation != null
              ? format(valuation.valuationDate, "dd/MM/yyyy")
              : ""
          }
          onChange={(e) =>
            onChange(
              "valuationDate",
              valuation != null
                ? format(valuation.valuationDate, "dd/MM/yyyy")
                : ""
            )
          }
          type="text"
          placeholder="Tanggal Penilaian"
        />
        <p className="text-2sm font-thin mb-2 mt-5">No Laporan :</p>
        <input
          className="w-full pl-2 py-2 rounded-lg placeholder:placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm mb-4 overflow-hidden whitespace-nowrap text-overflow-ellipsis"
          value={valuation != null ? valuation.reportNumber : ""}
          type="text"
          onChange={(e) =>
            onChange(
              "reportNumber",
              valuation != null
                ? valuation.reportNumber
                : ""
            )
          }
          placeholder="No Laporan :"
        />
      </div>
    </div>
  );
};

export const AssetValuationForms: React.FC<AssetValuationFormProps> = ({
  valuations,
  isEdit,
  onUpdateValuation,
}: AssetValuationFormProps) => {
  const [valuationComponents, setValuationComponents] = useState(
    valuations.map((valuation, index) => (
      <AsetValuationForm
        key={index}
        valuation={valuation}
        onChange={(field, value) => handleValuationChange(index, field, value)}
      />
    ))
  );

  const handleValuationChange = useCallback(
    (index: number, field: keyof Valuation, value: any) => {
      const updatedValuation = { ...valuations[index], [field]: value };
      onUpdateValuation(index, updatedValuation);
    },
    [onUpdateValuation, valuations]
  );

  const handleAddValuation = () => {
    const newValuation = (
      <AsetValuationForm
        key={0}
        valuation={null}
        onChange={(field, value) =>
          handleValuationChange(valuationComponents.length + 1, field, value)
        }
      />
    );
    setValuationComponents([newValuation, ...valuationComponents]);
  };

  useEffect(() => {
    const addInitialForm = async () => {
      setValuationComponents([
        <AsetValuationForm
          key={1}
          valuation={null}
          onChange={(field, value) => handleValuationChange(1, field, value)}
        />,
      ]);
    };
    if (!isEdit) {
      addInitialForm();
    }
  }, [handleValuationChange, isEdit, valuationComponents.length]);

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
