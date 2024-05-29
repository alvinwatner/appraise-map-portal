import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface GoogleMapProps {
  isAdding: boolean;
  onMarkerClick: (location: google.maps.LatLngLiteral) => void;
  onMapClick: (location: google.maps.LatLngLiteral) => void;
}

export default function GoogleMaps({
  isAdding,
  onMarkerClick,
  onMapClick,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: "", // Add your Google Maps API key here
      version: "quarterly",
    });

    const initializeMap = async () => {
      const { Map } = await loader.importLibrary("maps");

      const locations = [
        { lat: -8.7932639, lng: 115.1499561 },
        { lat: -8.7902898, lng: 115.1539977 },
        { lat: -8.789535, lng: 115.163359 },
      ];

      if (!mapInstance.current) {
        mapInstance.current = new Map(mapRef.current as HTMLDivElement, {
          center: locations[0],
          zoom: 15,
          mapId: "NEXT_MAPS_TUTS",
          disableDefaultUI: true,
        });

        // Add a click listener on the map

        locations.forEach((location) => {
          const marker = new google.maps.Marker({
            position: location,
            map: mapInstance.current,
          });

          marker.addListener("click", () => {
            onMarkerClick(location);
          });
        });
      }

      if (mapInstance.current) {
        mapInstance.current.setOptions({
          draggableCursor: isAdding ? "pointer" : null,
          draggable: !isAdding,
        });

        mapInstance.current.addListener(
          "click",
          (event: google.maps.MapMouseEvent) => {
            const lat = event.latLng?.lat();
            const lng = event.latLng?.lng();
            if (lat && lng) {
              console.log(`Latitude: ${lat}, Longitude: ${lng}`);
              if (isAdding) {
                onMapClick({
                  lat: lat,
                  lng: lng,
                });
              }
            }
          }
        );
      }
    };

    initializeMap();
  }, [onMarkerClick, isAdding]);

  return <div className="h-full  " ref={mapRef} />;
}
