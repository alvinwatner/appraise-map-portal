"use client";
import GoogleMaps from "@/app/components/GoogleMaps";
import { Autocomplete } from "@react-google-maps/api";
import { useMemo, useState, useRef } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { BsSliders } from "react-icons/bs";
import { FiPlus, FiX } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { TbReportAnalytics } from "react-icons/tb";
import { IoCalendarOutline } from "react-icons/io5";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { PiPencilSimpleLight } from "react-icons/pi";

import React, { useEffect } from "react";

import { useLoadScript } from "@react-google-maps/api";
import { PropertyChip, PropertyType } from "@/app/components/PropertyChip";
import { PropertyRowItem } from "@/app/components/PropertyInfoRowItem";

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

  const [activeMarker, setActiveMarker] =
    useState<null | google.maps.LatLngLiteral>(null);

  const toggleAddingMode = () => {
    setIsAdding(!isAdding);
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
    <div className="relative">
      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-25 z-40"></div>
      )}

      <div className="absolute top-0 h-full overflow-auto bg-white w-[380px] z-20 pt-20 px-12">
        <div className="relative  h-[100%] w-full z-10">
          <h3 className="text-lg font-medium">Tanah Kosong</h3>
          <h3 className="text-sm font-thin mb-2">Shasya Agita</h3>
          <PropertyChip type={PropertyType.DATA} className="mb-5" />
          <PropertyRowItem
            icon={TbReportAnalytics}
            title="No Laporan :"
            body="00240/2.0113-02/PI/07/0518/1/V/2023"
            className="mb-1"
          />
          <PropertyRowItem
            icon={IoCalendarOutline}
            title="Tanggal Pembelian :"
            body="10/05/2022"
            className="mb-1"
          />
          <PropertyRowItem
            icon={HiOutlineLocationMarker}
            title="Lokasi :"
            body="Jalan Setia Budi,Tanjung Sari, Medan Selayang, Kota Medan, Provinsi Sumatera Utara"
            className="mb-6"
          />
          <PropertyRowItem
            icon={HiOutlineLocationMarker}
            title="Luas Tanah :"
            body="10.000 m2"
            className="mb-1"
          />
          <PropertyRowItem
            icon={HiOutlineLocationMarker}
            title="Luas Bangunan :"
            body="-"
            className="mb-1"
          />
          <PropertyRowItem
            icon={HiOutlineLocationMarker}
            title="Nilai Tanah/meter :"
            body="Rp. 5.000.000,-"
            className="mb-1"
          />
          <PropertyRowItem
            icon={HiOutlineLocationMarker}
            title="Nilai Bangunan/meter :"
            body="Rp. 5.000.000,-"
            className="mb-1"
          />

          <div className="grid grid-cols-10 grid-rows-2 bg-[#FFEBBF] py-2  rounded-lg mb-10">
            <div className="col-span-2 row-span-2 items-center  flex justify-center">
              <HiOutlineLocationMarker className="text-gray-500" size={20} />
            </div>
            <div className="col-span-8 row-span-1 text-sm ">
              Total Nilai :
            </div>
            <div className="col-span-8 row-span-1 text-xs font-thin">
              Rp. 5.000.000.000,-
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 ">
            <button className="flex items-center justify-center col-span-1 bg-[#5EABEE] hover:bg-blue-700 text-white font-bold py-2  rounded">
              Edit <PiPencilSimpleLight className="ml-2" />
            </button>
            <button className="flex items-center justify-center  col-span-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Delete <RiDeleteBin5Line className="ml-2" />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-8 z-30 p-4 bg-white">
        <div className="relative  w-72 h-10">
          <input
            className="w-72 pl-8 py-2 rounded-lg placeholder:text-sm placeholder:text-gray-400 ring-2 ring-[#D9D9D9] text-sm"
            type="text"
            placeholder="       Search Property"
          />
          <IoSearchOutline className="absolute left-2 top-2 " color="grey" />
          <button>
            <IoClose
              className="absolute right-3 top-2 "
              color="grey"
              size={21}
            />
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
      <GoogleMaps isAdding={isAdding} />

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
