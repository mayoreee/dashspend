"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Footer from "@/components/footer";
import { NavBar } from "@/components/nav-bar";
import useMerchants from "@/hooks/use-merchants";
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {
    ssr: false, // Disable SSR for this component
  }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  {
    ssr: false, // Disable SSR for this component
  }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false, // Disable SSR for this component
});
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  {
    ssr: false, // Disable SSR for this component
  }
);
const ZoomControl = dynamic(
  () => import("react-leaflet").then((mod) => mod.ZoomControl),
  {
    ssr: false, // Disable SSR for this component
  }
);

const Locations = dynamic(() => import("./Locations"), {
  ssr: false,
});

import "leaflet/dist/leaflet.css";

const defaultLocation: [number, number] = [37.7749, -122.4194]; // San Francisco coordinates

export default function Map() {
  const { merchants, error } = useMerchants();

  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.error("Error getting user's location: ", error);
          setUserLocation(defaultLocation); // Default to San Francisco if location access is denied
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setUserLocation(defaultLocation); // Default to San Francisco if Geolocation is not supported
    }
  }, []);

  return (
    <div className="relative">
      {userLocation && (
        <div
          id="map"
          className="fixed inset-0 z-[-1]"
          style={{ height: "100vh", width: "100vw" }}
        >
          <MapContainer
            center={userLocation}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="bottomright" />
            <Marker position={userLocation}>
              <Popup>You are here.</Popup>
            </Marker>
            <Locations />
          </MapContainer>
        </div>
      )}
      <div className="relative z-10">
        <NavBar merchants={merchants} />
        {/* <Footer /> */}
      </div>
    </div>
  );
}
