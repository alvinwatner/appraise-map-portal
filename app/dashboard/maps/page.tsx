"use client";
import GoogleMaps from "@/app/components/GoogleMaps";
import { Autocomplete } from "@react-google-maps/api";
import { useMemo, useState, useRef } from "react";
import { fetchProperties } from "@/app/services/dataManagement.service";

import { IoSearchOutline } from "react-icons/io5";
import { BsSliders } from "react-icons/bs";
import { FiPlus, FiX } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { MarkerDetailContent } from "@/app/components/MarkerDetailContent";

import React, { useEffect } from "react";

import { useLoadScript } from "@react-google-maps/api";
import { SearchResult } from "@/app/components/SearchResult";
import { AddMarkerForm } from "@/app/components/AddMarkerForm";
import { Property } from "@/app/types/types";

enum LeftWhiteSheetComponent {
  markerDetail,
  searchResult,
  add,
  hide,
}

export default function Page() {
  const libraries = useMemo(() => ["places"], []);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapCenter, setMapCenter] = useState({
    lat: -8.7932639,
    lng: 115.1499561,
  });

  const [properties, setProperties] = useState<Property[]>([]);

  
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "",
    // googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
    libraries: libraries as any,
  });

  useEffect(() => {
    if (isLoaded) {
      fetchProperties().then(setProperties).catch(console.error);
    }
  }, [isLoaded]);

  const [isAdding, setIsAdding] = useState(false);
  const [isShowLeftWhiteSheet, setLeftWhiteSheet] = useState(false);
  const [leftWhiteSheetComponent, setLeftWhiteSheetComponent] = useState(
    LeftWhiteSheetComponent.hide
  );

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  const [clickCoordinates, setClickCoordinates] =
    useState<null | google.maps.LatLngLiteral>(null);

  const [markerDetail, setMarkerDetail] =
    useState<null | google.maps.LatLngLiteral>(null);

  const [activeMarker, setActiveMarker] =
    useState<null | google.maps.LatLngLiteral>(null);

  const toggleAddingMode = () => {
    setIsAdding(!isAdding);
    setClickCoordinates(null);
    if (isAdding) {
      setLeftWhiteSheet(false);
      setLeftWhiteSheetComponent(LeftWhiteSheetComponent.hide);
    }
  };

  const handleMarkerClick = (property: Property) => {
    console.log("is this executeed");
    setSelectedProperty(property);
    setLeftWhiteSheet(true);
    setLeftWhiteSheetComponent(LeftWhiteSheetComponent.markerDetail);
    setClickCoordinates(null);
  };

  const handleMapClick = (location: google.maps.LatLngLiteral) => {
    console.log("eeehh dikasdkakd");
    setLeftWhiteSheet(true);
    setLeftWhiteSheetComponent(LeftWhiteSheetComponent.add);
  };

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

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const renderLeftWhiteSheetComponent = () => {
    switch (leftWhiteSheetComponent) {
      case LeftWhiteSheetComponent.markerDetail:
        return (
          <MarkerDetailContent
            property={selectedProperty!}
            onClose={() => {
              setLeftWhiteSheet(false);
              setLeftWhiteSheetComponent(LeftWhiteSheetComponent.hide);
            }}
          />
        );
      case LeftWhiteSheetComponent.markerDetail:
        return (
          <AddMarkerForm
            onClose={() => {
              setLeftWhiteSheet(false);
              setLeftWhiteSheetComponent(LeftWhiteSheetComponent.hide);
            }}
          />
        );
      case LeftWhiteSheetComponent.searchResult:
        return <SearchResult />;
      case LeftWhiteSheetComponent.add:
        return (
          <AddMarkerForm
            onClose={() => {
              setLeftWhiteSheet(false);
              setLeftWhiteSheetComponent(LeftWhiteSheetComponent.hide);
            }}
          />
        );

      default:
        return null;
    }
  };

  const onPlaceChanged = () => {
    console.log("sedang terjadi");

    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      console.log("place = " + place);
      if (place && place.geometry && place.geometry.location) {
        const location = place.geometry.location;
        setMapCenter({ lat: location.lat(), lng: location.lng() });
        if (map) {
          map.panTo(new google.maps.LatLng(location.lat(), location.lng()));
        }
      } else {
        console.log(
          "No geometry found for this place, cannot navigate to location."
        );
        // Optionally, handle the lack of geometry (e.g., show an error message to the user)
      }
    }
  };

  if (!isLoaded) {
    return <p>Loading...</p>;
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("keluarkan sesuatu");
              setLeftWhiteSheet(true);
              setLeftWhiteSheetComponent(LeftWhiteSheetComponent.searchResult);
            }}
          >
            <input
              className="w-72 pl-8 py-2 rounded-lg placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
              type="text"
              placeholder="       Search Property"
            />
          </form>
          <IoSearchOutline className="absolute left-2 top-2" color="grey" />
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

      <div className="absolute top-[15px] left-[750px] z-10 w-24 h-9 bg-white  rounded-md ring-1  ring-gray-400">
        <div className="relative w-full h-full flex items-center justify-center">
          <>
            <BsSliders className="mr-2" />

            <p className="text-sm">Filter</p>
          </>
        </div>
      </div>

      {/* Google Maps component */}
      <GoogleMaps

        properties={properties}
        isAdding={isAdding}
        onMarkerClick={handleMarkerClick}
        onMapClick={handleMapClick}
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
    </div>
  );
}
