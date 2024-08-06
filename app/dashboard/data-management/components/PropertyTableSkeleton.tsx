import React from "react";


export const PropertyTableSkeleton: React.FC = () => {
  const skeletonHeaders = [
    "Jenis Data",
    "No. Laporan",
    "Tanggal Penilaian",
    "Penilai",
    "Jenis Objek",
    "Nama Debitor",
    "Nomor Tlp",
    "Alamat",
    "Luas Tanah",
    "Luas Bangunan",
    "Nilai Tanah / Meter",
    "Nilai Bangunan / Meter",
    "Nilai",
  ];

  return (
    <div className="mt-10 w-[75vw]">
      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              {skeletonHeaders.map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: 10 }).map((_, index) => (
              <tr key={index} className="animate-pulse">
                {Array.from({ length: skeletonHeaders.length }).map((_, i) => (
                  <td key={i} className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};