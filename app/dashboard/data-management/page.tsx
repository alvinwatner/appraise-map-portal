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
import FeedbackModal from "./components/FeedbackModal";
import { PropertyTableSkeleton } from "./components/PropertyTableSkeleton";
import { Pagination } from "./components/Pagination";
import { ConfirmationModal } from "./components/ConfirmationModal";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, Pencil, PencilIcon, Save, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

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

const flattenAset = (property: Property) => {
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
    "HARGA BANGUNAN /m²": escapeCSVField(valuation.buildingValue || null),
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

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] =
    useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error">(
    "success"
  );

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<boolean>(false);
  const [actionToConfirm, setActionToConfirm] = useState<() => void>(() => {});

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

  const validateRow = (row: RowData, dataType: string): boolean => {
    const requiredFields: { [key: string]: (keyof RowData)[] } = {
      aset: [
        "valuationDate",
        "objectType",
        "debitur",
        "address",
        "coordinates",
        "landArea",
        "buildingArea",
        "totalValue",
        "reportNumber",
      ],
      data: [
        "valuationDate",
        "objectType",
        "address",
        "phoneNumber",
        // "coordinates",
        "landArea",
        "buildingArea",
        "totalValue",
      ],
    };

    const missingFields: string[] = [];

    requiredFields[dataType].forEach((field) => {
      const value = row[field];
      if (value === undefined || value === null || value === "") {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      const errorMessage = `Validation failed. Missing or empty fields: ${missingFields.join(
        ", "
      )}.`;
      throw new Error(errorMessage);
    }

    return missingFields.length === 0;
  };

  const handleImportData = async (jsonData: RowData[], dataType: string) => {
    console.log(`Importing data`);
    setLoading(true);
    try {
      if (dataType === "aset") {
        await importAsetData(jsonData);
        insertNotification({
          title: "Import Data",
          description: `${user?.name} melakukan import aset`,
          roleId: 1,
        });
      } else if (dataType === "data") {
        await importDataData(jsonData);
        insertNotification({
          title: "Import Data",
          description: `${user?.name} melakukan import data`,
          roleId: 1,
        });
      }
      setFeedbackMessage("Import successful!");
      setFeedbackType("success");
      setIsFeedbackModalOpen(true);
    } catch (error: any) {
      console.log(`error import data = ${error}`);
      console.error("Error handling import data:", error);
      setFeedbackMessage("Import failed! " + error.message);
      setFeedbackType("error");
      setIsFeedbackModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const importAsetData = async (jsonData: RowData[]) => {
    try {
      const { data: dataProperties, error: errorProperties } = await supabase
        .from("properties")
        .select("id")
        .order("id", { ascending: false })
        .limit(1);

      const totalCountProperties =
        (dataProperties?.length && dataProperties[0]?.id) || 0;

      if (errorProperties) {
        throw errorProperties;
      }

      const { data: dataValuations, error: errorValuations } = await supabase
        .from("valuations")
        .select("id")
        .order("id", { ascending: false })
        .limit(1);

      const totalCountValuations =
        (dataValuations?.length && dataValuations[0]?.id) || 0;

      if (errorValuations) {
        throw errorValuations;
      }

      const { data: dataLocations, error: errorLocations } = await supabase
        .from("locations")
        .select("id")
        .order("id", { ascending: false })
        .limit(1);

      const totalCountLocations =
        (dataLocations?.length && dataLocations[0]?.id) || 0;

      if (errorLocations) {
        throw errorLocations;
      }

      for (let i = 0; i < jsonData.length; i++) {
        const item = jsonData[i];
        validateRow(item, "aset");

        const coordinatesArray = item.coordinates?.split(",").map(Number);
        const formattedDataLocations = {
          id: totalCountLocations + i + 1,
          address: item.address,
          coordinate: `POINT(${coordinatesArray?.[1]} ${coordinatesArray?.[0]})`,
        };

        const formattedDataProperties = {
          id: totalCountProperties + i + 1,
          debitur: item.debitur,
          phoneNumber: item.phoneNumber,
          landArea: item.landArea,
          buildingArea: item.buildingArea,
          LocationId: formattedDataLocations.id,
          objectType: item.objectType,
          propertiesType: "aset",
          UserId: user?.id,
        };

        const formattedValuationDate =
          typeof item.valuationDate === "string"
            ? item.valuationDate.includes("/")
              ? item.valuationDate.split("/").reverse().join("-")
              : item.valuationDate
            : null;

        const formattedDataValuations = {
          id: totalCountValuations + i + 1,
          PropertyId: formattedDataProperties.id,
          reportNumber: item.reportNumber,
          valuationDate: formattedValuationDate,
          buildingValue: item.buildingValue,
          landValue: item.landValue,
          totalValue: item.totalValue,
          appraiser: item.appraiser,
        };

        const insertLocations = await supabase
          .from("locations")
          .insert([formattedDataLocations])
          .select();

        const insertProperties = await supabase
          .from("properties")
          .insert([formattedDataProperties])
          .select();

        const insertValuations = await supabase
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
    } catch (error: any) {
      throw new Error(error.message || "Failed to import data");
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
        (dataProperties?.length && dataProperties[0]?.id) || 0;

      if (errorProperties) {
        throw errorProperties;
      }

      const { data: dataValuations, error: errorValuations } = await supabase
        .from("valuations")
        .select("id")
        .order("id", { ascending: false })
        .limit(1);

      const totalCountValuations =
        (dataValuations?.length && dataValuations[0]?.id) || 0;

      if (errorValuations) {
        throw errorValuations;
      }

      const { data: dataLocations, error: errorLocations } = await supabase
        .from("locations")
        .select("id")
        .order("id", { ascending: false })
        .limit(1);

      const totalCountLocations =
        (dataLocations?.length && dataLocations[0]?.id) || 0;

      if (errorLocations) {
        throw errorLocations;
      }

      for (let i = 0; i < jsonData.length; i++) {
        const item = jsonData[i];
        validateRow(item, "data");

        const coordinatesArray = item.coordinates?.split(",").map(Number);
        const formattedDataLocations = {
          id: totalCountLocations + i + 1,
          address: item.address,
          coordinate: coordinatesArray
            ? `POINT(${coordinatesArray[1]} ${coordinatesArray[0]})`
            : null, // Allow nullable coordinate
        };

        const formattedDataProperties = {
          id: totalCountProperties + i + 1,
          propertiesType: "data",
          debitur: item.debitur,
          phoneNumber: item.phoneNumber,
          landArea: item.landArea,
          buildingArea: item.buildingArea,
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
          id: totalCountValuations + i + 1,
          PropertyId: formattedDataProperties.id,
          reportNumber: item.reportNumber,
          valuationDate: formattedValuationDate,
          buildingValue: item.buildingValue || null, // Allow nullable values
          landValue: item.landValue || null, // Allow nullable values
          totalValue: item.totalValue,
          appraiser: item.appraiser,
        };

        const insertLocations = await supabase
          .from("locations")
          .insert([formattedDataLocations])
          .select();

        const insertProperties = await supabase
          .from("properties")
          .insert([formattedDataProperties])
          .select();

        const insertValuations = await supabase
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
    } catch (error: any) {
      throw new Error(error.message || "Failed to import data");
    }
  };

  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get("page") as string) || 1;
  const itemsPerPage = parseInt(searchParams?.get("perPage") as string) || 10;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setImportSuccess(false);
  }, [
    currentPage,
    itemsPerPage,
    query,
    filters,
    sortConfig,
    getProperties,
    importSuccess,
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

  const handleItemsPerPageChange = (newPerPage: number) => {
    // Assuming you're using a replace function for URL handling
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
    setLoading(true);
    try {
      const idsToDelete = Array.from(selectedRows);
      await updatePropertiesIsDeleted(idsToDelete, true);
      setProperties(
        properties.filter((property) => !idsToDelete.includes(property.id))
      );
      setSelectedRows(new Set());
    } catch (err: any) {
      setError(
        `An error occurred while saving. Please try again. ${
          err?.message || err
        }`
      );
    } finally {
      setLoading(false);
      setIsConfirmationModalOpen(false);
    }
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
    setLoading(true);
    setError(null);

    try {
      console.log(editedData);
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
    } catch (err: any) {
      // Handle and set error state
      setError(
        `An error occurred while saving. Please try again. ${
          err?.message || err
        }`
      );
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleFilterApply = (filters: any) => {
    setFilters(filters);
    setShowFilterModal(false);
  };

  const handleExport = async (exportAll: boolean) => {
    const aset = exportAll
      ? await fetchProperties(query, currentPage, 9999999, {
          ...filters,
          propertiesType: "aset",
        })
      : await fetchProperties(query, currentPage, itemsPerPage, {
          ...filters,
          propertiesType: "aset",
        });

    const data = exportAll
      ? await fetchProperties(query, currentPage, 9999999, {
          ...filters,
          propertyType: "data",
        })
      : await fetchProperties(query, currentPage, itemsPerPage, {
          ...filters,
          propertyType: "data",
        });

    const workbook = XLSX.utils.book_new();

    const asetData = aset.data
      ?.flatMap((property) => flattenAset(property))
      .filter(Boolean);
    const asetSheet = XLSX.utils?.json_to_sheet(asetData);
    XLSX.utils.book_append_sheet(workbook, asetSheet, "Aset Sheet");

    const dataData = data.data
      ?.flatMap((property) => flattenData(property))
      .filter(Boolean);
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

  const handleOk = () => {
    setIsFeedbackModalOpen(false);
    setImportSuccess(true);
  };

  const handleDeleteConfirmation = () => {
    setActionToConfirm(() => handleDeleteSelected);
    setIsConfirmationModalOpen(true);
  };

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
      <div className="p-4 lg:p-6 flex flex-col gap-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Data Management</h1>
        </div>

        <Card>
          <CardContent>
            <div className="w-full pt-8">
              {error && (
                <div className="bg-red-600 text-white p-4 rounded mb-4">
                  {error}
                </div>
              )}
              <div className="flex justify-between items-center mb-4 ">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={handleSearchChange}
                    onKeyPress={handleSearchKeyPress}
                  />
                  {(roleId == 1 || roleId == 2) && (
                    <Button
                      className="bg-green-600 hover:bg-green-800 text-white"
                      onClick={handleImportClick}
                    >
                      <BiImport className="mr-2" />
                      IMPORT
                    </Button>
                  )}
                  {roleId == 1 && (
                    <Button
                      className="bg-green-600 hover:bg-green-800 text-white"
                      onClick={handleExportClick}
                    >
                      <PiExportBold className="mr-2" />
                      EXPORT
                    </Button>
                  )}
                </div>
                <div className="flex space-x-2">
                  <div className="flex space-x-2">
                    {(roleId === 1 || roleId === 2) && !editMode && (
                      <Button
                        className="bg-blue-600 hover:bg-blue-800 text-white"
                        onClick={() => handleEditSelected(true)}
                      >
                        <Pencil size={16} className="mr-2" />
                        EDIT
                      </Button>
                    )}
                    {selectedProperty !== null && (
                      <div>
                        <Button
                          className="bg-blue-600 hover:bg-blue-800 text-white"
                          onClick={handleNavigateToMap}
                        >
                          GO TO MAP
                        </Button>
                      </div>
                    )}
                    {selectedRows.size > 0 && editMode && (
                      <>
                        {editMode && (
                          <Button
                            className="bg-green-600 hover:bg-green-800 text-white"
                            onClick={handleSave}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loading
                                  size="w-5 h-5"
                                  strokeWidth="border-2 border-t-2"
                                />
                              </>
                            ) : (
                              <>
                                <Save size={16} className="mr-2" />
                                SAVE
                              </>
                            )}
                          </Button>
                        )}
                        <Button
                          className="bg-red-600 hover:bg-red-800 text-white"
                          onClick={handleDeleteConfirmation}
                        >
                          <Trash size={16} className="mr-2" />
                          DELETE
                        </Button>
                      </>
                    )}
                  </div>
                  {editMode && (
                    <Button
                      className="bg-yellow-400 hover:bg-yellow-500 text-white"
                      onClick={() => handleEditSelected(false)}
                    >
                      CANCEL
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setShowFilterModal(true)}
                  >
                    <Filter size={16} className="mr-2" />
                    FILTER
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full mt-1" />
                  <Skeleton className="h-10 w-full mt-1" />
                  <Skeleton className="h-10 w-full mt-1" />
                  <Skeleton className="h-10 w-full mt-1" />
                  <Skeleton className="h-10 w-full mt-1" />
                </div>
              ) : (
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
              )}

              <div className="mt-4 flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-700">
                    {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}{" "}
                    to {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                    {totalItems}
                  </span>
                </div>
                <Pagination
                  totalPages={totalPages}
                  onPageChanged={(page) => {
                    handlePageChange(page);
                  }}
                />

                <div className="w-24">
                  <Select
                    value={String(itemsPerPage)}
                    onValueChange={(value) =>
                      handleItemsPerPageChange(parseInt(value))
                    }
                  >
                    <SelectTrigger className="px-4 py-2 border rounded-md">
                      <SelectValue placeholder="Select items per page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
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
              <FeedbackModal
                isOpen={isFeedbackModalOpen}
                onClose={() => setIsFeedbackModalOpen(false)}
                message={feedbackMessage}
                type={feedbackType}
                onOk={handleOk}
              />
              <ConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={() => setIsConfirmationModalOpen(false)}
                onConfirm={actionToConfirm}
                message="Are you sure you want to delete the data?"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Page;
