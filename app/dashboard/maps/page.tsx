"use client";

// React imports
import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";

// Next.js utilities
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Google Maps related imports
import { Autocomplete, useLoadScript } from "@react-google-maps/api";

// Service and utility imports
import {
  fetchProperties,
  fetchPropertiesByBoundingBox,
} from "@/app/services/dataManagement.service";
import { supabase } from "@/app/lib/supabaseClient";

// Component imports
import GoogleMaps from "@/app/dashboard/maps/components/GoogleMaps";
import { MarkerDetailContent } from "@/app/dashboard/maps/components/MarkerDetailContent";
import { SearchResult } from "@/app/dashboard/maps/components/SearchResult";
import { AddMarkerForm } from "@/app/dashboard/maps/components/AddMarkerForms";
import { EditMarkerForm } from "@/app/dashboard/maps/components/EditMarkerForm";
import Loading from "@/app/components/Loading";
import { Search } from "./components/Search";

// Type imports
import { Property } from "@/app/types/types";

// Icon imports
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoSearchOutline,
  IoClose,
} from "react-icons/io5";
import { BsSliders } from "react-icons/bs";
import { FiPlus, FiX } from "react-icons/fi";
import FilterModal from "../data-management/components/FilterModal";

enum LeftWhiteSheetComponent {
  markerDetail,
  searchResult,
  add,
  edit,
  hide,
}

export default function Page() {
  // State and Reference Hooks
  const router = useRouter();
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [modalInfo, setModalInfo] = useState({
    isOpen: false,
    isSuccess: false,
    message: "",
  });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [onEditProperty, setOnEditProperty] = useState<Property>();
  const [bounds, setBounds] = useState({
    swLat: 0,
    swLng: 0,
    neLat: 0,
    neLng: 0,
  });

  const [filters, setFilters] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const [isShowLeftWhiteSheet, setLeftWhiteSheet] = useState(false);
  const [googleMapKey, setgoogleMapKey] = useState(Date.now());
  const [leftWhiteSheetComponent, setLeftWhiteSheetComponent] = useState(
    LeftWhiteSheetComponent.hide
  );
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [clickCoordinates, setClickCoordinates] =
    useState<null | google.maps.LatLngLiteral>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<any>();

  // Utility Hooks
  const libraries = useMemo(() => ["places"], []);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "",
    libraries: libraries as any,
  });

  // Define the callback to update bounds
  const handleBoundsChange = useCallback(
    (swLat: number, swLng: number, neLat: number, neLng: number) => {
      setBounds({ swLat, swLng, neLat, neLng });
    },
    []
  );

  const fetchData = useCallback(async () => {
    console.log("Refreshing data for new bounds");
    try {
      const propertiesData = await fetchPropertiesByBoundingBox(
        bounds.swLat,
        bounds.swLng,
        bounds.neLat,
        bounds.neLng,
        filters
      );
      console.log(`properties data successfully fetched`);
      setProperties(propertiesData.data);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    }
  }, [bounds.neLat, bounds.neLng, bounds.swLat, bounds.swLng, filters]);

  // Fetch data based on bounds
  useEffect(() => {
    if (bounds.neLat !== 0) {
      fetchData();
    }
  }, [bounds, fetchData]);

  const refreshData = () => {
    setProperties([]);
    fetchData().then(() => setgoogleMapKey(Date.now()));
  };

  // Keydown event handling for 'Escape' to close forms/modals
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLeftWhiteSheet(false);
        setLeftWhiteSheetComponent(LeftWhiteSheetComponent.hide);
        setIsAdding(false);
        setClickCoordinates(null);
      }
    };

    if (isAdding) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isAdding]);

  // 4. Handler Functions
  // Functions to handle UI interactions

  useEffect(() => {
    console.log(`filters = ${JSON.stringify(filters)}`);
  }, [filters]);

  const handleFilterApply = (filters: any) => {
    setFilters(filters);
    setShowFilterModal(false);
    refreshData();
  };

  const handleModalSuccess = (message: string) => {
    setIsAdding(false);
    setLeftWhiteSheet(false);
    setLeftWhiteSheetComponent(LeftWhiteSheetComponent.hide);
    setModalInfo({
      isOpen: true,
      isSuccess: true,
      message: message,
    });
    refreshData();
  };

  const handleModalFailure = (message: string) => {
    setIsAdding(false);
    setLeftWhiteSheet(false);
    setLeftWhiteSheetComponent(LeftWhiteSheetComponent.hide);
    setModalInfo({
      isOpen: true,
      isSuccess: true,
      message: message,
    });
    refreshData();
  };

  const handleShowMarkerDetail = (property: Property) => {
    setSelectedProperty(property);
    setLeftWhiteSheet(true);
    setLeftWhiteSheetComponent(LeftWhiteSheetComponent.markerDetail);
    setClickCoordinates(null);
  };

  const handleMarkerClick = (property: Property) => {
    handleShowMarkerDetail(property);
  };

  const handleOnEditClick = (property: Property) => {
    setOnEditProperty(property);
    setLeftWhiteSheetComponent(LeftWhiteSheetComponent.edit);
  };

  const handleMapClick = (location: google.maps.LatLngLiteral) => {
    setLat(location.lat);
    setLng(location.lng);
    setLeftWhiteSheet(true);
    setLeftWhiteSheetComponent(LeftWhiteSheetComponent.add);
  };

  const toggleAddingMode = () => {
    setIsAdding(!isAdding);
    setClickCoordinates(null);
    if (isAdding) {
      setLeftWhiteSheet(false);
      setLeftWhiteSheetComponent(LeftWhiteSheetComponent.hide);
    }
  };

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.geometry && place.geometry.location) {
        const location = place.geometry.location;
        mapRef.current.setMapCenter(location.lat(), location.lng());
      } else {
        console.log(
          "No geometry found for this place, cannot navigate to location."
        );
      }
    }
  };

  // 5. Render Function
  const renderLeftWhiteSheetComponent = () => {
    switch (leftWhiteSheetComponent) {
      case LeftWhiteSheetComponent.markerDetail:
        return (
          <MarkerDetailContent
            property={selectedProperty!}
            onEditClicked={handleOnEditClick}
            onShowModalSuccess={() => {
              handleModalSuccess("Property deleted successfully!");
            }}
            onShowModalFail={() => {
              handleModalSuccess(
                "Failed to delete property. Contact customer support."
              );
            }}
            onClose={() => {
              setLeftWhiteSheet(false);
              setLeftWhiteSheetComponent(LeftWhiteSheetComponent.hide);
            }}
          />
        );

      case LeftWhiteSheetComponent.searchResult:
        return (
          <SearchResult
            query={searchParams.get("search")?.toString() ?? ""}
            onDetailClicked={(property: Property) => {
              handleShowMarkerDetail(property);
            }}
            onNavigateClicked={(lat, lng) => {
              setLeftWhiteSheet(false);
              setLeftWhiteSheetComponent(LeftWhiteSheetComponent.hide);
              mapRef.current.setMapCenter(lat, lng);
            }}
          />
        );

      case LeftWhiteSheetComponent.add:
        return (
          <AddMarkerForm
            onClose={() => {
              setLeftWhiteSheet(false);
              setLeftWhiteSheetComponent(LeftWhiteSheetComponent.hide);
            }}
            lat={lat}
            lng={lng}
            onShowModalSuccess={() => {
              handleModalSuccess("Property edited successfully!");
            }}
            onShowModalFail={() => {
              handleModalFailure(
                "Failed to edit property. Contact customer support."
              );
            }}
          />
        );

      case LeftWhiteSheetComponent.edit:
        return (
          <EditMarkerForm
            property={onEditProperty!}
            onClose={() => {
              setLeftWhiteSheet(false);
              setLeftWhiteSheetComponent(LeftWhiteSheetComponent.hide);
            }}
            onShowModalSuccess={() => {
              handleModalSuccess("Property added successfully!");
            }}
            onShowModalFail={() => {
              handleModalFailure(
                "Failed to add property. Contact customer support."
              );
            }}
          />
        );

      default:
        return null; // For any unhandled case, return null
    }
  };

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <div className="relative h-full">
      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-25 pointer-events-none z-10"></div>
      )}

      {isShowLeftWhiteSheet && (
        <div
          className={`absolute top-0 h-full overflow-auto bg-white w-[380px] ${
            leftWhiteSheetComponent == LeftWhiteSheetComponent.searchResult
              ? "z-20 pt-20"
              : "z-50 pt-0"
          }   `}
        >
          {renderLeftWhiteSheetComponent()}
        </div>
      )}

      <div
        className={`absolute top-0 left-8 z-30 p-4 ${
          isShowLeftWhiteSheet && "bg-white"
        }`}
      >
        <div className="relative w-72 h-10">
          <div className=""></div>
          <Search
            onSubmit={(e) => {
              e.preventDefault();
              if (!searchParams.get("search")?.trim()) {
                return;
              }

              setLeftWhiteSheet(true);
              setLeftWhiteSheetComponent(LeftWhiteSheetComponent.searchResult);
            }}
          />

          <button
            onClick={() => {
              setLeftWhiteSheet(false);
              setLeftWhiteSheetComponent(LeftWhiteSheetComponent.hide);
            }}
          >
            {leftWhiteSheetComponent ==
              LeftWhiteSheetComponent.searchResult && (
              <IoClose
                className="absolute right-3 top-2 "
                color="grey"
                size={21}
              />
            )}
          </button>
        </div>
      </div>

      <div className="absolute top-0 left-96 z-30 p-4 w-1/3">
        <Autocomplete
          onLoad={onLoad}
          onPlaceChanged={onPlaceChanged}
          options={{ types: ["address"] }}
        >
          <div className="relative w-full ">
            <input
              className="w-72 pl-8 py-2 rounded-lg placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
              type="text"
              placeholder="       Search Address"
            />
            <IoSearchOutline className="absolute left-2 top-2 " color="grey" />
          </div>
        </Autocomplete>
      </div>

      <button
        className="absolute top-[15px] left-[750px] z-50 w-24 h-9 bg-white  rounded-md ring-1  ring-gray-400"
        onClick={() => setShowFilterModal(true)}
        // onClick={() => {
        //   setShowFilterModal(true);
        // }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <>
            <BsSliders className="mr-2" />

            <p className="text-sm">Filter</p>
          </>
        </div>
      </button>

      <GoogleMaps
        initLatitude={3.560506}
        initLongitude={98.636445}
        key={googleMapKey}
        ref={mapRef}
        properties={properties}
        isAdding={isAdding}
        onMarkerClick={handleMarkerClick}
        onMapClick={handleMapClick}
        onBoundsChange={handleBoundsChange}
      />

      {/* Floating action button */}
      <button
        className={`fixed bottom-10 right-10 z-50 p-4 rounded-full ${
          isAdding
            ? "bg-white cursor-pointer ring-2 ring-black"
            : "bg-yellow-400"
        } hover:ring-2 hover:ring-white transition duration-700`}
        onClick={toggleAddingMode}
        style={{ cursor: "pointer", outline: "none" }}
      >
        {isAdding ? (
          <FiX className="text-3xl text-gray-800" />
        ) : (
          <FiPlus className="text-3xl text-black" />
        )}
      </button>

      {showFilterModal && (
        <FilterModal
          onApply={handleFilterApply}
          onClose={() => setShowFilterModal(false)}
          defaultFilters={filters}
        />
      )}

      <ModalUpdateResult
        isOpen={modalInfo.isOpen}
        onClose={() => setModalInfo({ ...modalInfo, isOpen: false })}
        isSuccess={modalInfo.isSuccess}
        message={modalInfo.message}
      />
    </div>
  );
}

const ModalUpdateResult: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  isSuccess: boolean;
  message: string;
}> = ({ isOpen, onClose, isSuccess, message }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute top-0 left-0  w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-5 mx-4 rounded-lg flex flex-col items-center">
        {isSuccess ? (
          <IoCheckmarkCircleOutline size={48} color="green" />
        ) : (
          <IoCloseCircleOutline size={48} color="red" />
        )}
        <p className="text-lg my-2">{message}</p>
        <button
          className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};
