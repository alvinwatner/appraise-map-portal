import Dropdown from '@/app/components/Dropdown';
import React, { useState } from 'react';

type FilterModalProps = {
  onApply: (filters: any) => void;
  onClose: () => void;
};

const FilterModal: React.FC<FilterModalProps> = ({ onApply, onClose }) => {
  const options = ["Aset", "Pembanding"];
  const [propertyType, setPropertyType] = useState('');
  const [valuationDate, setValuationDate] = useState('');
  const [objectType, setObjectType] = useState('');
  const [minTotalValue, setMinTotalValue] = useState('');
  const [maxTotalValue, setMaxTotalValue] = useState('');

  const handleApply = () => {
    const filters = {
      propertyType,
      valuationDate,
      objectType,
      minTotalValue: minTotalValue ? Number(minTotalValue) : undefined,
      maxTotalValue: maxTotalValue ? Number(maxTotalValue) : undefined,
    };
    onApply(filters);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h2 className="text-xl mb-4">Filter Properties</h2>
        <div className="mb-4">
          <label className="block mb-2">Jenis Data</label>
          {/* <input
            type="text"
            className="w-full px-4 py-2 border rounded"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          /> */}
          <Dropdown placeholder="Jenis Data" options={options} onChange={(e) => console.log("Selected option:", e)}/>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Tanggal Penilaian</label>
          <input
            type="date"
            className="w-full px-4 py-2 border rounded"
            value={valuationDate}
            onChange={(e) => setValuationDate(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Jenis Objek</label>
          {/* <input
            type="text"
            className="w-full px-4 py-2 border rounded"
            value={objectType}
            onChange={(e) => setObjectType(e.target.value)}
          /> */}
          <Dropdown placeholder="Jenis Object" options={options} onChange={(e) => console.log("Selected option:", e)}/>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Rentang Total Nilai</label>
          <div className="flex space-x-2">
            <input
              type="number"
              className="w-full px-4 py-2 border rounded"
              placeholder="Min"
              value={minTotalValue}
              onChange={(e) => setMinTotalValue(e.target.value)}
            />
            <input
              type="number"
              className="w-full px-4 py-2 border rounded"
              placeholder="Max"
              value={maxTotalValue}
              onChange={(e) => setMaxTotalValue(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
