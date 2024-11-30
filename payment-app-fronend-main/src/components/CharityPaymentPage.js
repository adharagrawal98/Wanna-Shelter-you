import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import PayPalButton from './PayPalButton';

const CharityPaymentPage = () => {
    const { id } = useParams();
    const [charityData, setCharityData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCharity = async () => {
            try {
                const charityDoc = doc(db, "charityDetails", id);
                const charityData = await getDoc(charityDoc);

                if (charityData.exists()) {
                    setCharityData(charityData.data());
                } else {
                    console.error("Charity not found!");
                }
            } catch (error) {
                console.error("Error fetching charity details:", error);
            }
        };

        fetchCharity();
    }, [id]);

    if (!charityData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl">Loading charity details...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">{charityData.charityName}</h2>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-gray-700">Address:</p>
                        <p className="text-md text-gray-600">{charityData.address}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-gray-700">Rate per Day:</p>
                        <p className="text-md text-gray-600">£{charityData.ratePerDay}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-gray-700">Beds Available Today:</p>
                        <p className="text-md text-gray-600">{charityData.bedsAvailable}</p>
                    </div>
                </div>

                <div className="mt-8">
                    <PayPalButton amount={charityData.ratePerDay} uid={id} />

                    <button
                        className="w-full py-3 mt-4 px-6 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300"
                        onClick={() => navigate("/donor-map")}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CharityPaymentPage;