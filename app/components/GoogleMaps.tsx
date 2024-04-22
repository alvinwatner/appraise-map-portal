"use client";

import React, { useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { AiFillAndroid } from "react-icons/ai";


export default function GoogleMaps() {
  const mapRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: "quartely",
      });

      const { Map } = await loader.importLibrary("maps");

      // Define multiple locations
      const locations = [
        { lat: -8.7932639, lng: 115.1499561 },
        { lat: -8.7902898, lng: 115.1539977 },
        { lat: -8.789535, lng: 115.163359 }, 
      ];

      // MARKER
      const { Marker } = (await loader.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;

      const options: google.maps.MapOptions = {
        center: locations[0],
        zoom: 15,
        mapId: "NEXT_MAPS_TUTS",
      };

      const map = new Map(mapRef.current as HTMLDivElement, options);
	  new google.maps.Marker({
		position: { lat: -8.7932639, lng: 115.1499561 },
		map: map,
	  });

	  new google.maps.Marker({
		position: { lat: -8.7932639, lng: 115.1499561 },
		map: map,
	  });


	  new google.maps.Marker({
		position: { lat: -8.7932639, lng: 115.1499561 },
		map: map,
	  });
    };

    initializeMap();
  }, []);

  return <div className="h-[950px]" ref={mapRef} />;
}
