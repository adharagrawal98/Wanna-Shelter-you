import React from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { REACT_APP_GOOGLE_MAPS_KEY } from "../constants/constants";

const MapComponent = ({ selectedLocation }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_KEY,
    libraries: ["places"],
  });

  if (loadError) {
    console.error("Map loading error:", loadError);
    return <div style={{ color: "red" }}>Error loading maps. Please try again later.</div>;
  }

  if (!isLoaded) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading Maps...</div>;
  }

  return (
    <div style={{ marginTop: "50px" }}>
      <GoogleMap
        mapContainerStyle={{
          height: "500px",
          width: "100%",
        }}
        center={selectedLocation}
        zoom={13}
      >
        <MarkerF
          position={selectedLocation}
          icon={"http://maps.google.com/mapfiles/ms/icons/green-dot.png"}
        />
      </GoogleMap>
    </div>
  );
};

export default MapComponent;