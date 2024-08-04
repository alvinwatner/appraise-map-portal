import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Property } from "../../../types/types";

interface GoogleMapProps {
  initLatitude: number;
  initLongitude: number;
  properties: Property[];
  gMapIsAdding: boolean;
  onMarkerClick: (property: Property) => void;
  onMapClick: (location: google.maps.LatLngLiteral) => void;
  onBoundsChange: (
    swLat: number,
    swLng: number,
    neLat: number,
    neLng: number
  ) => void;
}

function GoogleMaps(
  {
    initLatitude,
    initLongitude,
    properties,
    gMapIsAdding,
    onMarkerClick,
    onMapClick,
    onBoundsChange,
  }: GoogleMapProps,
  ref: React.Ref<any>
) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  const [internalProperties, setInternalProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (!mapInstance.current) return;
  
    const clickListener = mapInstance.current.addListener("click", (event: google.maps.MapMouseEvent) => {
      const lat = event.latLng?.lat();
      const lng = event.latLng?.lng();
      if (lat && lng) {
        onMapClick({
          lat: lat,
          lng: lng,
        });
      }
    });
  
    return () => google.maps.event.removeListener(clickListener);
  }, [gMapIsAdding, onMapClick]);  

  useEffect(() => {
    setInternalProperties([...properties]);
  }, [properties]);

  // Expose setMapCenter method using ref
  useImperativeHandle(ref, () => ({
    setMapCenter: (lat: number, lng: number) => {
      if (mapInstance.current) {
        mapInstance.current.setCenter({ lat, lng });
      }
    },
  }));

  useEffect(() => {
    const loader = new Loader({
      
      apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY!,
      version: "quarterly",
    });

    const initializeMap = async () => {
      const { Map } = await loader.importLibrary("maps");

      const initLoc = { lat: initLatitude, lng: initLongitude };

      if (!mapInstance.current && mapRef.current) {
        mapInstance.current = new Map(mapRef.current, {
          center: initLoc,
          zoom: 15,
          mapId: "NEXT_MAPS_TUTS",
          disableDefaultUI: true,
        });
      }

      clearMarkers();

      internalProperties.forEach((property) => {
        const latitude = parseFloat(
          property.locations.latitude.toString().replace(",", ".")
        );
        const longitude = parseFloat(
          property.locations.longitude.toString().replace(",", ".")
        );

        const location = { lat: latitude, lng: longitude };

        var url = "/marker_aset.png";

        if (property.propertiesType == "data") {
          url = "/marker_data.png";
        }

        const marker = new google.maps.Marker({
          position: location,
          map: mapInstance.current,
          icon: {
            url: url,
            scaledSize: new google.maps.Size(52, 52),
          },
        });

        marker.addListener("click", () => {
          onMarkerClick(property);
        });

        markersRef.current.push(marker);
      });

      if (mapInstance.current) {
        mapInstance.current.setOptions({
          draggableCursor: gMapIsAdding ? "pointer" : null,
          draggable: !gMapIsAdding,
        });

        // Listener for updating bounds after map moves
        google.maps.event.addListener(mapInstance.current, "idle", () => {
          if (mapInstance != null) {
            const bounds = mapInstance!.current!.getBounds();
            const ne = bounds!.getNorthEast();
            const sw = bounds!.getSouthWest();
            onBoundsChange(sw.lat(), sw.lng(), ne.lat(), ne.lng());
          }
        });
      }
    };

    initializeMap();
  }, [
    onMarkerClick,
    gMapIsAdding,
    properties,
    onMapClick,
    onBoundsChange,
    initLatitude,
    initLongitude,
    internalProperties,
  ]);

  // Function to clear all markers from the map
  const clearMarkers = () => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
  };

  return <div className="h-full  " ref={mapRef} />;
}

export default React.forwardRef(GoogleMaps);
