import { fetchObjectTypes } from "@/app/services/dataManagement.service";
import { filterNumeric, formatRupiah } from "@/app/utils/helper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";

type FilterModalProps = {
  onApply: (filters: any) => void;
  onClose: () => void;
  defaultFilters?: any;
};

type ObjectType = {
  id: number;
  name: string;
};

const FilterModal: React.FC<FilterModalProps> = ({
  onApply,
  onClose,
  defaultFilters,
}) => {
  const propertyTypeOptions = ["Aset", "Data"];
  const [propertyType, setPropertyType] = useState(
    defaultFilters?.propertyType || ""
  );
  const [startValuationDate, setStartValuationDate] = useState(
    defaultFilters?.startValuationDate || ""
  );
  const [endValuationDate, setEndValuationDate] = useState(
    defaultFilters?.endValuationDate || ""
  );
  const [objectType, setObjectType] = useState(
    defaultFilters?.objectType || ""
  );
  const [minTotalValue, setMinTotalValue] = useState(
    defaultFilters?.minTotalValue || ""
  );
  const [maxTotalValue, setMaxTotalValue] = useState(
    defaultFilters?.maxTotalValue || ""
  );

  const [objectTypes, setObjectTypes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleClear = () => {
    setPropertyType("");
    setStartValuationDate("");
    setEndValuationDate("");
    setObjectType("");
    setMinTotalValue("");
    setMaxTotalValue("");
  };

  useEffect(() => {
    const getObjectTypes = async () => {
      try {
        const types = await fetchObjectTypes();
        // Filter for unique values
        const uniqueTypes = Array.from(new Set(types));
        setObjectTypes(uniqueTypes);
      } catch (error: any) {
        setError(error.message);
      }
    };

    getObjectTypes();
  }, []);

  useEffect(() => {
    if (defaultFilters) {
      setPropertyType(defaultFilters.propertyType || "");
      setStartValuationDate(defaultFilters.startValuationDate || "");
      setEndValuationDate(defaultFilters.endValuationDate || "");
      setObjectType(defaultFilters.objectType || "");
      setMinTotalValue(defaultFilters.minTotalValue || "");
      setMaxTotalValue(defaultFilters.maxTotalValue || "");
    }
  }, [defaultFilters]);

  const handleApply = () => {
    const filters = {
      propertyType,
      startValuationDate,
      endValuationDate,
      objectType,
      minTotalValue: minTotalValue ? Number(minTotalValue) : undefined,
      maxTotalValue: maxTotalValue ? Number(maxTotalValue) : undefined,
    };
    onApply(filters);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <div className="flex justify-end items-center">
          <button
            className="text-sm text-blue-600 hover:text-blue-800"
            onClick={handleClear}
          >
            CLEAR
          </button>
        </div>

        <div className="mb-4">
          <Label>Jenis Data</Label>
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger>
              <SelectValue placeholder="Select Jenis Data" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypeOptions.map((option, index) => (
                <SelectItem key={index} value={option.toLowerCase()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4">
          <Label>Dari (Tanggal Penilaian)</Label>
          <Input
            type="date"
            value={startValuationDate}
            onChange={(e) => setStartValuationDate(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Label>Sampai (Tanggal Penilaian)</Label>
          <Input
            type="date"
            value={endValuationDate}
            onChange={(e) => setEndValuationDate(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Label>Jenis Objek</Label>
          <Select
            value={objectType}
            onValueChange={(value) => setObjectType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Jenis Objek" />
            </SelectTrigger>
            <SelectContent>
              {objectTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4">
          <Label>Rentang Total Nilai</Label>
          <div className="flex space-x-2">
            <Input
              placeholder="Min"
              value={formatRupiah(minTotalValue)}
              onChange={(e) =>
                setMinTotalValue(Number(filterNumeric(e.target.value)))
              }
            />
            <Input
              placeholder="Max"
              value={formatRupiah(maxTotalValue)}
              onChange={(e) =>
                setMaxTotalValue(Number(filterNumeric(e.target.value)))
              }
            />
          </div>
        </div>
        <div className="w-full flex justify-end space-x-2">
          <Button className="w-1/2" variant="outline" onClick={onClose}>
            CANCEL
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-800 text-white w-1/2"
            onClick={handleApply}
          >
            APPLY
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
