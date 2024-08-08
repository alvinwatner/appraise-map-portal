import React, { useState, ChangeEvent } from "react";
import Modal from "react-modal";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { parse, format } from "date-fns";
import Loading from "@/app/components/Loading";

interface ImportPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (jsonData: any[], dataType: string) => void;
}

interface RowData {
  valuationDate?: string | null;
  objectType?: string | null;
  debitur?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  address?: string | null;
  landArea?: string | null;
  buildingArea?: string | null;
  appraiser?: string | null;
  buildingValue?: string | null;
  landValue?: string | null;
  totalValue?: string | null;
  reportNumber?: string | null;
  phoneNumber?: string | null;
}

const requiredFields = {
  asset: [
    "TANGGAL PENILAIAN",
    "JENIS OBJEK",
    "NAMA DEBITUR",
    "LATITUDE",
    "LONGITUDE",
    "ALAMAT",
    "LUAS TANAH",
    "LUAS BANGUNAN",
    "PENILAI",
    "HARGA BANGUNAN /m²",
    "HARGA TANAH /m²",
    "NILAI",
    "NOMOR LAPORAN",
  ],
  data: [
    "TANGGAL",
    "JENIS OBJEK",
    "LATITUDE",
    "LONGITUDE",
    "ALAMAT",
    "NO. HP",
    "LUAS TANAH",
    "LUAS BANGUNAN",
    "NILAI TANAH /m²",
    "NILAI BANGUNAN /m²",
    "INDIKASI PENAWARAN/TRANSAKSI",
  ],
};

const exampleRows = {
  asset: [
    [
      "2023-01-01",
      "Tanah",
      "John Doe",
      "123.456",
      "789.012",
      "Jalan Raya No. 1",
      "1000",
      "200",
      "Jane Smith",
      "150000",
      "300000",
      "450000",
      "12345",
    ],
  ],
  data: [
    [
      "2023-01-01",
      "Tanah",
      "123.456",
      "789.012",
      "Jalan Raya No. 1",
      "08123456789",
      "1000",
      "200",
      "150000",
      "300000",
      "400000",
    ],
  ],
};

const downloadTemplate = (templateType: "asset" | "data") => {
  const ws = XLSX.utils.aoa_to_sheet([
    requiredFields[templateType],
    ...exampleRows[templateType],
  ]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  const s2ab = (s: string) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
  const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download =
    templateType === "asset" ? "asset_template.xlsx" : "data_template.xlsx";
  link.click();
  window.URL.revokeObjectURL(url);
};

const parseDate = (dateValue: any): string | null => {
  if (typeof dateValue === "number") {
    const excelStartDate = new Date(1899, 11, 30);
    const daysSinceStart = Math.floor(dateValue);
    const jsDate = new Date(
      excelStartDate.getTime() + daysSinceStart * 24 * 60 * 60 * 1000
    );
    return format(jsDate, "yyyy-MM-dd");
  } else if (typeof dateValue === "string") {
    const formats = ["dd-MM-yyyy", "yyyy-MM-dd", "MM/dd/yyyy"];
    for (const formatStr of formats) {
      const parsedDate = parse(dateValue, formatStr, new Date());
      if (!isNaN(parsedDate.getTime())) {
        return format(parsedDate, "yyyy-MM-dd");
      }
    }
  }
  return null;
};

const mapData = (row: any, dataType: "asset" | "data"): RowData => {
  if (dataType === "asset") {
    return {
      valuationDate: parseDate(row["TANGGAL PENILAIAN"]) || null,
      objectType: row["JENIS OBJEK"] || null,
      debitur: row["NAMA DEBITUR"] || null,
      latitude: row["LATITUDE"] || null,
      longitude: row["LONGITUDE"] || null,
      address: row["ALAMAT"] || null,
      landArea: row["LUAS TANAH"] || null,
      buildingArea: row["LUAS BANGUNAN"] || null,
      appraiser: row["PENILAI"] || null,
      buildingValue: row["HARGA BANGUNAN /m²"] || null,
      landValue: row["HARGA TANAH /m²"] || null,
      totalValue: row["NILAI"] || null,
      reportNumber: row["NOMOR LAPORAN"] || null,
    };
  } else {
    return {
      valuationDate: parseDate(row["TANGGAL"]) || null,
      objectType: row["JENIS OBJEK"] || null,
      latitude: row["LATITUDE"] || null,
      longitude: row["LONGITUDE"] || null,
      address: row["ALAMAT"] || null,
      phoneNumber: row["NO. HP"] || null,
      landArea: row["LUAS TANAH"] || null,
      buildingArea: row["LUAS BANGUNAN"] || null,
      landValue: row["NILAI TANAH /m²"] || null,
      buildingValue: row["NILAI BANGUNAN /m²"] || null,
      totalValue: row["INDIKASI PENAWARAN/TRANSAKSI"] || null,
    };
  }
};

const ImportPopup: React.FC<ImportPopupProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [dataType, setDataType] = useState<"asset" | "data">("asset");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleDataTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDataType(event.target.value as "asset" | "data");
  };

  const validateHeaders = (headers: string[]): string[] => {
    const required = requiredFields[dataType];
    return required.filter((field) => !headers.includes(field));
  };

  const handleImport = () => {
    if (file) {
      setLoading(true);
      setErrorMessage(null);

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          const content = e.target.result as string;

          try {
            if (file.name.endsWith(".csv")) {
              const result = Papa.parse(content, { header: true });
              const headers = result.meta.fields || [];
              const missingFields = validateHeaders(headers);

              if (missingFields.length > 0) {
                setErrorMessage(
                  `Missing required fields in CSV file: ${missingFields.join(
                    ", "
                  )}.`
                );
                setLoading(false);
                return;
              }

              const jsonData: RowData[] = (result.data as any[])
                .map((row) => mapData(row, dataType))
                .filter((row) =>
                  Object.values(row).some(
                    (value) => value !== null && value !== ""
                  )
                );

              onImport(jsonData, dataType);
            } else if (
              file.name.endsWith(".xls") ||
              file.name.endsWith(".xlsx")
            ) {
              const workbook = XLSX.read(content, { type: "binary" });
              const sheetData = XLSX.utils.sheet_to_json(
                workbook.Sheets[workbook.SheetNames[0]],
                { header: 1 }
              );
              const headers: string[] = sheetData[0] as string[];
              const missingFields = validateHeaders(headers);

              if (missingFields.length > 0) {
                setErrorMessage(
                  `Missing required fields in Excel file: ${missingFields.join(
                    ", "
                  )}.`
                );
                setLoading(false);
                return;
              }

              const data = sheetData.slice(1).map((row) => {
                const rowData: { [key: string]: any } = {};
                (row as any[]).forEach((cell, index) => {
                  rowData[headers[index]] = cell;
                });
                return rowData;
              });

              const jsonData: RowData[] = data
                .map((row) => mapData(row, dataType))
                .filter((row) =>
                  Object.values(row).some(
                    (value) => value !== null && value !== ""
                  )
                );

              onImport(jsonData, dataType);
              setLoading(false);
              onClose();
            } else {
              setErrorMessage("Unsupported file format");
            }
          } catch (error: any) {
            setErrorMessage("Failed to import data: " + error.message);
          }
        }
      };
      reader.readAsBinaryString(file);
    } else {
      setErrorMessage("No file selected");
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Import Data Modal"
      ariaHideApp={false}
      className="flex items-center justify-center mt-52"
      overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75"
    >
      <div className="bg-white w-full max-w-md rounded-lg overflow-hidden shadow-md">
        <div className="px-6 py-4">
          <div className="text-center font-bold text-xl mb-4">
            Import Property
          </div>
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded-lg">
              {errorMessage}
            </div>
          )}
          <div className="mb-4">
            <label className="mr-4">
              <input
                type="radio"
                value="asset"
                checked={dataType === "asset"}
                onChange={handleDataTypeChange}
              />
              Aset
            </label>
            <label>
              <input
                type="radio"
                value="data"
                checked={dataType === "data"}
                onChange={handleDataTypeChange}
              />
              Data
            </label>
          </div>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".csv, .xls, .xlsx"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
          />
          <div className="flex flex-col justify-end items-start">
            <button
              className="text-center text-sm mb-2 underline text-blue-500"
              onClick={() => downloadTemplate("asset")}
            >
              Download template aset
            </button>
            <button
              className="text-center text-sm mb-2 underline text-blue-500"
              onClick={() => downloadTemplate("data")}
            >
              Download template data
            </button>
          </div>
          <div className="flex justify-end mb-4">
            <button
              onClick={handleImport}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mr-2"
            >
              {loading ? <Loading size="w-5 h-5" /> : "Import"}
            </button>
            <button
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ImportPopup;
