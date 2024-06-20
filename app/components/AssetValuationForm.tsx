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
  valuation?: Valuation | null;
  onChange: (field: keyof Valuation, value: any) => void;
}

// const AsetValuationForm: React.FC<AssetValuationDetailProps> = ({
//   valuation,
//   onChange,
// }: AssetValuationDetailProps) => {
const AsetValuationForm: React.FC<{
  valuation?: Valuation | null;
  onChange: (valuation: Valuation) => void;
}> = ({ valuation, onChange }) => {
  // Initialize state either from valuation or a default object
  const [localValuation, setLocalValuation] = useState<Valuation>(
    valuation || {
      id: null,
      valuationDate: new Date(),
      landValue: 0,
      buildingValue: 0,
      totalValue: 0,
      reportNumber: "",
      appraiser: "",
    }
  );

  // Effect to update local state if prop changes
  useEffect(() => {
    if (valuation) {
      setLocalValuation(valuation);
    }
  }, [valuation]);

  const handleInputChange = (field: keyof Valuation, value: any) => {
    const updatedValuation = { ...localValuation, [field]: value };
    setLocalValuation(updatedValuation);
    onChange(updatedValuation);
  };

  return (
    <div>
      <div className="ml-4">
        <input
          value={formatRupiah(localValuation.landValue)}
          onChange={(e) =>
            handleInputChange("landValue", filterNumeric(e.target.value))
          }
          type="text"
          placeholder="Nilai Tanah"
        />
        <input
          value={formatRupiah(localValuation.buildingValue)}
          onChange={(e) =>
            handleInputChange("buildingValue", filterNumeric(e.target.value))
          }
          type="text"
          placeholder="Nilai Bangunan"
        />
        <input
          value={formatRupiah(localValuation.totalValue)}
          onChange={(e) =>
            handleInputChange("totalValue", filterNumeric(e.target.value))
          }
          placeholder="Total Nilai"
        />
        <input
          type="date"
          value={format(new Date(localValuation.valuationDate), "yyyy-MM-dd")}
          onChange={(e) =>
            handleInputChange("valuationDate", new Date(e.target.value))
          }
        />
        <input
          value={localValuation.reportNumber}
          onChange={(e) => handleInputChange("reportNumber", e.target.value)}
          type="text"
          placeholder="No Laporan"
        />
      </div>
    </div>
  );
};

export const AssetValuationForms: React.FC<AssetValuationFormProps> = ({
  valuations,
  isEdit,
  onUpdateValuation,
}) => {
  // Initialize valuation forms from the provided valuations
  const [localValuations, setLocalValuations] = useState<Valuation[]>([]);

  // Use a key to force re-render when valuations change from the parent
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prev) => prev + 1); // Increment key to force re-render when props.valuations change
  }, [valuations]);

  const handleValuationChange = (
    index: number,
    updatedValuation: Valuation
  ) => {
    const updatedValuations = localValuations.map((val, idx) =>
      idx === index ? updatedValuation : val
    );
    setLocalValuations(updatedValuations);
    onUpdateValuation(index, updatedValuation);
  };

  useEffect(() => {
    if (isEdit) {
      // Sync local state with props when editing
      setLocalValuations(valuations);
    } else {
      // Add an initial empty form if not editing
      const initialValuation: Valuation = {
        id: null,
        valuationDate: new Date(),
        landValue: 0,
        buildingValue: 0,
        totalValue: 0,
        reportNumber: "",
        appraiser: "",
      };
      setLocalValuations([initialValuation]);
    }
  }, [valuations, isEdit]);

  const handleAddValuation = () => {
    const newEmptyValuation: Valuation = {
      id: null,
      valuationDate: new Date(),
      landValue: 0,
      buildingValue: 0,
      totalValue: 0,
      reportNumber: "",
      appraiser: "",
    };
    const newLocalValuations = [...localValuations, newEmptyValuation];
    setLocalValuations(newLocalValuations);
    onUpdateValuation(localValuations.length, newEmptyValuation);
  };

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
      <div className="flex flex-col divide-y-2" key={key}>
        {localValuations.map((valuation, index) => (
          <AsetValuationForm
            key={index} // Using index as key; use a unique id if possible
            valuation={valuation}
            onChange={(updatedValuation) =>
              handleValuationChange(index, updatedValuation)
            }
          />
        ))}
      </div>
    </div>
  );
};
