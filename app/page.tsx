// pages/index.tsx
"use client";

import {
  useLoadScript,
  GoogleMap,
  MarkerF,
  InfoWindow,
} from "@react-google-maps/api";

import { Autocomplete } from "@react-google-maps/api";

import type { NextPage } from "next";
import { useMemo, useState, useRef } from "react";
import { AiOutlineMenu } from "react-icons/ai"; // Hamburger menu icon

export default function Home() {
  const libraries = useMemo(() => ["places"], []);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapCenter, setMapCenter] = useState({
    lat: -8.7932639,
    lng: 115.1499561,
  });
  const [isNavOpen, setIsNavOpen] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false,
    }),
    []
  );

  const { isLoaded } = useLoadScript({
    // googleMapsApiKey: '',
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
    libraries: libraries as any,
  });

  const [activeMarker, setActiveMarker] =
    useState<null | google.maps.LatLngLiteral>(null);

    const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
      autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.geometry && place.geometry.location) {
        const location = place.geometry.location;
        setMapCenter({ lat: location.lat(), lng: location.lng() });
        if (map) {
          map.panTo(new google.maps.LatLng(location.lat(), location.lng()));
        }
      } else {
        console.log("No geometry found for this place, cannot navigate to location.");
        // Optionally, handle the lack of geometry (e.g., show an error message to the user)
      }
    }
  }; 

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col w-screen h-screen">
      {isNavOpen && (
        <div
          className={`absolute z-20 bg-white w-64 h-full shadow-md transition-transform duration-1000 ease-in-out transform ${
            isNavOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <p className="p-4">Navigation Content Here</p>
        </div>
      )}
      <div className="relative flex-grow">
        <div className="absolute top-0 left-0 z-30 p-4">
          {" "}
          {/* Hamburger menu */}
          <AiOutlineMenu
            className="text-3xl cursor-pointer"
            color="white"
            onClick={() => setIsNavOpen(!isNavOpen)}
          />
        </div>
        <div className="absolute top-0 left-14 z-10 p-4 w-1/3">
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <input
              className="w-full p-2"
              type="text"
              placeholder="Search places..."
            />
          </Autocomplete>
        </div>
        <GoogleMap
          options={mapOptions}
          zoom={14}
          center={mapCenter}
          mapTypeId={google.maps.MapTypeId.ROADMAP}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          onLoad={(map) => console.log("Map Loaded")}
        >
          {/* Marker with InfoWindow */}
          <MarkerF
            position={{ lat: -8.7902898, lng: 115.1539977 }}
            onClick={() =>
              setActiveMarker({ lat: -8.7902898, lng: 115.1539977 })
            }
            onLoad={() => console.log("Marker Loaded")}
            icon={
              "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
            }
          >
            {activeMarker &&
              activeMarker.lat === -8.7902898 &&
              activeMarker.lng === 115.1539977 && (
                <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                  <div>
                    <h1>Marker Title</h1>
                    <p>This is marker content.</p>
                  </div>
                </InfoWindow>
              )}
          </MarkerF>

          {/* Second Marker */}
          <MarkerF
            position={{ lat: -8.789535, lng: 115.163359 }}
            onClick={() => setActiveMarker({ lat: -8.789535, lng: 115.163359 })}
            onLoad={() => console.log("Marker Loaded")}
          >
            {activeMarker &&
              activeMarker.lat === -8.789535 &&
              activeMarker.lng === 115.163359 && (
                <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                  <div>
                    <h1>Another Marker</h1>
                    <p>Details about this location.</p>
                  </div>
                </InfoWindow>
              )}
          </MarkerF>
        </GoogleMap>
      </div>
    </div>
  );
}
