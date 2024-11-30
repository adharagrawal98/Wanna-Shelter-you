import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false);
            navigate("/payment-confirmation");
        }, 3000);

        return () => clearTimeout(timeout);
    }, [navigate]);
    if (loading) {
        return <p>Processing your payment...</p>;
    }

    return <p style={{ color: "green" }}>Payment authorized successfully! Redirecting...</p>;
};

export default PaymentSuccess;