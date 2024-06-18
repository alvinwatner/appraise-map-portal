import React, { useEffect, useState } from 'react';
import { Property } from '@/app/types/types';
import { formatRupiah } from '@/app/utils/helper';
import { fetchObjectTypes } from '@/app/services/dataManagement.service';

type PropertyTableProps = {
  currentData: Property[];
  selectedRows: Set<number>;
  handleSelectRow: (id: number) => void;
  handleSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleChange: (id: number, field: keyof Property, value: any) => void;
  editMode: boolean;
  editedData: Map<number, Partial<Property>>;
};

type ObjectType = {
  id: number;
  name: string;
};

const PropertyTable: React.FC<PropertyTableProps> = ({
  currentData,
  selectedRows,
  handleSelectRow,
  handleSelectAll,
  handleChange,
  editMode,
  editedData,
}) => {
  const [objectTypes, setObjectTypes] = useState<ObjectType[]>([]);

  useEffect(() => {
    const getObjectTypes = async () => {
      const { data } = await fetchObjectTypes();
      setObjectTypes(data);
    };
    getObjectTypes();
  }, []);

  if (currentData.length === 0) {
    return (
      <div className="text-center py-4">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto-static">
      <table className="min-w-full divide-y divide-gray-200 table-auto">
        <thead className="bg-gray-50">
          <tr>
          {editMode ? (
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[110px]">
              <input
                className="block w-full rounded-md"
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedRows.size === currentData.length}
              />
            </th>
          ) : null}
            {['Jenis Data', 'No. Laporan', 'Tanggal Penilaian', 'Jenis Objek', 'Nama Debitor', 'Nomor Tlp', 'Alamat', 'Luas Tanah', 'Luas Bangunan', 'Nilai Tanah / Meter', 'Nilai Bangunan / Meter', 'Nilai'].map((header, index) => (
              <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentData.map((item) => (
            <tr key={item.id} className={`${selectedRows.has(item.id) ? 'bg-gray-200' : ''}`}>
            {editMode ? (
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  className="block w-full rounded-md"
                  type="checkbox"
                  checked={selectedRows.has(item.id)}
                  onChange={() => handleSelectRow(item.id)}
                />
              </td>
            ) : null}
              {editMode && selectedRows.has(item.id) ? (
                <>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      className="block w-full rounded-md"
                      type="text"
                      value={editedData.get(item.id)?.propertiesType || item.propertiesType}
                      onChange={(e) => handleChange(item.id, 'propertiesType', e.target.value)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      className="block w-full rounded-md"
                      type="text"
                      value={editedData.get(item.id)?.valuations?.[0]?.reportNumber || item.valuations?.[0]?.reportNumber}
                      onChange={(e) => handleChange(item.id, 'valuations', [{ ...item.valuations?.[0], reportNumber: e.target.value }])}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      className="block w-full rounded-md"
                      type="date"
                      value={new Date(editedData.get(item.id)?.valuations?.[0]?.valuationDate || item.valuations?.[0]?.valuationDate).toISOString().split('T')[0]}
                      onChange={(e) => handleChange(item.id, 'valuations', [{ ...item.valuations?.[0], valuationDate: new Date(e.target.value) }])}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      className="block w-full rounded-md"
                      value={editedData.get(item.id)?.object_type?.id || item.object_type?.id}
                      onChange={(e) => {
                        const selectedId = parseInt(e.target.value, 10);
                        const selectedObjectType = objectTypes.find(type => type.id === selectedId);
                        handleChange(item.id, 'ObjectId', selectedObjectType?.id);
                      }}
                    >
                      {objectTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      className="block w-full rounded-md"
                      type="text"
                      value={editedData.get(item.id)?.debitur || item.debitur}
                      onChange={(e) => handleChange(item.id, 'debitur', e.target.value)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      className="block w-full rounded-md"
                      type="text"
                      value={editedData.get(item.id)?.phoneNumber || item.phoneNumber}
                      onChange={(e) => handleChange(item.id, 'phoneNumber', e.target.value)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      className="block w-full rounded-md"
                      type="text"
                      value={editedData.get(item.id)?.locations?.address || item.locations?.address}
                      onChange={(e) => handleChange(item.id, 'locations', { ...item.locations, address: e.target.value })}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      className="block w-full rounded-md"
                      type="number"
                      value={editedData.get(item.id)?.landArea || item.landArea}
                      onChange={(e) => handleChange(item.id, 'landArea', Number(e.target.value))}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      className="block w-full rounded-md"
                      type="number"
                      value={editedData.get(item.id)?.buildingArea || item.buildingArea}
                      onChange={(e) => handleChange(item.id, 'buildingArea', Number(e.target.value))}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      className="block w-full rounded-md"
                      type="number"
                      value={editedData.get(item.id)?.valuations?.[0]?.landValue || item.valuations?.[0]?.landValue}
                      onChange={(e) => handleChange(item.id, 'valuations', [{ ...item.valuations?.[0], landValue: Number(e.target.value) }])}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      className="block w-full rounded-md"
                      type="number"
                      value={editedData.get(item.id)?.valuations?.[0]?.buildingValue || item.valuations?.[0]?.buildingValue}
                      onChange={(e) => handleChange(item.id, 'valuations', [{ ...item.valuations?.[0], buildingValue: Number(e.target.value) }])}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      className="block w-full rounded-md"
                      type="number"
                      value={editedData.get(item.id)?.valuations?.[0]?.totalValue || item.valuations?.[0]?.totalValue}
                      onChange={(e) => handleChange(item.id, 'valuations', [{ ...item.valuations?.[0], totalValue: Number(e.target.value) }])}
                    />
                  </td>
                </>
              ) : (
                <>
                  <td className="px-6 py-4 whitespace-nowrap">{item.propertiesType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.valuations?.[0]?.reportNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(item.valuations?.[0]?.valuationDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.object_type?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.debitur}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.phoneNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.locations?.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.landArea}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.buildingArea}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatRupiah(item.valuations?.[0]?.landValue)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatRupiah(item.valuations?.[0]?.buildingValue)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatRupiah(item.valuations?.[0]?.totalValue)}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertyTable;
