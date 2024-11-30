import React, { useEffect, useRef, useState, useCallback } from "react";
import { REACT_APP_GOOGLE_MAPS_KEY } from "../constants/constants";

const loadScript = (url, callback) => {
  if (document.querySelector(`script[src="${url}"]`)) {
    if (window.google) {
      callback();
    } else {
      document.querySelector(`script[src="${url}"]`).addEventListener("load", callback);
    }
    return;
  }

  const script = document.createElement("script");
  script.type = "text/javascript";
  script.async = true;
  script.src = url;
  script.onload = callback;
  script.onerror = () => console.error("Google Maps script failed to load.");
  document.head.appendChild(script);
};

const SearchLocationInput = ({ setSelectedLocation, setSelectedAddress }) => {
  const [query, setQuery] = useState("");
  const autoCompleteRef = useRef(null);
  const autocompleteInstanceRef = useRef(null);

  const initializeAutocomplete = useCallback(() => {
    if (autoCompleteRef.current && !autocompleteInstanceRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        autoCompleteRef.current,
        {
          componentRestrictions: { country: "GB" },
          fields: ["formatted_address", "geometry"],
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();

        if (place.geometry) {
          const formattedAddress = place.formatted_address;
          const latLng = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };

          setSelectedAddress(formattedAddress);
          setSelectedLocation(latLng);
          setQuery(formattedAddress);
        } else {
          console.error("Place details are unavailable.");
        }
      });

      autocompleteInstanceRef.current = autocomplete;
    }
  }, [setSelectedAddress, setSelectedLocation]);

  useEffect(() => {
    const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${REACT_APP_GOOGLE_MAPS_KEY}&libraries=places`;

    loadScript(scriptUrl, initializeAutocomplete);

    return () => {
      if (autocompleteInstanceRef.current) {
        autocompleteInstanceRef.current = null;
      }
    };
  }, [initializeAutocomplete]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <div className="search-location-input mt-1">
      <label>Type in your suburb or postcode</label>
      <input
        ref={autoCompleteRef}
        className="form-control ml-5 bord"
        style={{ border: "1px solid black", padding: "8px", borderRadius: "4px" }}
        onChange={handleInputChange}
        placeholder="Search Places ..."
        value={query}
      />
    </div>
  );
};

export default SearchLocationInput;