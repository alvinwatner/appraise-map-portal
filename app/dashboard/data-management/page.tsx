'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchProperties, updatePropertiesIsDeleted, updateProperty, updateValuation } from '@/app/services/dataManagement.service';
import { Property } from '@/app/types/types';
import PropertyTable from './components/PropertyTable';
import FilterModal from './components/FilterModal';
import Loading from '@/app/components/Loading';
import ImportPopup from './components/ImportPopup';
import { supabase } from '@/app/lib/supabaseClient';

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
  if (field === null || field === undefined) return '';
  const fieldString = String(field);
  if (fieldString.includes(',') || fieldString.includes('"') || fieldString.includes('\n')) {
    return `"${fieldString.replace(/"/g, '""')}"`;
  }
  return fieldString;
};

const flattenProperty = (property: Property) => {
  return property.valuations.map(valuation => ({
    'JENIS DATA': escapeCSVField(property.propertiesType),
    'NO. LAPORAN': escapeCSVField(valuation.reportNumber),
    'TANGGAL PENILAIAN': escapeCSVField(valuation.valuationDate),
    'JENIS OBJEK': escapeCSVField(property.object_type.name),
    'NAMA DEBITOR': escapeCSVField(property.debitur),
    'NOMOR TLP': escapeCSVField(property.phoneNumber),
    'ALAMAT': escapeCSVField(property.locations.address),
    'LUAS TANAH': escapeCSVField(property.landArea),
    'LUAS BANGUNAN': escapeCSVField(property.buildingArea),
    'NILAI TANAH / METER': escapeCSVField(valuation.landValue),
    'NILAI BANGUNAN / METER': escapeCSVField(valuation.buildingValue),
    'NILAI': escapeCSVField(valuation.totalValue),
  }));
};

const convertToCSV = (data: Property[]): string => {
  const flattenedData = data.flatMap(flattenProperty);
  const header = Object.keys(flattenedData[0]).join(',');
  const rows = flattenedData.map(row => Object.values(row).join(','));
  return [header, ...rows].join('\n');
};

// Utility function to download a CSV file
const downloadCSV = (data: string, filename: string): void => {
  const blob = new Blob([data], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  a.click();
  URL.revokeObjectURL(url);
};

const Page = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState(new Set<number>());
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState<Map<number, Partial<Property>>>(new Map());
  const [editedValuations, setEditedValuations] = useState<Map<number, any>>(new Map());
  const [filters, setFilters] = useState({});
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [showImportModal, setShowImportModal] = useState(false);

  const handleImportClick = () => {
    setShowImportModal(true);
  };

  const handleCloseImportModal = () => {
    setShowImportModal(false);
  };

  const handleImportData = async (jsonData: any[]) => {
    try {
        const { count: totalCountProperties, error: countErrorProperties } = await supabase
            .from('properties')
            .select('id', { count: 'exact' });

        if (countErrorProperties) {
            throw countErrorProperties;
        }

        const { count: totalCountValuations, error: countErrorValuations } = await supabase
            .from('valuations')
            .select('id', { count: 'exact' });

        if (countErrorValuations) {
            throw countErrorValuations;
        }

        const { count: totalCountLocations, error: countErrorLocations } = await supabase
            .from('locations')
            .select('id', { count: 'exact' });

        if (countErrorLocations) {
            throw countErrorLocations;
        }

        for (let i = 0; i < jsonData.length; i++) {
            const item = jsonData[i];

            const { data: objectType, error: errorObjectType } = await supabase
              .from('object_type')
              .select('id')
              .eq('name', item.objectType);
        

            if (errorObjectType) {
                throw errorObjectType;
            }

            const formattedDataLocations = {
              id: (totalCountLocations || 0) + i + 1,
              address: item.address,
            };

            const formattedDataProperties = {
                id: (totalCountProperties || 0) + i + 1,
                propertiesType: item.propertiesType,
                name: item.name,
                phoneNumber: item.phoneNumber,
                landArea: item.landArea,
                buildingArea: item.buildingArea,
                LocationId: formattedDataLocations.id,
                ObjectId: objectType[0]?.id
            };

            const formattedDataValuations = {
                id: (totalCountValuations || 0) + i + 1,
                PropertyId: formattedDataProperties.id,
                reportNumber: item.reportNumber,
                valuationDate: item.valuationDate.split('/').reverse().join('-'),
                landValue: item.landValue,
                buildingValue: item.buildingValue,
                totalValue: item.totalValue,
            };

            const insertLocations = await supabase
                .from('locations')
                .insert([formattedDataLocations])
                .select();

            const insertProperties = await supabase
                .from('properties')
                .insert([formattedDataProperties])
                .select();

            const insertValuations = await supabase
                .from('valuations')
                .insert([formattedDataValuations])
                .select();

            const error = insertProperties.error || insertValuations.error || insertLocations.error;

            if (error) {
                throw error;
            }
        }

      } catch (error) {
          console.error('Error handling import data:', error);
      }
  };


  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get('page') as string) || 1;
  const itemsPerPage = parseInt(searchParams?.get('perPage') as string) || 10;

  const getProperties = useCallback(async (query: string, page: number, perPage: number, filters: any) => {
    setLoading(true);
    const propertiesData = await fetchProperties(query, page, perPage, filters);
    setProperties(propertiesData.data);
    setTotalItems(propertiesData.total);
    setLoading(false);
  }, []);

  useEffect(() => {
    getProperties(query, currentPage, itemsPerPage, filters);
  }, [currentPage, itemsPerPage, query, filters, getProperties]);

  const debouncedSearch = useCallback(debounce((value: string) => {
    setQuery(value);
    router.push(`?search=${value}&page=1&perPage=${itemsPerPage}`);
  }, 500), [router, itemsPerPage]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setQuery(search);
      router.push(`?search=${search}&page=1&perPage=${itemsPerPage}`);
    }
  };

  const handlePageChange = (page: number) => {
    router.push(`?search=${query}&page=${page}&perPage=${itemsPerPage}`);
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = parseInt(event.target.value);
    router.push(`?search=${query}&page=1&perPage=${newPerPage}`);
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
    setProperties(properties.filter(property => !idsToDelete.includes(property.id)));
    setSelectedRows(new Set());
  };

  const handleEditSelected = () => {
    setEditMode(true);
  };

  const handleChange = (id: number, field: keyof Property, value: any) => {
    if (field === 'valuations') {
      const newEditedValuations = new Map(editedValuations);
      newEditedValuations.set(id, value);
      setEditedValuations(newEditedValuations);
    } else {
      const newEditedData = new Map(editedData);
      const editedItem = newEditedData.get(id) || {};
      editedItem[field] = value;
      newEditedData.set(id, editedItem);
      setEditedData(newEditedData);
    }
  };

  const handleSave = async () => {
    for (const [id, changes] of Array.from(editedData.entries())) {
      await updateProperty(id, changes);
    }

    for (const [id, changes] of Array.from(editedValuations.entries())) {
      await updateValuation(id, changes);
    }

    setEditMode(false);
    setSelectedRows(new Set());
    const propertiesData = await fetchProperties(query, currentPage, itemsPerPage);
    setProperties(propertiesData.data);
  };

  const handleFilterApply = (filters: any) => {
    setFilters(filters);
    setShowFilterModal(false);
  };

  const handleExportClick = () => {
    const csvData = convertToCSV(properties);
    downloadCSV(csvData, 'properties.csv');
  };

  if (loading) {
    return <Loading/>;
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="container mx-auto py-10 px-10 mt-20 border border-inherit">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 border rounded btn-rounded"
            value={search}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
          />
          <button className="text-white px-4 py-2 rounded btn-rounded flex items-center" style={{ backgroundColor: "#20744A" }} onClick={handleImportClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path fill="currentColor" d="M21 14a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4a1 1 0 0 0-2 0v4a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-4a1 1 0 0 0-1-1m-9.71 1.71a1 1 0 0 0 .33.21a.94.94 0 0 0 .76 0a1 1 0 0 0 .33-.21l4-4a1 1 0 0 0-1.42-1.42L13 12.59V3a1 1 0 0 0-2 0v9.59l-2.29-2.3a1 1 0 1 0-1.42 1.42Z"></path>
            </svg>
            &nbsp;Import
          </button>
          <button className="text-white px-4 py-2 rounded btn-rounded flex items-center" style={{ backgroundColor: "#20744A" }} onClick={handleExportClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path fill="currentColor" d="M8.71 7.71L11 5.41V15a1 1 0 0 0 2 0V5.41l2.29 2.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42l-4-4a1 1 0 0 0-.33-.21a1 1 0 0 0-.76 0a1 1 0 0 0-.33.21l-4 4a1 1 0 0 0 1.42 1.42m6.58 8.58L13 18.59V9a1 1 0 0 0-2 0v9.59l-2.29-2.3a1 1 0 1 0-1.42 1.42l4 4a1 1 0 0 0 .33.21a.94.94 0 0 0 .76 0a1 1 0 0 0 .33-.21l4-4a1 1 0 0 0-1.42-1.42Z"></path>
            </svg>
            &nbsp;Export
          </button>
        </div>
        <div className="flex space-x-2">
          {selectedRows.size > 0 && (
            <div className="flex space-x-2">
              {!editMode && (
                <button className="bg-blue-500 text-white px-4 py-2 rounded btn-rounded flex items-center" onClick={handleEditSelected}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z"></path>
                  </svg>
                  &nbsp;Ubah
                </button>
              )}
              {editMode && (
                <button className="bg-green-500 text-white px-4 py-2 rounded btn-rounded flex items-center" onClick={handleSave}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12c0 6.6 5.4 12 12 12s12-5.4 12-12C24 5.4 18.6 0 12 0zm6.3 8.7l-7.5 7.5c-.3.3-.6.4-1 .4s-.7-.1-1-.4l-3.3-3.3c-.5-.5-.5-1.3 0-1.8c.5-.5 1.3-.5 1.8 0L10 13l6.8-6.8c.5-.5 1.3-.5 1.8 0c.4.5.4 1.3-.3 1.8z"></path>
                  </svg>
                  &nbsp; Simpan
                </button>
              )}
              <button className="bg-red-500 text-white px-4 py-2 rounded btn-rounded flex items-center" onClick={handleDeleteSelected}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M15 3H9V1h6v2zm5 0h-4V1c0-1.1-.9-2-2-2H10c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v1h20V5c0-1.1-.9-2-2-2zM4 7v15c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7H4z"></path>
                </svg>
                &nbsp; Hapus
              </button>
            </div>
          )}
          <button className="bg-gray-200 text-black px-4 py-2 rounded btn-rounded flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path fill="currentColor" d="m7 10l5 5l5-5z"></path>
            </svg>
            &nbsp;Sort
          </button>
          <button className="bg-gray-200 text-black px-4 py-2 rounded btn-rounded flex items-center" onClick={() => setShowFilterModal(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22 18.605a.75.75 0 0 1-.75.75h-5.1a2.93 2.93 0 0 1-5.66 0H2.75a.75.75 0 1 1 0-1.5h7.74a2.93 2.93 0 0 1 5.66 0h5.1a.75.75 0 0 1 .75.75m0-13.21a.75.75 0 0 1-.75.75H18.8a2.93 2.93 0 0 1-5.66 0H2.75a.75.75 0 1 1 0-1.5h10.39a2.93 2.93 0 0 1 5.66 0h2.45a.74.74 0 0 1 .75.75m0 6.6a.74.74 0 0 1-.75.75H9.55a2.93 2.93 0 0 1-5.66 0H2.75a.75.75 0 1 1 0-1.5h1.14a2.93 2.93 0 0 1 5.66 0h11.7a.75.75 0 0 1 .75.75"></path>
            </svg>
            &nbsp;Filter
          </button>
        </div>
      </div>
      <div className="table-container" style={{ maxHeight: '60vh' }}>
        <PropertyTable
          currentData={properties}
          selectedRows={selectedRows}
          handleSelectRow={handleSelectRow}
          handleSelectAll={handleSelectAll}
          handleChange={handleChange}
          editMode={editMode}
          editedData={editedData}
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <span className="text-sm text-gray-700">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
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
              className={`px-4 py-2 text-sm border rounded-md ${currentPage === index + 1 ? 'bg-gray-300' : ''}`}
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
      {showFilterModal && (
        <FilterModal
          onApply={handleFilterApply}
          onClose={() => setShowFilterModal(false)}
        />
      )}
      <ImportPopup
        isOpen={showImportModal}
        onClose={handleCloseImportModal}
        onImport={handleImportData}
      />
    </div>
  );
};

export default Page;
