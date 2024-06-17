import React, { useState, ChangeEvent } from 'react';
import Modal from 'react-modal';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface ImportPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (jsonData: any[]) => void;
}

interface RowData {
  propertiesType: string | null;
  reportNumber: string | null;
  valuationDate: string | null;
  objectType: string | null;
  name: string | null;
  phoneNumber: string | null;
  address: string | null;
  landArea: string | null;
  buildingArea: string | null;
  landValue: string | null;
  buildingValue: string | null;
  totalValue: string | null;
}

const ImportPopup: React.FC<ImportPopupProps> = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleImport = () => {
    if (file) {
      if (file.name.endsWith('.csv') || file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target && e.target.result) {
            const content = e.target.result as string;
            const mapData = (row: any): RowData => {
              return {
                propertiesType: row["Jenis Data"] || null,
                reportNumber: row["No. Laporan"] || null,
                valuationDate: row["Tanggal Penilaian"] || null,
                objectType: row["Jenis Objek"] || null,
                name: row["Nama Debitor"] || null,
                phoneNumber: row["No Telepon"] || null,
                address: row["Alamat"] || null,
                landArea: row["Luas Tanah"] || null,
                buildingArea: row["Luas Bangunan"] || null,
                landValue: row["Nilai Tanah"] || null,
                buildingValue: row["Nilai Bangunan"] || null,
                totalValue: row["Nilai"] || null,
              };
            };

            if (file.name.endsWith('.csv')) {
              const result = Papa.parse(content, { header: true });
              const jsonData: RowData[] = (result.data as any[])
                .map(mapData)
                .filter(row => Object.values(row).some(value => value !== null && value !== ''));

              const isValid = jsonData.every(row => row.propertiesType === 'data' || row.propertiesType === 'aset');
              if (!isValid) {
                alert("Invalid 'Jenis Data'. Must be 'data' or 'aset'.");
                return;
              }

              onImport(jsonData);
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

              const isValid = jsonData.every(row => row.propertiesType === 'data' || row.propertiesType === 'aset');
              if (!isValid) {
                alert("Invalid 'Jenis Data'. Must be 'data' or 'aset'.");
                return;
              }

              onImport(jsonData);
            }
          }
        };
        reader.readAsBinaryString(file);
      } else {
        console.error('Unsupported file format');
      }
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
          <input
            type="file"
            onChange={handleFileChange}
            accept=".csv, .xls, .xlsx" // Only allow CSV and Excel files
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
