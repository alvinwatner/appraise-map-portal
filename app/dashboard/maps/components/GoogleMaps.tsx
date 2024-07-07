import React, { useEffect, useImperativeHandle, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Property } from "../../../types/types";

interface GoogleMapProps {
  properties: Property[];
  isAdding: boolean;
  onMarkerClick: (property: Property) => void;
  onMapClick: (location: google.maps.LatLngLiteral) => void;
}

function GoogleMaps(
  {
    properties,
    isAdding,
    onMarkerClick,
    onMapClick,
  }: GoogleMapProps,
  ref: React.Ref<any>
) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);

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
      // apiKey: "AIzaSyDAV8Ih-E6v-_g9qPNcoKcd1hRkk0Vn7N0",
      version: "quarterly",
    });

    const initializeMap = async () => {
      if (!properties || properties.length === 0) {
        console.error("No properties available to initialize map markers.");
        return;
      }
      const { Map } = await loader.importLibrary("maps");

      // const locations = [
      //   { lat: -8.7932639, lng: 115.1499561 },
      //   { lat: -8.7902898, lng: 115.1539977 },
      //   { lat: -8.789535, lng: 115.163359 },
      // ];

      const initLatitude = parseFloat(
        properties[0]?.locations.latitude.toString().replace(",", ".")
      );
      const initLongitude = parseFloat(
        properties[0]?.locations.longitude.toString().replace(",", ".")
      );

      const initLoc = { lat: initLatitude, lng: initLongitude };

      if (!mapInstance.current && mapRef.current) {
        mapInstance.current = new Map(mapRef.current, {
          center: initLoc,
          zoom: 15,
          mapId: "NEXT_MAPS_TUTS",
          disableDefaultUI: true,
        });

        properties.forEach((property) => {
          // Ensure latitude and longitude are converted to numbers with period as decimal separator
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
              // url: `{ ${property.propertiesType == "data" ?  "/marker_data.png" : "/marker_aset.png"}}`,
              scaledSize: new google.maps.Size(52, 52),
            },
          });

          marker.addListener("click", () => {
            onMarkerClick(property);
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
  }, [onMarkerClick, isAdding, properties, onMapClick]);

  return <div className="h-full  " ref={mapRef} />;
}

export default React.forwardRef(GoogleMaps);
