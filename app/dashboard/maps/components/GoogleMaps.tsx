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

const darkModeStyle: google.maps.MapTypeStyle[] = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#bdbdbd",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#181818",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1b1b1b",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#2c2c2c",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8a8a8a",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#373737",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#3c3c3c",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [
      {
        color: "#4e4e4e",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#000000",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#3d3d3d",
      },
    ],
  },
];

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

    const clickListener = mapInstance.current.addListener(
      "click",
      (event: google.maps.MapMouseEvent) => {
        const lat = event.latLng?.lat();
        const lng = event.latLng?.lng();
        if (lat && lng) {
          onMapClick({
            lat: lat,
            lng: lng,
          });
        }
      }
    );

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
      apiKey: "",
      // apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY!,
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
          styles: darkModeStyle,
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
