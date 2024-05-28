import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface GoogleMapProps {
  isAdding: boolean;
  onMarkerClick: (location: google.maps.LatLngLiteral) => void;
}

export default function GoogleMaps({ isAdding, onMarkerClick }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  console.log("Component render or rerender");

  // Load and initialize the map
  useEffect(() => {
    const loader = new Loader({
      apiKey: "",
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
        console.log("Map initialized");

        mapInstance.current = new Map(mapRef.current as HTMLDivElement, {
          center: locations[0],
          zoom: 15,
          mapId: "NEXT_MAPS_TUTS",
          disableDefaultUI: true,
        });

        locations.forEach((location) => {
          const marker = new google.maps.Marker({
            position: location,
            map: mapInstance.current,
          });

          marker.addListener("click", () => {
            console.log("is this executeed mapss")
            onMarkerClick(location);
          });
        });
      }
    };

    initializeMap();
  }, []);

  // Update map options and manage click events
  useEffect(() => {
    // const handleMapClick = (event: google.maps.MapMouseEvent) => {
    //   if (event.latLng) {
    //     console.log(`Clicked Lat: ${event.latLng.lat()}, Lng: ${event.latLng.lng()}`);
    //   }
    // };
    const handleMapClick = () => {
      console.log("Test"); // Log "Test" when the map is clicked
    };

    console.log(
      "Checking map instance and isAdding",
      !!mapInstance.current,
      isAdding
    );

    if (mapInstance.current) {
      mapInstance.current.setOptions({
        draggableCursor: isAdding ? "pointer" : null,
        draggable: !isAdding,
      });

      if (isAdding) {
        console.log("Adding event listener");

        // Add click listener when isAdding is true
        mapInstance.current.addListener("click", handleMapClick);
      } else {
        console.log("Removing event listener");

        // Remove all click listeners when isAdding is false
        google.maps.event.clearListeners(mapInstance.current, "click");
      }
    }

    // Clean up listener on unmount or when isAdding changes
    return () => {
      if (mapInstance.current) {
        google.maps.event.clearListeners(mapInstance.current, "click");
      }
    };
  }, [isAdding]);

  return <div className="h-full" ref={mapRef} />;
}
