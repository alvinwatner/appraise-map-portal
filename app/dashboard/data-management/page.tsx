"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  fetchAllProperties,
  fetchProperties,
  getPropertiesCount,
  insertNotification,
  updatePropertiesIsDeleted,
  updateProperty,
  updateValuation,
  users,
} from "@/app/services/dataManagement.service";
import { Property, User } from "@/app/types/types";

import PropertyTable from "./components/PropertyTable";
import FilterModal from "./components/FilterModal";
import Loading from "@/app/components/Loading";
import ImportPopup from "./components/ImportPopup";
import { supabase } from "@/app/lib/supabaseClient";
import ExportPopup from "./components/ExportPopup";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import wkx from "wkx";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { PiExportBold } from "react-icons/pi";
import { BiImport } from "react-icons/bi";

const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

// Function to escape CSV fields
const escapeCSVField = (field: any): string => {
  if (field === null || field === undefined) return "";
  const fieldString = String(field);
  if (
    fieldString.includes(",") ||
    fieldString.includes('"') ||
    fieldString.includes("\n")
  ) {
    return `"${fieldString.replace(/"/g, '""')}"`;
  }
  return fieldString;
};

const flattenAsset = (property: Property) => {
  let longitude = property.locations.longitude;
  let latitude = property.locations.latitude;
  if (property.locations.coordinate) {
    const wkbBuffer: Buffer = Buffer.from(property.locations.coordinate, "hex");

    // Parse WKB to GeoJSON
    const geoJson = wkx.Geometry.parse(wkbBuffer).toGeoJSON() as {
      coordinates: [number, number];
    };

    // Extract latitude and longitude
    const [long, lat]: [number, number] = geoJson.coordinates;
    longitude = long;
    latitude = lat;
  }

  return property?.valuations?.map((valuation) => ({
    "TANGGAL PENILAIAN": escapeCSVField(valuation.valuationDate || null),
    "JENIS OBJEK": escapeCSVField(property.objectType || null),
    "NAMA DEBITUR": escapeCSVField(property.debitur || null),
    ALAMAT: escapeCSVField(property.locations.address || null),
    KOORDINAT: escapeCSVField(`${longitude ?? ""},${latitude ?? ""}`),
    "LUAS TANAH": escapeCSVField(property.landArea || null),
    "LUAS BANGUNAN": escapeCSVField(property.buildingArea || null),
    PENILAI: escapeCSVField(valuation.appraiser || null),
    "HARGA TANAH /m²": escapeCSVField(valuation.landValue || null),
    NILAI: escapeCSVField(valuation.totalValue || null),
    "NOMOR LAPORAN": escapeCSVField(valuation.reportNumber || null),
  }));
};

const flattenData = (property: Property) => {
  let longitude = property.locations.longitude;
  let latitude = property.locations.latitude;
  if (property.locations.coordinate) {
    const wkbBuffer: Buffer = Buffer.from(property.locations.coordinate, "hex");

    // Parse WKB to GeoJSON
    const geoJson = wkx.Geometry.parse(wkbBuffer).toGeoJSON() as {
      coordinates: [number, number];
    };

    // Extract latitude and longitude
    const [long, lat]: [number, number] = geoJson.coordinates;
    longitude = long;
    latitude = lat;
  }

  return property?.valuations?.map((valuation) => ({
    TANGGAL: escapeCSVField(valuation.valuationDate || null),
    "JENIS OBJEK": escapeCSVField(property.objectType || null),
    ALAMAT: escapeCSVField(property.locations.address || null),
    "NO. HP": escapeCSVField(property.phoneNumber || null),
    KOORDINAT: escapeCSVField(`${longitude ?? ""},${latitude ?? ""}`),
    "LUAS TANAH": escapeCSVField(property.landArea || null),
    "LUAS BANGUNAN": escapeCSVField(property.buildingArea || null),
    "NILAI TANAH /m²": escapeCSVField(valuation.landValue || null),
    "NILAI BANGUNAN /m²": escapeCSVField(valuation.buildingValue || null),
    "INDIKASI PENAWARAN/TRANSAKSI": escapeCSVField(
      valuation.totalValue || null
    ),
  }));
};

const Page = () => {
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState(new Set<number>());
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState<Map<number, Partial<Property>>>(
    new Map()
  );
  const [editedValuations, setEditedValuations] = useState<Map<number, any>>(
    new Map()
  );
  const [filters, setFilters] = useState({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const { replace } = useRouter();
  const [roleId, setRoleId] = useState<number | null>(null);
  const [user, setUser] = useState<User>();

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

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const supabases = createClientComponentClient();
        const { data: session, error } = await supabases.auth.getSession();
        if (error) {
          throw error;
        }

        // Fetch user data and extract RoleId
        const dataUser = await users(session.session?.user.id);
        const userRoleId = dataUser?.data?.RoleId ?? null;

        // Update state with RoleId
        setRoleId(userRoleId);
        setUser(dataUser.data);
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    fetchSession();
  }, []);

  const handleImportClick = () => {
    setShowImportModal(true);
  };

  const handleCloseImportModal = () => {
    setShowImportModal(false);
  };

  const parseAndFormatFloat = (
    value: string | null | undefined
  ): number | null => {
    if (value == null) return null;
    const cleanedValue = value.replace(/,/g, "");

    const floatValue = parseFloat(cleanedValue);

    if (isNaN(floatValue)) {
      throw new Error(`Invalid number format for value: ${value}`);
    }

    return floatValue;
  };

  const handleImportData = async (jsonData: RowData[], dataType: string) => {
    setLoading(true);
    setImportSuccess(false);
    if (dataType === "asset") {
      await importAssetData(jsonData);
      insertNotification({
        title: "Import Data",
        description: `${user?.name} melakukan import asset`,
        roleId: 1,
      });
      setImportSuccess(true);
    } else if (dataType === "data") {
      await importDataData(jsonData);
      insertNotification({
        title: "Import Data",
        description: `${user?.name} melakukan import data`,
        roleId: 1,
      });
      setImportSuccess(true);
    }
    setLoading(false);
  };

  const importAssetData = async (jsonData: RowData[]) => {
    try {
      const { data: dataProperties, error: errorProperties } = await supabase
        .from("properties")
        .select("id")
        .order("id", { ascending: false })
        .limit(1);

      const totalCountProperties =
        dataProperties !== null ? dataProperties[0].id : null;

      if (errorProperties) {
        throw errorProperties;
      }

      const { data: dataValuations, error: errorValuations } = await supabase
        .from("valuations")
        .select("id")
        .order("id", { ascending: false })
        .limit(1);

      const totalCountValuations =
        dataValuations !== null ? dataValuations[0].id : null;

      if (errorValuations) {
        throw errorValuations;
      }

      const { data: dataLocations, error: errorLocations } = await supabase
        .from("locations")
        .select("id")
        .order("id", { ascending: false })
        .limit(1);

      const totalCountLocations =
        dataLocations !== null ? dataLocations[0].id : null;

      if (errorLocations) {
        throw errorLocations;
      }

      for (let i = 0; i < jsonData.length; i++) {
        const item = jsonData[i];

        const coordinatesArray = item.coordinates?.split(",").map(Number);
        const formattedDataLocations = {
          id: (totalCountLocations || 0) + i + 1,
          address: item.address,
          // latitude: coordinatesArray?.[0],
          // longitude: coordinatesArray?.[1],
          coordinate: `POINT(${coordinatesArray?.[1]} ${coordinatesArray?.[0]})`,
        };

        const formattedDataProperties = {
          id: (totalCountProperties || 0) + i + 1,
          debitur: item.debitur,
          phoneNumber: item.phoneNumber,
          landArea: parseAndFormatFloat(item.landArea),
          buildingArea: parseAndFormatFloat(item.buildingArea),
          LocationId: formattedDataLocations.id,
          objectType: item.objectType,
          propertiesType: "asset",
          UserId: user?.id,
        };

        const formattedValuationDate =
          typeof item.valuationDate === "string"
            ? item.valuationDate.includes("/")
              ? item.valuationDate.split("/").reverse().join("-")
              : item.valuationDate
            : null;

        const formattedDataValuations = {
          id: (totalCountValuations || 0) + i + 1,
          PropertyId: formattedDataProperties.id,
          reportNumber: item.reportNumber,
          valuationDate: formattedValuationDate,
          buildingValue: parseAndFormatFloat(item.buildingValue),
          landValue: parseAndFormatFloat(item.landValue),
          totalValue: parseAndFormatFloat(item.totalValue),
          appraiser: item.appraiser,
        };

        const insertLocations = await (await supabase)
          .from("locations")
          .insert([formattedDataLocations])
          .select();

        const insertProperties = await (await supabase)
          .from("properties")
          .insert([formattedDataProperties])
          .select();

        const insertValuations = await (await supabase)
          .from("valuations")
          .insert([formattedDataValuations])
          .select();

        const error =
          insertProperties.error ||
          insertValuations.error ||
          insertLocations.error;

        if (error) {
          throw error;
        }
      }
    } catch (error) {
      console.error("Error handling import asset data:", error);
    }
  };

  const importDataData = async (jsonData: RowData[]) => {
    try {
      const { data: dataProperties, error: errorProperties } = await supabase
        .from("properties")
        .select("id")
        .order("id", { ascending: false })
        .limit(1);

      const totalCountProperties =
        dataProperties !== null ? dataProperties[0].id : null;

      if (errorProperties) {
        throw errorProperties;
      }

      const { data: dataValuations, error: errorValuations } = await supabase
        .from("valuations")
        .select("id")
        .order("id", { ascending: false })
        .limit(1);

      const totalCountValuations =
        dataValuations !== null ? dataValuations[0].id : null;

      if (errorValuations) {
        throw errorValuations;
      }

      const { data: dataLocations, error: errorLocations } = await supabase
        .from("locations")
        .select("id")
        .order("id", { ascending: false })
        .limit(1);

      const totalCountLocations =
        dataLocations !== null ? dataLocations[0].id : null;

      if (errorLocations) {
        throw errorLocations;
      }

      for (let i = 0; i < jsonData.length; i++) {
        const item = jsonData[i];

        const coordinatesArray = item.coordinates?.split(",").map(Number);
        const formattedDataLocations = {
          id: (totalCountLocations || 0) + i + 1,
          address: item.address,
          // latitude: coordinatesArray?.[0],
          // longitude: coordinatesArray?.[1],
          coordinate: `POINT(${coordinatesArray?.[1]} ${coordinatesArray?.[0]})`,
        };

        const formattedDataProperties = {
          id: (totalCountProperties || 0) + i + 1,
          propertiesType: "data",
          debitur: item.debitur,
          phoneNumber: item.phoneNumber,
          landArea: parseAndFormatFloat(item.landArea),
          buildingArea: parseAndFormatFloat(item.buildingArea),
          LocationId: formattedDataLocations.id,
          objectType: item.objectType,
          UserId: user?.id,
        };

        const formattedValuationDate =
          typeof item.valuationDate === "string"
            ? item.valuationDate.includes("/")
              ? item.valuationDate.split("/").reverse().join("-")
              : item.valuationDate
            : null;

        const formattedDataValuations = {
          id: (totalCountValuations || 0) + i + 1,
          PropertyId: formattedDataProperties.id,
          reportNumber: item.reportNumber,
          valuationDate: formattedValuationDate,
          buildingValue: parseAndFormatFloat(item.buildingValue),
          landValue: parseAndFormatFloat(item.landValue),
          totalValue: parseAndFormatFloat(item.totalValue),
          appraiser: item.appraiser,
        };

        const insertLocations = await (await supabase)
          .from("locations")
          .insert([formattedDataLocations])
          .select();

        const insertProperties = await (await supabase)
          .from("properties")
          .insert([formattedDataProperties])
          .select();

        const insertValuations = await (await supabase)
          .from("valuations")
          .insert([formattedDataValuations])
          .select();

        const error =
          insertProperties.error ||
          insertValuations.error ||
          insertLocations.error;

        if (error) {
          throw error;
        }
      }
    } catch (error) {
      console.error("Error handling import data data:", error);
    }
  };

  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get("page") as string) || 1;
  const itemsPerPage = parseInt(searchParams?.get("perPage") as string) || 10;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const getProperties = useCallback(
    async (
      query: string,
      page: number,
      perPage: number,
      filters: any,
      sortField: string | undefined,
      sort: string | undefined
    ) => {
      setLoading(true);
      try {
        const propertiesData = await fetchProperties(
          query,
          page,
          perPage,
          filters,
          sortField,
          sort
        );

        const countProperties = await getPropertiesCount(
          query,
          page,
          perPage,
          filters,
          sortField,
          sort
        );

        setProperties(propertiesData.data);
        setTotalItems(countProperties.count);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    getProperties(
      query,
      currentPage,
      itemsPerPage,
      filters,
      sortConfig?.key,
      sortConfig?.direction
    );
  }, [
    currentPage,
    itemsPerPage,
    query,
    filters,
    importSuccess,
    sortConfig,
    getProperties,
  ]);

  const debouncedSearch = useMemo(() => {
    const handleSearch = (value: string) => {
      setQuery(value);
      replace(`?search=${value}&page=1&perPage=${itemsPerPage}`);
    };

    return debounce(handleSearch, 500);
  }, [itemsPerPage, setQuery, replace]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  const handleSearchKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      setQuery(search);
      replace(`?search=${search}&page=1&perPage=${itemsPerPage}`);
    }
  };

  const handlePageChange = (page: number) => {
    replace(`?search=${query}&page=${page}&perPage=${itemsPerPage}`);
  };

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newPerPage = parseInt(event.target.value);
    replace(`?search=${query}&page=1&perPage=${newPerPage}`);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelectedRows = new Set(properties.map((item) => item.id));
      setSelectedRows(newSelectedRows);
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: number) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(id)) {
      newSelectedRows.delete(id);
    } else {
      newSelectedRows.add(id);
    }
    setSelectedRows(newSelectedRows);
  };

  const handleDeleteSelected = async () => {
    const idsToDelete = Array.from(selectedRows);
    await updatePropertiesIsDeleted(idsToDelete, true);
    setProperties(
      properties.filter((property) => !idsToDelete.includes(property.id))
    );
    setSelectedRows(new Set());
  };

  const handleEditSelected = (isEditMode: boolean) => {
    setEditMode(isEditMode);
  };

  const handleChange = (id: number, field: keyof Property, value: any) => {
    if (field === "valuations") {
      setEditedValuations((prevEditedValuations) => {
        const newEditedValuations = new Map(prevEditedValuations);
        newEditedValuations.set(value[0].id, value[0]);
        return newEditedValuations;
      });
    }
    const newEditedData = new Map(editedData);
    const editedItem = newEditedData.get(id) || {};
    editedItem[field] = value;
    newEditedData.set(id, editedItem);
    setEditedData(newEditedData);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    for (const [id, changes] of Array.from(editedData.entries())) {
      await updateProperty(id, changes);
    }

    for (const [id, changes] of Array.from(editedValuations.entries())) {
      await updateValuation(id, changes);
    }

    setEditMode(false);
    setSelectedRows(new Set());
    const propertiesData = await fetchProperties(
      query,
      currentPage,
      itemsPerPage
    );
    setProperties(propertiesData.data);
    setIsSubmitting(false);
  };

  const handleFilterApply = (filters: any) => {
    setFilters(filters);
    setShowFilterModal(false);
  };

  const handleExport = async (exportAll: boolean) => {
    const asset = exportAll
      ? await fetchAllProperties(query, { ...filters, propertiesType: "asset" })
      : await fetchProperties(query, currentPage, itemsPerPage, {
          ...filters,
          propertiesType: "asset",
        });

    const data = exportAll
      ? await fetchAllProperties(query, { ...filters, propertyType: "data" })
      : await fetchProperties(query, currentPage, itemsPerPage, {
          ...filters,
          propertyType: "data",
        });

    const workbook = XLSX.utils.book_new();

    const assetData = asset.data?.flatMap((property) => flattenAsset(property));
    const assetSheet = XLSX.utils?.json_to_sheet(assetData);
    XLSX.utils.book_append_sheet(workbook, assetSheet, "Asset Sheet");

    const dataData = data.data?.flatMap((property) => flattenData(property));
    const dataSheet = XLSX.utils?.json_to_sheet(dataData);
    XLSX.utils.book_append_sheet(workbook, dataSheet, "Data Sheet");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "properties.xlsx");

    insertNotification({
      title: "Export Data",
      description: `${user?.name} melakukan export`,
      roleId: 1,
    });
  };

  const handleCloseExportModal = () => {
    setShowExportModal(false);
  };

  const handleExportClick = () => {
    setShowExportModal(true);
  };

  useEffect(() => {
    if (editMode) {
      const newEditedValuations = new Map();
      properties.forEach((property) => {
        if (property.valuations) {
          newEditedValuations.set(
            property.valuations[0].id,
            property.valuations[0]
          );
        }
      });
      setEditedValuations(newEditedValuations);
    }
  }, [editMode, properties]);

  const handleSelectProperty = (id: number | null) => {
    setSelectedProperty(id);
  };

  const handleNavigateToMap = () => {
    if (selectedProperty !== null) {
      router.push(`/dashboard/maps?property-id=${selectedProperty}`);
    }
  };

  if (loading) {
    return <Loading />;
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleHeaderClick = (field: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === field &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key: field, direction });
  };

  return (
    <>
      <div className="m-10">
        <h1 className="text-3xl font-semibold mt-4">Data Management</h1>
        <div className="border border-inherit min-h-96 mt-10 rounded-lg shadow-lg">
          <div className="p-8">
            <div className="flex justify-between items-center mb-4 ">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Search"
                  className="px-4 py-2 border rounded btn-rounded"
                  value={search}
                  onChange={handleSearchChange}
                  onKeyPress={handleSearchKeyPress}
                />
                {(roleId == 1 || roleId == 2) && (
                  <button
                    className="text-white px-4 py-2 rounded btn-rounded flex items-center"
                    style={{ backgroundColor: "#20744A" }}
                    onClick={handleImportClick}
                  >
                    <BiImport className="mr-2" />
                    Import
                  </button>
                )}
                {roleId == 1 && (
                  <button
                    className="text-white px-4 py-2 rounded btn-rounded flex items-center"
                    style={{ backgroundColor: "#20744A" }}
                    onClick={handleExportClick}
                  >
                    <PiExportBold className="mr-2" />
                    Export
                  </button>
                )}
              </div>
              <div className="flex space-x-2">
                <div className="flex space-x-2">
                  {(roleId === 1 || roleId === 2) && !editMode && (
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded btn-rounded flex items-center"
                      onClick={() => handleEditSelected(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z"
                        ></path>
                      </svg>
                      &nbsp;Ubah
                    </button>
                  )}
                  {selectedProperty !== null && (
                    <div>
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded btn-rounded flex items-center"
                        onClick={handleNavigateToMap}
                      >
                        Go to Map
                      </button>
                    </div>
                  )}
                  {selectedRows.size > 0 && editMode && (
                    <>
                      {editMode && (
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded btn-rounded flex items-center"
                          onClick={handleSave}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                               <Loading size="w-5 h-5" strokeWidth="border-2 border-t-2"  />
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="currentColor"
                                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z"
                                ></path>
                              </svg>
                              Simpan
                            </>
                          )}
                        </button>
                      )}
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded btn-rounded flex items-center"
                        onClick={handleDeleteSelected}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1em"
                          height="1em"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M15 3H9V1h6v2zm5 0h-4V1c0-1.1-.9-2-2-2H10c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v1h20V5c0-1.1-.9-2-2-2zM4 7v15c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7H4z"
                          ></path>
                        </svg>
                        &nbsp; Hapus
                      </button>
                    </>
                  )}
                </div>
                {editMode && (
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded btn-rounded flex items-center"
                    onClick={() => handleEditSelected(false)}
                  >
                    Cancel
                  </button>
                )}
                <button
                  className="bg-gray-200 text-black px-4 py-2 rounded btn-rounded flex items-center"
                  onClick={() => setShowFilterModal(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M22 18.605a.75.75 0 0 1-.75.75h-5.1a2.93 2.93 0 0 1-5.66 0H2.75a.75.75 0 1 1 0-1.5h7.74a2.93 2.93 0 0 1 5.66 0h5.1a.75.75 0 0 1 .75.75m0-13.21a.75.75 0 0 1-.75.75H18.8a2.93 2.93 0 0 1-5.66 0H2.75a.75.75 0 1 1 0-1.5h10.39a2.93 2.93 0 0 1 5.66 0h2.45a.74.74 0 0 1 .75.75m0 6.6a.74.74 0 0 1-.75.75H9.55a2.93 2.93 0 0 1-5.66 0H2.75a.75.75 0 1 1 0-1.5h1.14a2.93 2.93 0 0 1 5.66 0h11.7a.75.75 0 0 1 .75.75"
                    ></path>
                  </svg>
                  &nbsp;Filter
                </button>
              </div>
            </div>
            <PropertyTable
              currentData={properties}
              selectedRows={selectedRows}
              handleSelectRow={handleSelectRow}
              handleSelectAll={handleSelectAll}
              handleChange={handleChange}
              editMode={editMode}
              editedData={editedData}
              editedValuations={editedValuations}
              handleHeaderClick={handleHeaderClick}
              sortConfig={sortConfig}
              onSelectProperty={handleSelectProperty}
            />
            <div className="mt-4 flex justify-between">
              <div>
                <span className="text-sm text-gray-700">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                  {totalItems} results
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="px-4 py-2 text-sm border rounded-md"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 text-sm border rounded-md ${
                      currentPage === index + 1 ? "bg-gray-300" : ""
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  className="px-4 py-2 text-sm border rounded-md"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
              <div>
                <label className="mr-2 text-sm">Items per page:</label>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="px-4 py-2 border rounded-md"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        {showFilterModal && (
          <FilterModal
            onApply={handleFilterApply}
            onClose={() => setShowFilterModal(false)}
            defaultFilters={filters}
          />
        )}
        <ImportPopup
          isOpen={showImportModal}
          onClose={handleCloseImportModal}
          onImport={handleImportData}
        />
        {showExportModal && (
          <ExportPopup
            isOpen={showExportModal}
            onClose={handleCloseExportModal}
            onExport={handleExport}
          />
        )}
      </div>
    </>
  );
};

export default Page;
