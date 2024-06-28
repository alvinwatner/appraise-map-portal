import { useEffect, useState, useCallback } from "react";
import { Valuation } from "../types/types";
import { filterNumeric, formatRupiah } from "../utils/helper";

const EMPTY_VALUATION: Valuation = {
  id: 0,
  valuationDate: new Date(),
  landValue: 0,
  buildingValue: 0,
  totalValue: 0,
  reportNumber: "",
  appraiser: "",
};

interface EditAssetValuationFormsProps {
  valuations: Valuation[];
  onChangeNewValuations: (valuations: Valuation[]) => void;
  onChangeValuations: (id: number, field: keyof Valuation, value: any) => void;
}

interface EditAssetValuationFormProps {
  initialValuation: Valuation;
  onChangeValuations: (id: number, field: keyof Valuation, value: any) => void;
}

const ValuationInput: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder: string;
}> = ({ label, value, onChange, type = "text", placeholder }) => (
  <div className="ml-4">
    <p className="text-2sm font-thin mb-2 mt-5">{label} :</p>
    <input
      className="w-full pl-2 py-2 rounded-lg placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
    />
  </div>
);

const EditAssetValuationForm: React.FC<EditAssetValuationFormProps> = ({
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
      onChangeValuations(initialValuation.id, field, value);
    };

  return (
    <div>
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
      <ValuationInput
        label="No Laporan"
        value={valuation.reportNumber}
        onChange={handleInputChange("reportNumber")}
        placeholder="No Laporan"
      />
    </div>
  );
};

export const EditAssetValuationForms: React.FC<
  EditAssetValuationFormsProps
> = ({ valuations, onChangeNewValuations, onChangeValuations }) => {
  const [newValuations, setNewValuations] = useState<Valuation[]>([]);

  useEffect(() => {
    console.log(`Adding new valuations: `, JSON.stringify(newValuations));
  }, [newValuations]);

  const handleAddValuation = () => {
    const newValuation = { ...EMPTY_VALUATION, id: Date.now() };
    setNewValuations((prevValuations) => [newValuation, ...prevValuations]);
  };

  const handleNewValuationChange = useCallback(
    (field: keyof Valuation, value: any, index: number) => {
      setNewValuations((prev) =>
        prev.map((val, i) => (i === index ? { ...val, [field]: value } : val))
      );
      onChangeNewValuations(newValuations);
    },
    [newValuations, onChangeNewValuations]
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
          <AddAssetValuationFormOnEdit
            key={valuation.id}
            index={index}
            valuation={valuation}
            onChange={handleNewValuationChange}
          />
        ))}
        {valuations.map((valuation, index) => (
          <EditAssetValuationForm
            key={index}
            initialValuation={valuation}
            onChangeValuations={onChangeValuations}
          />
        ))}
      </div>
    </div>
  );
};

interface AddAssetValuationFormOnEditProps {
  index: number;
  valuation: Valuation;
  onChange: (field: keyof Valuation, value: any, index: number) => void;
}

const AddAssetValuationFormOnEdit: React.FC<
  AddAssetValuationFormOnEditProps
> = ({ index, valuation, onChange }) => {
  const handleInputChange =
    (field: keyof Valuation) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "valuationDate"
          ? e.target.value
          : Number(filterNumeric(e.target.value));
      onChange(field, value, index);
    };

  return (
    <div className="mb-8">
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
      <ValuationInput
        label="No Laporan"
        value={valuation.reportNumber}
        onChange={handleInputChange("reportNumber")}
        placeholder="No Laporan"
      />
    </div>
  );
};
