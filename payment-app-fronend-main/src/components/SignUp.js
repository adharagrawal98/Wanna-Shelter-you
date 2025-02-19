import React, { useState } from 'react';
import signupImage from '../assets/Singup-image.jpg';
import './SignUp.css';
import { auth, provider } from '../firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import CharityDetailsForm from './CharityDetailsForm';
import DonorDetailsForm from './DonorDetailsForm';

const SignUp = () => {
    const navigate = useNavigate();
    const db = getFirestore();

    const [showCharityForm, setShowCharityForm] = useState(false);
    const [showDonorForm, setShowDonorForm] = useState(false);
    const [charityData, setCharityData] = useState({
        contactNumber: '',
        charityName: '',
        bedsAvailable: '',
        ratePerDay: '',
        registrationNumber: '',
        address: '',
        bankAccountDetails: ''
    });

    const [donorData, setDonorData] = useState({
        fullName: '',
        mobileNumber: '',
        email: ''
    });

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    const handleGoogleSignIn = async (role) => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const existingRole = userDoc.data().role;
                if (existingRole === role) {
                    Swal.fire({
                        title: 'User already exists',
                        text: `You are already registered as a ${role}. Please log in instead.`,
                        icon: 'warning',
                        confirmButtonText: 'Okay'
                    }).then(() => {
                        navigate('/login');
                    });
                    return;
                } else {
                    Swal.fire({
                        title: 'User Role Mismatch',
                        text: `You are registered as a ${existingRole}. Please log in instead.`,
                        icon: 'warning',
                        confirmButtonText: 'Okay'
                    }).then(() => {
                        navigate('/login');
                    });
                    return;
                }
            } else {
                await setDoc(doc(db, 'users', user.uid), {
                    role: role,
                    email: user.email,
                    displayName: user.displayName,
                });

                Swal.fire({
                    title: 'Signup Successful',
                    text: `You are signed up as a ${role}.`,
                    icon: 'success',
                    confirmButtonText: 'Okay'
                });

                if (role === "Shelter Staff") {
                    setShowCharityForm(true);
                    return;
                } else if (role === "Donor") {
                    const donorDoc = await getDoc(doc(db, "donors", user.uid));
                    if (donorDoc.exists()) {
                        Swal.fire({
                            title: 'User already exists',
                            text: 'You have already signed up as a donor. Please log in instead.',
                            icon: 'warning',
                            confirmButtonText: 'Okay'
                        }).then(() => {
                            navigate('/login');
                        });
                        return;
                    }
                    setDonorData({ ...donorData, email: user.email });
                    setShowDonorForm(true);
                    return;
                }
            }
            navigate('/login');
        } catch (error) {
            Swal.fire({
                title: 'Error',

                text: 'Sorry, there was an error. Please try again later.',
                icon: 'error',
                confirmButtonText: 'Okay'
            });
            console.error("Error during authentication:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (showCharityForm) {
            setCharityData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } else if (showDonorForm) {
            setDonorData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleCharityFormSubmit = (e) => {
        e.preventDefault();
        console.log("Charity Details Submitted:", charityData);
    };

    const handleDonorFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const user = auth.currentUser;

            if (user) {
                await setDoc(doc(db, "donors", user.uid), {
                    ...donorData,
                    uid: user.uid,
                });

                console.log("Donor Details Saved:", donorData);
                Swal.fire({
                    title: 'Details Saved',
                    text: 'Your donor details have been saved successfully!',
                    icon: 'success',
                    confirmButtonText: 'Okay',
                }).then(() => {
                    navigate('/login');
                });
            } else {
                throw new Error("User not authenticated");
            }
        } catch (error) {
            console.error("Error saving donor details:", error);
            Swal.fire({
                title: 'Error',
                text: 'Could not save donor details. Please try again later.',
                icon: 'error',
                confirmButtonText: 'Okay'
            });
        }
    };

    return (
        <div
            className="flex flex-col items-center justify-center h-screen bg-no-repeat bg-center"
            style={{
                backgroundImage: `url(${signupImage})`,
                backgroundSize: '100% auto',
                backgroundPosition: 'center',
            }}
        >
            <div className="bg-black bg-opacity-50 w-full h-full flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-10 text-white">Wanna Shelter You!</h1>

                {!showCharityForm && !showDonorForm ? (
                    <div className="flex space-x-4">
                        <button
                            className="w-48 h-16 mb-80 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-200"
                            onClick={() => handleGoogleSignIn("Donor")}
                        >
                            Sign up as Donor
                        </button>
                        <button
                            className="w-48 h-16 mb-80 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition duration-200"
                            onClick={() => handleGoogleSignIn("Shelter Staff")}
                        >
                            Sign up as Shelter Staff
                        </button>
                    </div>
                ) : showCharityForm ? (
                    <CharityDetailsForm
                        charityData={charityData}
                        handleInputChange={handleInputChange}
                        handleFormSubmit={handleCharityFormSubmit}
                    />
                ) : showDonorForm ? (
                    <DonorDetailsForm
                        donorData={donorData}
                        handleInputChange={handleInputChange}
                        handleFormSubmit={handleDonorFormSubmit}
                    />
                ) : null}

                <div className="flex items-center text-white -mt-2">
                    <span>Already registered?</span>
                    <button
                        className="ml-2 text-blue-300 underline hover:text-blue-500 transition duration-200"
                        onClick={handleLoginRedirect}
                    >
                        Login Here
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignUp;