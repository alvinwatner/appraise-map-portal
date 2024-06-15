import { Valuation } from "../types/types";

interface DataValuationFormProps {
  valuations?: Valuation[];
}

export const DataValuationForm: React.FC<DataValuationFormProps> = ({
  valuations,
} : DataValuationFormProps) => {
  return (
    <>
      <p className="text-2sm font-thin mb-2 mt-5">Indikasi Penawaran:</p>
      <div className="ml-4">
        <p className="text-2sm font-thin mb-2 mt-5">Nominal :</p>
        <input
          className="w-full pl-2 py-2 rounded-lg placeholder: placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
          type="text"
          placeholder="Nama Debitur"
        />

        <p className="text-2sm font-thin mb-2 mt-5">Tanggal :</p>
        <input
          className="w-full pl-2 py-2 rounded-lg placeholder: placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
          type="text"
          placeholder="Nama Debitur"
        />
      </div>
    </>
  );
};
