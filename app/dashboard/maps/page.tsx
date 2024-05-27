"use client";
import GoogleMaps from "@/app/components/GoogleMaps";
import { Autocomplete } from "@react-google-maps/api";
import { useMemo, useState, useRef } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { BsSliders } from "react-icons/bs";
import { FiPlus, FiX } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { MarkerDetailContent } from "@/app/components/MarkerDetailContent";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { IoIosMore } from "react-icons/io";
import { GoArrowRight } from "react-icons/go";

import React, { useEffect } from "react";

import { useLoadScript } from "@react-google-maps/api";
import { PropertyChip, PropertyType } from "@/app/components/PropertyChip";
import { SearchResult } from "@/app/components/SearchResult";

enum SearchWhiteSheetComponent {
  markerDetail,
  searchResult,
  hide,
}

export default function Page() {
  const libraries = useMemo(() => ["places"], []);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapCenter, setMapCenter] = useState({
    lat: -8.7932639,
    lng: 115.1499561,
  });
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "",
    // googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
    libraries: libraries as any,
  });

  const [isAdding, setIsAdding] = useState(false);
  const [isShowSearchWhiteSheet, setSearchWhiteSheet] = useState(false);
  const [searchWhiteSheetComponent, setSearchWhiteSheetComponent] = useState(
    SearchWhiteSheetComponent.hide
  );

  const [markerDetail, setMarkerDetail] =
    useState<null | google.maps.LatLngLiteral>(null);

  const [activeMarker, setActiveMarker] =
    useState<null | google.maps.LatLngLiteral>(null);

  const toggleAddingMode = () => {
    setIsAdding(!isAdding);
  };

  const handleMarkerClick = (location: google.maps.LatLngLiteral) => {
    console.log("is this executeed");
    setMarkerDetail(location);
    setSearchWhiteSheet(true);
    setSearchWhiteSheetComponent(SearchWhiteSheetComponent.markerDetail);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsAdding(false);
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

  const renderSearchWhiteSheetComponent = () => {
    switch (searchWhiteSheetComponent) {
      case SearchWhiteSheetComponent.markerDetail:
        return <MarkerDetailContent />;
      case SearchWhiteSheetComponent.searchResult:
        return <SearchResult/>       
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
    <div className="relative h-full bg-blue-500">
      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-25 z-40"></div>
      )}

      {isShowSearchWhiteSheet && (
        <div className="absolute top-0 h-full overflow-auto bg-white w-[380px] z-20 pt-20 ">
          {renderSearchWhiteSheetComponent()}
        </div>
      )}

      <div
        className={`absolute top-0 left-8 z-30 p-4 ${
          isShowSearchWhiteSheet && "bg-white"
        }`}
      >
        <div className="relative  w-72 h-10">
          <div className=""></div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("keluarkan sesuatu");
              setSearchWhiteSheet(true);
              setSearchWhiteSheetComponent(
                SearchWhiteSheetComponent.searchResult
              );
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
              setSearchWhiteSheet(false);
              setSearchWhiteSheetComponent(SearchWhiteSheetComponent.hide);
            }}
          >
            {isShowSearchWhiteSheet && (
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
      <GoogleMaps isAdding={isAdding} onMarkerClick={handleMarkerClick} />

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
