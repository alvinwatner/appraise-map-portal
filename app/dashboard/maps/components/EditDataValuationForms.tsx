import { useEffect, useState, useCallback } from "react";
import { Valuation } from "../../../types/types";
import { filterNumeric, formatRupiah } from "../../../utils/helper";
import { ValuationInput } from "./ValuationInput";

const EMPTY_VALUATION: Valuation = {  
  PropertyId: 0,
  valuationDate: new Date(),
  landValue: 0,
  buildingValue: 0,
  totalValue: 0,
  reportNumber: "",
  appraiser: "",
};

interface EditDataValuationFormsProps {
  valuations: Valuation[];
  propertyId: number;
  onChangeNewValuations: (valuations: Valuation[]) => void;
  onChangeValuations: (id: number, field: keyof Valuation, value: any) => void;
}

interface EditDataValuationFormProps {
  initialValuation: Valuation;
  onChangeValuations: (id: number, field: keyof Valuation, value: any) => void;
}

const EditDataValuationForm: React.FC<EditDataValuationFormProps> = ({
  initialValuation,
  onChangeValuations,
}) => {
  const [valuation, setValuation] = useState(initialValuation);

  const handleInputChange =
    (field: keyof Valuation) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "valuationDate"
          ? e.target.value
          : Number(filterNumeric(e.target.value));
      setValuation((prev) => ({ ...prev, [field]: value }));
      onChangeValuations(initialValuation.id ?? 0, field, value);
    };

  return (
    <div className="mb-4">
      <ValuationInput
        label="Nilai Tanah/meter"
        value={formatRupiah(valuation.landValue)}
        onChange={handleInputChange("landValue")}
        placeholder="Nilai Tanah"
      />
      <ValuationInput
        label="Nilai Bangunan/meter"
        value={formatRupiah(valuation.buildingValue)}
        onChange={handleInputChange("buildingValue")}
        placeholder="Nilai Bangunan"
      />
      <ValuationInput
        label="Total Nilai"
        value={formatRupiah(valuation.totalValue)}
        onChange={handleInputChange("totalValue")}
        placeholder="Total Nilai"
      />
      <ValuationInput
        label="Tanggal"
        value={valuation.valuationDate.toString()}
        onChange={handleInputChange("valuationDate")}
        type="date"
        placeholder="Tanggal"
      />
    </div>
  );
};

export const EditDataValuationForms: React.FC<EditDataValuationFormsProps> = ({
  valuations,
  propertyId,
  onChangeNewValuations,
  onChangeValuations,
}) => {
  const [newValuations, setNewValuations] = useState<Valuation[]>([]);

  useEffect(() => {
    // console.log(`Adding new valuations: `, JSON.stringify(newValuations));
  }, [newValuations]);

  const handleAddValuation = () => {
    console.log("property id inside edit aset valuation form " + propertyId);
    const newValuation = {
      ...EMPTY_VALUATION,
      PropertyId: propertyId,
    };
    setNewValuations((prevValuations) => [newValuation, ...prevValuations]);
  };

  const handleNewValuationChange = useCallback(
    (field: keyof Valuation, value: any, index: number) => {
      setNewValuations((prev) => {
        const updated = prev.map((val, i) =>
          i === index ? { ...val, [field]: value } : val
        );
        onChangeNewValuations(updated);
        return updated;
      });
    },
    [onChangeNewValuations]
  );

  return (
    <div className="flex flex-col">
      <button
        className="flex items-center w-full hover:text-blue-500 group mt-6 mb-2"
        onClick={handleAddValuation}
      >
        <div className="h-[2px] flex-1 bg-gray-300 group-hover:bg-blue-500 mr-2"></div>
        <div className="text-sm whitespace-nowrap">+ Tambahkan Nilai</div>
        <div className="h-[2px] flex-1 bg-gray-300 group-hover:bg-blue-500 ml-2"></div>
      </button>
      <div className="flex flex-col divide-y-2">
        {newValuations.map((valuation, index) => (
          <AddDataValuationFormOnEdit
            key={valuation.id}
            propertyId={propertyId}
            index={index}
            valuation={valuation}
            onChange={handleNewValuationChange}
          />
        ))}
        {valuations.map((valuation, index) => (
          <EditDataValuationForm
            key={index}
            initialValuation={valuation}
            onChangeValuations={onChangeValuations}
          />
        ))}
      </div>
    </div>
  );
};

interface AddDataValuationFormOnEditProps {
  index: number;
  propertyId: number;
  valuation: Valuation;
  onChange: (field: keyof Valuation, value: any, index: number) => void;
}

const AddDataValuationFormOnEdit: React.FC<AddDataValuationFormOnEditProps> = ({
  index,
  valuation,
  onChange,
}) => {
  const handleInputChange =
    (field: keyof Valuation) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "landValue" ||
        field === "buildingValue" ||
        field === "totalValue"
          ? Number(filterNumeric(e.target.value))
          : e.target.value;
      onChange(field, value, index);
    };

  return (
    <div className="mb-4">
      <ValuationInput
        label="Nilai Tanah/meter"
        value={formatRupiah(valuation.landValue)}
        onChange={handleInputChange("landValue")}
        placeholder="Nilai Tanah"
      />
      <ValuationInput
        label="Nilai Bangunan/meter"
        value={formatRupiah(valuation.buildingValue)}
        onChange={handleInputChange("buildingValue")}
        placeholder="Nilai Bangunan"
      />
      <ValuationInput
        label="Total Nilai"
        value={formatRupiah(valuation.totalValue)}
        onChange={handleInputChange("totalValue")}
        placeholder="Total Nilai"
      />
      <ValuationInput
        label="Tanggal Penilaian"
        value={valuation.valuationDate.toString()}
        onChange={handleInputChange("valuationDate")}
        type="date"
        placeholder="Tanggal Penilaian"
      />
    </div>
  );
};
