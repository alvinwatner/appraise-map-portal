import React, { useEffect, useState } from "react";
import { Property } from "@/app/types/types";
import { formatRupiah } from "@/app/utils/helper";
import { fetchObjectTypes } from "@/app/services/dataManagement.service";

type PropertyTableProps = {
  currentData: Property[];
  selectedRows: Set<number>;
  handleSelectRow: (id: number) => void;
  handleSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleChange: (id: number, field: keyof Property, value: any) => void;
  handleHeaderClick: (field: string) => void;
  sortConfig: { key: string; direction: "asc" | "desc" } | null;
  editMode: boolean;
  editedData: Map<number, Partial<Property>>;
  editedValuations: Map<number, any>;
  onSelectProperty: (id: number | null) => void; // New prop
};

const PropertyTable: React.FC<PropertyTableProps> = ({
  currentData,
  selectedRows,
  handleSelectRow,
  handleSelectAll,
  handleChange,
  handleHeaderClick,
  sortConfig,
  editMode,
  editedData,
  editedValuations,
  onSelectProperty, // New prop
}) => {
  const [objectTypes, setObjectTypes] = useState<string[]>();
  const [clickedRowId, setClickedRowId] = useState<number | null>(null);

  useEffect(() => {
    const getObjectTypes = async () => {
      try {
        const types = await fetchObjectTypes();
        setObjectTypes(types);
      } catch (error: any) {}
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

  const headers = [
    { label: "Jenis Data", field: "propertiesType", sortable: true },
    { label: "No. Laporan", field: "reportNumber", sortable: false },
    { label: "Tanggal Penilaian", field: "valuationDate", sortable: false },
    { label: "Penilai", field: "appraiser", sortable: true },
    { label: "Jenis Objek", field: "objectType", sortable: true },
    { label: "Nama Debitor", field: "debitur", sortable: true },
    { label: "Nomor Tlp", field: "phoneNumber", sortable: true },
    { label: "Alamat", field: "locations(address)", sortable: true },
    { label: "Luas Tanah", field: "landArea", sortable: true },
    { label: "Luas Bangunan", field: "buildingArea", sortable: true },
    { label: "Nilai Tanah / Meter", field: "landValue", sortable: false },
    {
      label: "Nilai Bangunan / Meter",
      field: "buildingValue",
      sortable: false,
    },
    { label: "Nilai", field: "totalValue", sortable: false },
  ];

  const renderSortIcon = (field: string) => {
    if (!sortConfig || sortConfig.key !== field) return null;
    if (sortConfig.direction === "asc") {
      return "▲"; // Black Up-pointing Triangle
    } else {
      return "▼"; // Black Down-pointing Triangle
    }
  };

  const handleRowClick = (id: number) => {
    onSelectProperty(id);
    setClickedRowId(id);
  };

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
            {headers.map((header) => (
              <th
                key={header.field}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px] ${
                  header.sortable ? "cursor-pointer" : ""
                }`}
                onClick={
                  header.sortable
                    ? () => handleHeaderClick(header.field)
                    : undefined
                }
              >
                {header.label} {header.sortable && renderSortIcon(header.field)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentData.map((item) => (
            <tr
              key={item.id}
              className={`cursor-pointer ${
                clickedRowId === item.id ? "!bg-blue-200" : ""
              }`}
              onClick={() => handleRowClick(item.id)}
            >
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
                      value={
                        editedData.get(item.id)?.propertiesType === null
                          ? ""
                          : editedData.get(item.id)?.propertiesType ??
                            item.propertiesType ??
                            ""
                      }
                      onChange={(e) => {
                        const newBuildingValue = e.target.value || null;
                        handleChange(
                          item.id,
                          "propertiesType",
                          newBuildingValue
                        );
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      className="block w-full rounded-md"
                      type="text"
                      value={
                        editedValuations.get(item.valuations?.[0]?.id as number)
                          ?.reportNumber ||
                        item.valuations?.[0]?.reportNumber ||
                        ""
                      }
                      onChange={(e) => {
                        const newBuildingValue = e.target.value || null;
                        const currentValuation =
                          editedValuations.get(
                            item.valuations?.[0]?.id as number
                          ) || item.valuations?.[0];
                        handleChange(item.id, "valuations", [
                          {
                            ...currentValuation,
                            reportNumber: newBuildingValue,
                          },
                        ]);
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      className="block w-full rounded-md"
                      type="date"
                      value={
                        editedValuations.get(item.valuations?.[0]?.id as number)
                          ?.valuationDate ||
                        item.valuations?.[0]?.valuationDate ||
                        ""
                      }
                      onChange={(e) => {
                        const newValuationDate = e.target.value || null;
                        const currentValuation =
                          editedValuations.get(
                            item.valuations?.[0]?.id as number
                          ) || item.valuations?.[0];
                        handleChange(item.id, "valuations", [
                          {
                            ...currentValuation,
                            valuationDate: newValuationDate,
                          },
                        ]);
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      className="block w-full rounded-md"
                      type="text"
                      value={
                        editedValuations.get(item.valuations?.[0]?.id as number)
                          ?.appraiser ||
                        item.valuations?.[0]?.appraiser ||
                        ""
                      }
                      onChange={(e) => {
                        const newAppraiser = e.target.value || null;
                        const currentValuation =
                          editedValuations.get(
                            item.valuations?.[0]?.id as number
                          ) || item.valuations?.[0];
                        handleChange(item.id, "valuations", [
                          {
                            ...currentValuation,
                            appraiser: newAppraiser,
                          },
                        ]);
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      className="block w-full rounded-md"
                      value={
                        editedData.get(item.id)?.objectType === null
                          ? ""
                          : editedData.get(item.id)?.objectType ??
                            item.objectType ??
                            ""
                      }
                      onChange={(e) => {
                        const newObjectType = e.target.value || null;
                        handleChange(item.id, "objectType", newObjectType);
                      }}
                    >
                      <option value="">Select</option>
                      {objectTypes?.map((objectType, index) => (
                        <option key={index} value={objectType}>
                          {objectType}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      className="block w-full rounded-md"
                      type="text"
                      value={
                        editedData.get(item.id)?.debitur === null
                          ? ""
                          : editedData.get(item.id)?.debitur ??
                            item.debitur ??
                            ""
                      }
                      onChange={(e) => {
                        const newBuildingValue = e.target.value || null;
                        handleChange(item.id, "debitur", newBuildingValue);
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      className="block w-full rounded-md"
                      type="text"
                      value={
                        editedData.get(item.id)?.phoneNumber === null
                          ? ""
                          : editedData.get(item.id)?.phoneNumber ??
                            item.phoneNumber ??
                            ""
                      }
                      onChange={(e) => {
                        const newBuildingValue = e.target.value || null;
                        handleChange(item.id, "phoneNumber", newBuildingValue);
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      className="block w-full rounded-md"
                      type="text"
                      value={
                        editedData.get(item.id)?.locations?.address === null
                          ? ""
                          : editedData.get(item.id)?.locations?.address ??
                            item.locations?.address ??
                            ""
                      }
                      onChange={(e) => {
                        const newBuildingValue = e.target.value || null;
                        handleChange(item.id, "locations", {
                          ...item.locations,
                          address: newBuildingValue,
                        });
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      className="block w-full rounded-md"
                      type="number"
                      value={
                        editedData.get(item.id)?.landArea === null
                          ? ""
                          : editedData.get(item.id)?.landArea ??
                            item.landArea ??
                            ""
                      }
                      onChange={(e) => {
                        const newBuildingValue = e.target.value || null;
                        handleChange(item.id, "landArea", newBuildingValue);
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      className="block w-full rounded-md"
                      type="number"
                      value={
                        editedData.get(item.id)?.buildingArea === null
                          ? ""
                          : editedData.get(item.id)?.buildingArea ??
                            item.buildingArea ??
                            ""
                      }
                      onChange={(e) => {
                        const newBuildingValue = e.target.value || null;
                        handleChange(item.id, "buildingArea", newBuildingValue);
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      className="block w-full rounded-md"
                      type="number"
                      value={
                        editedValuations.get(item.valuations?.[0]?.id as number)
                          ?.landValue || item.valuations?.[0]?.landValue
                      }
                      onChange={(e) => {
                        const newBuildingValue = Number(e.target.value) || 0;
                        const currentValuation =
                          editedValuations.get(
                            item.valuations?.[0]?.id as number
                          ) || item.valuations?.[0];
                        handleChange(item.id, "valuations", [
                          { ...currentValuation, landValue: newBuildingValue },
                        ]);
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      className="block w-full rounded-md"
                      type="number"
                      value={
                        editedValuations.get(item.valuations?.[0]?.id as number)
                          ?.buildingValue ??
                        item.valuations?.[0]?.buildingValue ??
                        ""
                      }
                      onChange={(e) => {
                        const newBuildingValue = Number(e.target.value) || 0;
                        const currentValuation =
                          editedValuations.get(
                            item.valuations?.[0]?.id as number
                          ) || item.valuations?.[0];
                        handleChange(item.id, "valuations", [
                          {
                            ...currentValuation,
                            buildingValue: newBuildingValue,
                          },
                        ]);
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      className="block w-full rounded-md"
                      type="number"
                      value={
                        editedValuations.get(item.valuations?.[0]?.id as number)
                          ?.totalValue ||
                        item.valuations?.[0]?.totalValue ||
                        ""
                      }
                      onChange={(e) => {
                        const newTotalValue = Number(e.target.value) || 0;
                        const currentValuation =
                          editedValuations.get(
                            item.valuations?.[0]?.id as number
                          ) || item.valuations?.[0];
                        handleChange(item.id, "valuations", [
                          { ...currentValuation, totalValue: newTotalValue },
                        ]);
                      }}
                    />
                  </td>
                </>
              ) : (
                <>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.propertiesType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.valuations?.[0]?.reportNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(
                      item.valuations?.[0]?.valuationDate
                    ).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.valuations?.[0]?.appraiser}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.objectType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.debitur}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.phoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.locations?.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.landArea}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.buildingArea}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatRupiah(item.valuations?.[0]?.landValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatRupiah(item.valuations?.[0]?.buildingValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatRupiah(item.valuations?.[0]?.totalValue)}
                  </td>
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
