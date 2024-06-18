import React, { useState, ChangeEvent } from 'react';
import Modal from 'react-modal';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface ImportPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (jsonData: any[], dataType: string) => void;
}

interface RowData {
  propertiesType?: string | null;
  reportNumber?: string | null;
  valuationDate?: string | null;
  objectType?: string | null;
  debitur?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  landArea?: string | null;
  buildingArea?: string | null;
  landValue?: string | null;
  buildingValue?: string | null;
  totalValue?: string | null;
  coordinates?: string | null;
  appraiser?: string | null;
}

const ImportPopup: React.FC<ImportPopupProps> = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState<File | null>(null);
  const [dataType, setDataType] = useState<'asset' | 'data'>('asset');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleDataTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDataType(event.target.value as 'asset' | 'data');
  };

  const handleImport = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          const content = e.target.result as string;
          const mapData = (row: any): RowData => {
            if (dataType === 'asset') {
              return {
                valuationDate: row["TANGGAL PENILAIAN"] || null,
                objectType: row["JENIS OBJEK"] || null,
                debitur: row["NAMA DEBITUR"] || null,
                address: row["ALAMAT"] || null,
                coordinates: row["KOORDINAT"] || null,
                landArea: row["LUAS TANAH"] || null,
                buildingArea: row["LUAS BANGUNAN"] || null,
                appraiser: row["PENILAI"] || null,
                landValue: row["HARGA TANAH /mÂ²"] || null,
                totalValue: row["NILAI"] || null,
                reportNumber: row["NOMOR LAPORAN"] || null,
              };
            } else {
              return {
                valuationDate: row["TANGGAL"] || null,
                objectType: row["JENIS OBJEK"] || null,
                address: row["ALAMAT"] || null,
                phoneNumber: row["NO. HP"] || null,
                coordinates: row["KOORDINAT"] || null,
                landArea: row["LUAS TANAH"] || null,
                buildingArea: row["LUAS BANGUNAN"] || null,
                landValue: row["NILAI TANAH /mÂ²"] || null,
                buildingValue: row["NILAI BANGUNAN /mÂ²"] || null,
                totalValue: row["INDIKASI PENAWARAN/TRANSAKSI"] || null,
              };
            }
          };

          if (file.name.endsWith('.csv')) {
            const result = Papa.parse(content, { header: true });
            const jsonData: RowData[] = (result.data as any[])
              .map(mapData)
              .filter(row => Object.values(row).some(value => value !== null && value !== ''));

            onImport(jsonData, dataType);
          } else {
            const workbook = XLSX.read(content, { type: 'binary' });
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });
            const headers: string[] = sheetData[0] as string[];
            const data = sheetData.slice(1).map(row => {
              const rowData: { [key: string]: any } = {};
              (row as any[]).forEach((cell, index) => {
                rowData[headers[index]] = cell;
              });
              return rowData;
            });

            const jsonData: RowData[] = data
              .map(mapData)
              .filter(row => Object.values(row).some(value => value !== null && value !== ''));

            onImport(jsonData, dataType);
          }
        }
      };
      reader.readAsBinaryString(file);
    } else {
      console.error('Unsupported file format');
    }
    onClose();
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
          <div className="text-center font-bold text-xl mb-4">Import Data</div>
          <div className="mb-4">
            <label className="mr-4">
              <input
                type="radio"
                value="asset"
                checked={dataType === 'asset'}
                onChange={handleDataTypeChange}
              />
              Asset
            </label>
            <label>
              <input
                type="radio"
                value="data"
                checked={dataType === 'data'}
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
          <div className="flex justify-end">
            <button
              onClick={handleImport}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mr-2"
            >
              Import
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
