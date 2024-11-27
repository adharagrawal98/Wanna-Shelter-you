import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, InfoWindowF, Marker } from '@react-google-maps/api';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import SearchLocationInput from '../components/GooglePlacesApi';
import { REACT_APP_GOOGLE_MAPS_KEY } from "../constants/constants";


const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // returns the distance in meters
};

const DonorMap = () => {
    const navigate = useNavigate();
    const [selectedLocation, setSelectedLocation] = useState({ lat: 51.509865, lng: -0.118092 }); // Default to London
    const [charityData, setCharityData] = useState([]);  // Store all shelter data here
    const [selectedCharity, setSelectedCharity] = useState(null); // Selected shelter for InfoWindow
    const [zoomLevel, setZoomLevel] = useState(12); // Default zoom level
    const [googleLoaded, setGoogleLoaded] = useState(false);  // Track when Google API is loaded
    const [selectedAddress, setSelectedAddress] = useState(''); // State for selected address

    // Fetch shelters from Firestore on component mount
    useEffect(() => {
        const fetchcharity = async () => {
            try {
                const charityCollection = collection(db, "charityDetails");
                const charitySnapshot = await getDocs(charityCollection);
                const charityData = charitySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCharityData(charityData);
            } catch (error) {
                console.error("Error fetching shelters:", error);
            }
        };

        fetchcharity();
    }, []);

    // Function to handle navigation to the selected shelter's page
    const handleDonateNow = (charityID) => {
        localStorage.setItem("charityID", charityID);
        navigate(`/shelter/${charityID}`);
    };

    // Filter shelters based on distance to selected location
    const filteredcharity = charityData.filter(charityData => {
        if (charityData.lat && charityData.lng && !isNaN(charityData.lat) && !isNaN(charityData.lng)) {
            const distance = getDistance(selectedLocation.lat, selectedLocation.lng, charityData.lat, charityData.lng);
            return distance < 5000; // Only shelters within 5 km (5000 meters)
        }
        return false;
    });

    // Update zoom and map center when a location is selected
    const handleLocationChange = (location, address) => {
        setSelectedLocation(location);
        setSelectedAddress(address); // Set the address when location changes
        setZoomLevel(14); // Zoom in closer when a new location is selected
    };

    // Handle marker click and open the InfoWindow
    const handleMarkerClick = (charityData) => {
        if (selectedCharity && selectedCharity.id === charityData.id) {
            setSelectedCharity(null); // If clicking on the same marker, close the InfoWindow
        } else {
            setSelectedCharity(charityData); // Otherwise, open the InfoWindow
        }
    };

    // Check if Google Maps is fully loaded before rendering markers
    useEffect(() => {
        if (window.google) {
            setGoogleLoaded(true);  // Mark Google API as loaded
        }
    }, []);

    return (
        <div className="flex flex-col items-center p-6">
            <h2 className="text-3xl font-bold mb-4">Find Shelters Nearby</h2>

            {/* Location Search */}
            <div className="mb-4 w-full max-w-md">
                <SearchLocationInput
                    setSelectedLocation={handleLocationChange}
                    setSelectedAddress={setSelectedAddress}
                />
            </div>

            {/* Display selected address */}
            {selectedAddress && (
                <div className="mb-4 text-lg">
                    <strong>Selected Address:</strong> {selectedAddress}
                </div>
            )}

            {/* Map Display */}
            <div className="w-full h-96 mb-4">
                <LoadScript
                    googleMapsApiKey={REACT_APP_GOOGLE_MAPS_KEY}
                    libraries={['places']}
                    onLoad={() => setGoogleLoaded(true)}
                >
                    <GoogleMap
                        mapContainerStyle={{ height: "100%", width: "100%" }}
                        center={selectedLocation}
                        zoom={zoomLevel}
                    >
                        {googleLoaded && filteredcharity.map((charityData, index) => (
                            <Marker
                                key={index}
                                position={{ lat: charityData.lat, lng: charityData.lng }}
                                onMouseOver={() => handleMarkerClick(charityData)} // Open InfoWindow on click
                                icon={{
                                    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                                }}
                            >
                                {/* InfoWindowF inside Marker */}
                                {selectedCharity && selectedCharity.id === charityData.id && (
                                    <InfoWindowF
                                        position={{ lat: charityData.lat, lng: charityData.lng }}
                                        onCloseClick={() => setSelectedCharity(null)} // Close InfoWindow on close button click
                                    >
                                        <div>
                                            <h3 className="text-lg font-semibold">{charityData.charityName}</h3>
                                            <p><strong>Address:</strong> {charityData.address}</p>
                                            <p><strong>Contact Number:</strong> {charityData.contactNumber}</p>
                                            <p><strong>Registration Number:</strong> {charityData.registrationNumber}</p>
                                            <p><strong>Beds Available:</strong> {charityData.bedsAvailable}</p>
                                            <p><strong>Rate per Day:</strong> £{charityData.ratePerDay}</p>
                                            <button
                                                onClick={() => handleDonateNow(charityData.id)}
                                                className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                            >
                                                Donate Now
                                            </button>
                                        </div>
                                    </InfoWindowF>
                                )}
                            </Marker>
                        ))}
                    </GoogleMap>
                </LoadScript>
            </div>

            <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Go Back
            </button>
        </div>
    );
};

export default DonorMap;