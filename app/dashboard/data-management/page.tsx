'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchProperties, updatePropertiesIsDeleted, updateProperty, updateValuation } from '@/app/services/dataManagement.service';
import { Property } from '@/app/types/types';
import PropertyTable from './components/PropertyTable';

const Page = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState(new Set<number>());
  const [itemsPerPage] = useState(10);
  const [deletionOccurred, setDeletionOccurred] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState<Map<number, Partial<Property>>>(new Map());
  const [editedValuations, setEditedValuations] = useState<Map<number, any>>(new Map());

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get('page') as string) || 1;
  const totalPages = Math.ceil(properties.length / itemsPerPage);
  const currentData = properties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    const getProperties = async () => {
      const propertiesData = await fetchProperties();
      setProperties(propertiesData);
      setLoading(false);
    };

    getProperties();
  }, [deletionOccurred]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelectedRows = new Set(currentData.map((item) => item.id));
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

  const handlePageChange = (page: number) => {
    router.push(`?page=${page}`);
  };

  const handleDeleteSelected = async () => {
    const idsToDelete = Array.from(selectedRows);
    await updatePropertiesIsDeleted(idsToDelete, true);
    setDeletionOccurred(!deletionOccurred);
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
    setDeletionOccurred(!deletionOccurred);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 border rounded btn-rounded"
          />
          <button className="text-white px-4 py-2 rounded btn-rounded flex items-center" style={{ backgroundColor: "#20744A" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path fill="currentColor" d="M21 14a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4a1 1 0 0 0-2 0v4a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-4a1 1 0 0 0-1-1m-9.71 1.71a1 1 0 0 0 .33.21a.94.94 0 0 0 .76 0a1 1 0 0 0 .33-.21l4-4a1 1 0 0 0-1.42-1.42L13 12.59V3a1 1 0 0 0-2 0v9.59l-2.29-2.3a1 1 0 1 0-1.42 1.42Z"></path>
            </svg>
            &nbsp;Import
          </button>
          <button className="text-white px-4 py-2 rounded btn-rounded flex items-center" style={{ backgroundColor: "#20744A" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path fill="currentColor" d="M8.71 7.71L11 5.41V15a1 1 0 0 0 2 0V5.41l2.29 2.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42l-4-4a1 1 0 0 0-.33-.21a1 1 0 0 0-.76 0a1 1 0 0 0-.33.21l-4 4a1 1 0 1 0 1.42 1.42M21 14a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4a1 1 0 0 0-2 0v4a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-4a1 1 0 0 0-1-1"></path>
            </svg>
            &nbsp; Export
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
          <button className="bg-gray-200 text-black px-4 py-2 rounded btn-rounded flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22 18.605a.75.75 0 0 1-.75.75h-5.1a2.93 2.93 0 0 1-5.66 0H2.75a.75.75 0 1 1 0-1.5h7.74a2.93 2.93 0 0 1 5.66 0h5.1a.75.75 0 0 1 .75.75m0-13.21a.75.75 0 0 1-.75.75H18.8a2.93 2.93 0 0 1-5.66 0H2.75a.75.75 0 1 1 0-1.5h10.39a2.93 2.93 0 0 1 5.66 0h2.45a.74.74 0 0 1 .75.75m0 6.6a.74.74 0 0 1-.75.75H9.55a2.93 2.93 0 0 1-5.66 0H2.75a.75.75 0 1 1 0-1.5h1.14a2.93 2.93 0 0 1 5.66 0h11.7a.75.75 0 0 1 .75.75"></path>
            </svg>
            &nbsp;Filter
          </button>
        </div>
      </div>
      <PropertyTable
        currentData={currentData}
        selectedRows={selectedRows}
        handleSelectRow={handleSelectRow}
        handleSelectAll={handleSelectAll}
        handleChange={handleChange}
        editMode={editMode}
        editedData={editedData} // Pass editedData to PropertyTable
      />
      <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, properties.length)}</span> of{' '}
              <span className="font-medium">{properties.length}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${currentPage === index + 1
                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
