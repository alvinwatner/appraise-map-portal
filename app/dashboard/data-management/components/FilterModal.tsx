import Dropdown from '@/app/components/Dropdown';
import { fetchObjectTypes } from '@/app/services/dataManagement.service';
import React, { useEffect, useState } from 'react';

type FilterModalProps = {
  onApply: (filters: any) => void;
  onClose: () => void;
  defaultFilters?: any;
};

type ObjectType = {
  id: number;
  name: string;
};

const FilterModal: React.FC<FilterModalProps> = ({ onApply, onClose, defaultFilters }) => {
  const propertyTypeOptions = ["Aset", "Pembanding"]; 
  const [propertyType, setPropertyType] = useState(defaultFilters?.propertyType || '');
  const [valuationDate, setValuationDate] = useState(defaultFilters?.valuationDate || '');
  const [objectType, setObjectType] = useState(defaultFilters?.objectType || '');
  const [minTotalValue, setMinTotalValue] = useState(defaultFilters?.minTotalValue || '');
  const [maxTotalValue, setMaxTotalValue] = useState(defaultFilters?.maxTotalValue || '');
  const [objectTypes, setObjectTypes] = useState<ObjectType[]>([]);

  useEffect(() => {
    const getObjectTypes = async () => {
      const { data } = await fetchObjectTypes();
      setObjectTypes(data);
    };
    getObjectTypes();
  }, []);

  useEffect(() => {
    if (defaultFilters) {
      setPropertyType(defaultFilters.propertyType || '');
      setValuationDate(defaultFilters.valuationDate || '');
      setObjectType(defaultFilters.objectType || '');
      setMinTotalValue(defaultFilters.minTotalValue || '');
      setMaxTotalValue(defaultFilters.maxTotalValue || '');
    }
  }, [defaultFilters]);

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
          <select
            className="block w-full rounded-md"
            value={propertyType || ''}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="">Select Jenis Data</option>
            {propertyTypeOptions.map((option, index) => (
              <option key={index} value={option.toLowerCase()}>
                {option}
              </option>
            ))}
          </select>
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
          <select
            className="block w-full rounded-md"
            value={objectType || ''}
            onChange={(e) => {
              const selectedId = parseInt(e.target.value, 10);
              const selectedObjectType = objectTypes.find(type => type.id === selectedId);
              setObjectType(selectedObjectType?.id.toString() || '');
            }}
          >
            <option value="">Select Jenis Objek</option>
            {objectTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
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
