"use client";

import {
  useLoadScript,
  GoogleMap,
  MarkerF,
  InfoWindow,
} from "@react-google-maps/api";
import { useMemo, useState } from "react";

export default function Home() {
  const libraries = useMemo(() => ["places"], []);
  const mapCenter = useMemo(() => ({ lat: -8.7932639, lng: 115.1499561 }), []);

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false,
    }),
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
    libraries: libraries as any,
  });

  // State to manage InfoWindow visibility and content
  const [activeMarker, setActiveMarker] =
    useState<null | google.maps.LatLngLiteral>(null);

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-row">
      <div className="h-screen bg-red-500">
        <p>This is nav bar</p>
      </div>
      <div className="w-full relative">
        <div className="absolute top-0 left-0 z-10 p-4 w-full">

          <input
            className="w-full p-2"
            type="text"
            placeholder="Search places..."
          />
        </div>
		
        <GoogleMap
          options={mapOptions}
          zoom={14}
          center={mapCenter}
          mapTypeId={google.maps.MapTypeId.ROADMAP}
          mapContainerStyle={{ height: "800px" }}
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