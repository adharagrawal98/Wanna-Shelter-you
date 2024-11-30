// App.js
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Home from './components/Home';
import ShelterDashboard from './components/ShelterDashboard';
import ContactForm from './components/ContactUs';
import Testimonials from './components/Testimonials';
import DonorMap from './components/DonorMap';
import CharityPaymentPage from './components/CharityPaymentPage'
import PaymentConfirmationPage from './components/PaymentConfirmationPage';
import VerifyPage from './components/VerifyPage';
import PaymentSuccess from './components/PaymentSuccess';
import SuccessScan from './components/SuccessScan';

const App = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const fetchUserRole = async () => {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          } else {
            setUserRole(null);
          }
        };
        fetchUserRole();
      } else {
        setUserRole(null);
      }
    });
    return () => unsubscribe();
  }, [db]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserRole(null);
      navigate('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };


  const hideNavbarRoutes = ['/login', '/signup'];
  const showNavbar = !hideNavbarRoutes.includes(window.location.pathname);

  return (
    <div>
      {showNavbar && user && userRole && (
        <nav className="flex items-center justify-between p-4 bg-black text-white">
          <div
            className="text-lg font-bold flex-grow cursor-pointer"
            onClick={() => navigate('/')}
          >
            Wanna Shelter You!
          </div>
          <div className="flex space-x-4"> {/* Add space between buttons */}
            <button
              className="text-white text-sm md:text-base hover:text-blue-300"
              onClick={() => navigate('/testimonials')}
            >
              Testimonials
            </button>
            <button
              className="text-white text-sm md:text-base hover:text-blue-300"
              onClick={() => navigate('/contact-us')}
            >
              Contact Us
            </button>
            <button
              onClick={handleSignOut}
              className="hover:text-blue-300"
            >
              Sign Out
            </button>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/home" element={user && userRole === 'Donor' ? <Home user={user} /> : <Navigate to="/login" />} />
        <Route path="/shelter-dashboard" element={user && userRole === 'Shelter Staff' ? <ShelterDashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login setUser={setUser} setUserRole={setUserRole} />} />
        <Route path="/" element={user ? <Navigate to={userRole === 'Donor' ? '/home' : '/shelter-dashboard'} /> : <Navigate to="/login" />} />
        <Route path="/verify-page" element={<VerifyPage />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/contact-us" element={<ContactForm />} />
        <Route path="/donor-map" element={<DonorMap />} />
        <Route path="/shelter/:id" element={<CharityPaymentPage />} />
        <Route path="/payment-confirmation" element={<PaymentConfirmationPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="success-scan" element={<SuccessScan />} />
      </Routes>
    </div>
  );
};

export default App;