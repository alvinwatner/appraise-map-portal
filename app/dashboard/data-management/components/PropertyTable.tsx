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
  editMode: boolean;
  editedData: Map<number, Partial<Property>>;
  editedValuations: Map<number, any>;
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
  editedValuations,
}) => {
  const [objectTypes, setObjectTypes] = useState<string[]>();

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
            {[
              "Jenis Data",
              "No. Laporan",
              "Tanggal Penilaian",
              "Jenis Objek",
              "Nama Debitor",
              "Nomor Tlp",
              "Alamat",
              "Luas Tanah",
              "Luas Bangunan",
              "Nilai Tanah / Meter",
              "Nilai Bangunan / Meter",
              "Nilai",
            ].map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentData.map((item) => (
            <tr
              key={item.id}
              className={`${selectedRows.has(item.id) ? "bg-gray-200" : ""}`}
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
                        editedValuations.get(item.valuations?.[0]?.id)
                          ?.reportNumber === null
                          ? ""
                          : editedValuations.get(item.valuations?.[0]?.id)
                              ?.reportNumber ??
                            item.valuations?.[0]?.reportNumber ??
                            ""
                      }
                      onChange={(e) => {
                        const newBuildingValue = e.target.value || null;
                        const currentValuation =
                          editedValuations.get(item.valuations?.[0]?.id) ||
                          item.valuations?.[0];
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
                        editedValuations?.get(item.valuations?.[0]?.id)
                          ?.valuationDate ||
                        item.valuations?.[0]?.valuationDate ||
                        ""
                      }
                      onChange={(e) => {
                        const newBuildingValue = e.target.value || "";
                        const currentValuation =
                          editedValuations.get(item.valuations?.[0]?.id) ||
                          item.valuations?.[0];
                        handleChange(item.id, "valuations", [
                          {
                            ...currentValuation,
                            valuationDate: newBuildingValue,
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
                        editedData.get(item.id)?.object_type === null
                          ? ""
                          : editedData.get(item.id)?.object_type ??
                            item.object_type ??
                            ""
                      }
                      onChange={(e) => {
                        const newBuildingValue = e.target.value || null;
                        handleChange(item.id, "object_type", newBuildingValue);
                      }}
                    />
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
                        editedValuations.get(item.valuations?.[0]?.id)
                          ?.landValue || item.valuations?.[0]?.landValue
                      }
                      onChange={(e) => {
                        const newBuildingValue = Number(e.target.value) || 0;
                        const currentValuation =
                          editedValuations.get(item.valuations?.[0]?.id) ||
                          item.valuations?.[0];
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
                        editedValuations.get(item.valuations?.[0]?.id)
                          ?.buildingValue ??
                        item.valuations?.[0]?.buildingValue ??
                        ""
                      }
                      onChange={(e) => {
                        const newBuildingValue = Number(e.target.value) || 0;
                        const currentValuation =
                          editedValuations.get(item.valuations?.[0]?.id) ||
                          item.valuations?.[0];
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
                        editedValuations.get(item.valuations?.[0]?.id)
                          ?.totalValue ||
                        item.valuations?.[0]?.totalValue ||
                        ""
                      }
                      onChange={(e) => {
                        const newTotalValue = Number(e.target.value) || 0;
                        const currentValuation =
                          editedValuations.get(item.valuations?.[0]?.id) ||
                          item.valuations?.[0];
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
                    {item.object_type}
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
