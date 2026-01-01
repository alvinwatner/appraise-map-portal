import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

  const tableWidthPercentage = 100 - 26;

  return (
    <div className="mt-6" style={{ width: `${tableWidthPercentage}vw` }}>
      <div className="overflow-x-auto">
        <Table className="w-full bg-white border border-gray-200">
          <TableHeader>
            <TableRow className="bg-gray-100 uppercase text-sm leading-normal">
              {skeletonHeaders.map((header) => (
                <TableHead
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index} className="animate-pulse">
                {Array.from({ length: skeletonHeaders.length }).map((_, i) => (
                  <TableCell key={i} className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
