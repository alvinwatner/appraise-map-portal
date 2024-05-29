import React from 'react';
import { Property } from '@/app/types/types';

type PropertyTableProps = {
  currentData: Property[];
  selectedRows: Set<number>;
  handleSelectRow: (id: number) => void;
  handleSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleChange: (id: number, field: keyof Property, value: any) => void;
  editMode: boolean;
  editedData: Map<number, Partial<Property>>; // Add editedData prop
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
  const formatRupiah = (value: number | undefined) => {
    if (value === undefined) return '';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(value);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 table-auto">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input
                className="block w-full rounded-md"
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedRows.size === currentData.length}
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jenis Data
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              No. Laporan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tanggal Penilaian
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jenis Objek
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama Debitor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nomor Tlp
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Alamat
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Luas Tanah
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Luas Bangunan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nilai Tanah / Meter
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nilai Bangunan / Meter
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nilai
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentData.map((item) => (
            <tr key={item.id} className={`${selectedRows.has(item.id) ? 'bg-gray-200' : ''}`}>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  className="block w-full rounded-md"
                  type="checkbox"
                  checked={selectedRows.has(item.id)}
                  onChange={() => handleSelectRow(item.id)}
                />
              </td>
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
                      className="rounded-md"
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
                    <input
                      className="rounded-md"
                      type="text"
                      value={editedData.get(item.id)?.object_type?.name || item.object_type?.name}
                      onChange={(e) => handleChange(item.id, 'object_type', { ...item.object_type, name: e.target.value })}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      className="rounded-md"
                      type="text"
                      value={editedData.get(item.id)?.name || item.name}
                      onChange={(e) => handleChange(item.id, 'name', e.target.value)}
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
                  <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
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
