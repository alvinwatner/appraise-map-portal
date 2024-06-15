import React from "react";
import { Valuation } from "../types/types";
import { formatRupiah } from "../utils/helper";
import { format } from "date-fns";

interface AssetValuationFormProps {
  valuations: Valuation[];
}

interface AssetValuationDetailProps {
  valuation: Valuation;
}

const ValuationDetails: React.FC<AssetValuationDetailProps> = ({
  valuation,
}: AssetValuationDetailProps) => {
  return (
    <div>
      <p className="text-2sm font-thin mb-2 mt-5">Nilai:</p>
      <div className="ml-4">
        <p className="text-2sm font-thin mb-2 mt-5">Nilai Tanah/meter :</p>
        <input
          className="w-full pl-2 py-2 rounded-lg placeholder:placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
          value={formatRupiah(valuation.landValue)}
          type="text"
          placeholder="Nama Debitur"
        />

        <p className="text-2sm font-thin mb-2 mt-5">Nilai Bangunan/meter :</p>
        <input
          className="w-full pl-2 py-2 rounded-lg placeholder:placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
          value={formatRupiah(valuation.buildingValue)}
          type="text"
          placeholder="Nama Debitur"
        />

        <p className="text-2sm font-thin mb-2 mt-5">Total Nilai :</p>
        <input
          className="w-full pl-2 py-2 rounded-lg placeholder:placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
          value={formatRupiah(valuation.totalValue)}
          type="text"
          placeholder="Nama Debitur"
        />
        <p className="text-2sm font-thin mb-2 mt-5">Tanggal Penilaian :</p>
        <input
          className="w-full pl-2 py-2 rounded-lg placeholder:placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
          value={format(valuation.valuationDate, "dd MMMM yyyy")}
          type="text"
          placeholder="Nama Debitur"
        />
        <p className="text-2sm font-thin mb-2 mt-5">No Laporan :</p>
        <input
          className="w-full pl-2 py-2 rounded-lg placeholder:placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm mb-4 overflow-hidden whitespace-nowrap text-overflow-ellipsis"
          value={valuation.reportNumber}
          type="text"
          placeholder="Nama Debitur"
        />
      </div>
    </div>
  );
};

export const AssetValuationForm: React.FC<AssetValuationFormProps> = ({
  valuations,
}: AssetValuationFormProps) => {
  const dummyValuations = [valuations[0], valuations[0]];
  return (
    <div className="flex flex-col">
      <div className="flex flex-col divide-y-2 mb-4">
        {dummyValuations.map((valuation) => (
          <>
            <ValuationDetails valuation={valuation} />
          </>
        ))}
      </div>

      <button className="flex items-center w-full hover:text-blue-500 group">
        <div className="h-[2px] flex-1 bg-gray-300 group-hover:bg-blue-500 mr-2"></div>
        <div className="text-sm whitespace-nowrap">+ Tambahkan Nilai</div>
        <div className="h-[2px] flex-1 bg-gray-300 group-hover:bg-blue-500 ml-2"></div>
      </button>
    </div>
  );
};
