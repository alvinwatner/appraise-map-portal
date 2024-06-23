import { useCallback, useState } from "react";
import { Valuation } from "../types/types";
import { filterNumeric, formatRupiah } from "../utils/helper";

const EMPTY_VALUATION = {
  id: null,
  valuationDate: new Date(),
  landValue: 0,
  buildingValue: 0,
  totalValue: 0,
  reportNumber: "",
  appraiser: "",
};

interface EditAssetValuationFormsProps {
  valuations: Valuation[];
  onChange: (valuations: Valuation[]) => void;
}

interface EditAssetValuationFormProps {
  index: number;
  valuation?: Valuation | null;
  onChange: (valuation: Valuation, index: number) => void;
}

export const EditAssetValuationForm: React.FC<EditAssetValuationFormProps> = ({
  index,
  valuation,
  onChange,
}: EditAssetValuationFormProps) => {
  const [landValue, setLandValue] = useState<number>(
    valuation != null ? valuation.landValue : 0
  );
  const [buildingValue, setBuildingValue] = useState<number>(
    valuation != null ? valuation.buildingValue : 0
  );
  const [totalValue, setTotalValue] = useState<number>(
    valuation != null ? valuation.totalValue : 0
  );
  const [valuationDate, setValuationDate] = useState<string>(
    valuation != null ? valuation.valuationDate.toString() : ""
  );
  const [reportNumber, setReportNumber] = useState<string>(
    valuation != null ? valuation.reportNumber.toString() : ""
  );
  const [localValuation, setLocalValuation] = useState<Valuation>(
    valuation != null ? valuation : EMPTY_VALUATION
  );

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
            onChange(localValuation, index);
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
          }}
          placeholder="No Laporan :"
        />
      </div>
    </div>
  );
};

export const EditAssetValuationForms: React.FC<
  EditAssetValuationFormsProps
> = ({ valuations, onChange }: EditAssetValuationFormsProps) => {
  const [localValuations, setLocalValuations] = useState(valuations);
  const [valuationComponents, setValuationComponents] = useState(
    valuations.map((valuation, index) => (
      <EditAssetValuationForm
        key={index}
        index={index}
        valuation={valuation}
        onChange={(valuation, index) => {
          console.log(
            "valuation on change = " +
              JSON.stringify(valuation) +
              "index " +
              index
          );

          localValuations[index] = valuation;

          onChange(localValuations);
        }}
      />
    ))
  );

  const handleAddValuation = () => {
    const index = valuationComponents.length;
    const newValuationComponent = (
      <EditAssetValuationForm
        key={index}
        index={index}
        valuation={null}
        onChange={(valuation, index) => {
          console.log(
            "valuation on change = " +
              JSON.stringify(valuation) +
              "index " +
              index
          );

          localValuations[index] = valuation;

          onChange(localValuations);
        }}
      />
    );
    setLocalValuations([...localValuations, EMPTY_VALUATION]);
    setValuationComponents(
      [...valuationComponents, newValuationComponent].reverse()
    );
  };

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
      <div className="flex flex-col divide-y-2">{valuationComponents}</div>
    </div>
  );
};
