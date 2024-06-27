import { useEffect, useState } from "react";
import { Valuation } from "../types/types";
import { filterNumeric, formatRupiah } from "../utils/helper";
import { AddAssetValuationForm } from "./AddAssetValuationForm";
import { AddAssetValuationFormOnEdit } from "./AddAssetValuationFormOnEdit";

const EMPTY_VALUATION = {
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

export const EditAssetValuationForm: React.FC<EditAssetValuationFormProps> = ({
  initialValuation,
  onChangeValuations,
}: EditAssetValuationFormProps) => {
  const [landValue, setLandValue] = useState<number>(
    initialValuation.landValue
  );
  const [buildingValue, setBuildingValue] = useState<number>(
    initialValuation.buildingValue
  );
  const [totalValue, setTotalValue] = useState<number>(
    initialValuation.totalValue
  );
  const [valuationDate, setValuationDate] = useState<string>(
    initialValuation.valuationDate?.toString()
  );
  const [reportNumber, setReportNumber] = useState<string>(
    initialValuation.reportNumber
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
            onChangeValuations(initialValuation.id, "landValue", value);
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
            onChangeValuations(initialValuation.id, "buildingValue", value);
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
            onChangeValuations(initialValuation.id, "totalValue", value);
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
            onChangeValuations(initialValuation.id, "valuationDate", value);
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
            onChangeValuations(initialValuation.id, "reportNumber", value);
          }}
          placeholder="No Laporan :"
        />
      </div>
    </div>
  );
};

export const EditAssetValuationForms: React.FC<
  EditAssetValuationFormsProps
> = ({
  valuations,
  onChangeNewValuations,
  onChangeValuations,
}: EditAssetValuationFormsProps) => {
  const [newValuations, setNewValuations] = useState<Valuation[]>([]);
  const [currentNewValuation, setCurrentNewValuation] = useState<Valuation>();
  const [newValuationsIndex, setNewValuationsIndex] = useState<number>(0);
  const [newValuationComponents, setNewValuationComponents] = useState<
    JSX.Element[]
  >([]);
  const [valuationComponents, setValuationComponents] = useState(
    valuations.map((valuation, index) => (
      <EditAssetValuationForm
        key={index}
        initialValuation={valuation}
        onChangeValuations={(id, field, value) => {
          onChangeValuations(id, field, value);
        }}
      />
    ))
  );

  useEffect(() => {
    const components = Array.from(valuations.entries()).map(
      ([id, valuation]) => (
        <EditAssetValuationForm
          key={id}
          initialValuation={valuation}
          onChangeValuations={(id, field, value) => {
            onChangeValuations(id, field, value);
          }}
        />
      )
    );

    setValuationComponents(components);
  }, [onChangeValuations, valuations]);

  useEffect(() => {
    console.log(`adding new valuations `, JSON.stringify(newValuations));
  }, [newValuations]);

  const handleChange = (field: keyof Valuation, value: any, index: number) => {
    console.log(`CISIII new valuations `, JSON.stringify(newValuations));
    // const updatedValue = { ...newValuations[index], [field]: value };
    // console.log(`after update valuation = ${JSON.stringify(updatedValue)}`);
  };

  const handleAddValuation = () => {
    const newValuation = { ...EMPTY_VALUATION, id: Date.now() }; // Ensure unique id for key

    setNewValuations((prevValuations) => {
      // console.log("Previous valuations before adding new:", prevValuations);
      console.log(`CUBUUU AHAI new valuations `, JSON.stringify(prevValuations));
      const updatedValuations = [...prevValuations, newValuation];
      // console.log("Updated valuations after adding new:", updatedValuations);
      return updatedValuations;
    });

    setNewValuationComponents((prevComponents) => [
      <AddAssetValuationFormOnEdit
        key={newValuation.id}
        index={prevComponents.length} // index is the position in the array
        valuation={newValuation}
        onChange={handleChange}
      />,
      ...prevComponents,
    ]);
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
      <div className="flex flex-col divide-y-2">
        {newValuationComponents}
        {valuationComponents}
      </div>
    </div>
  );
};
