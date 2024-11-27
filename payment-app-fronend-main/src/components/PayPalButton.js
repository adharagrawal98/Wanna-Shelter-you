import React, { useState } from "react";
import axios from "axios";

const PayPalButton = ({ amount, uid }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createOrder = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(
                "http://localhost:5001/api/paypal/create-order",
                { amount, uid, currency: "GBP" }
            );

            const { orderId, approvalLink } = response.data;
            localStorage.setItem("paypalOrderId", orderId);
            window.location.href = approvalLink;
        } catch (err) {
            console.error("Error creating PayPal order:", err);
            setError("Failed to initiate PayPal payment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button
                onClick={createOrder}
                disabled={loading}
                style={{
                    padding: "10px 20px",
                    width: "700px",
                    backgroundColor: "#0070ba",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                {loading ? "Processing..." : `Pay £${amount} with PayPal`}
            </button>
        </div>
    );
};

export default PayPalButton;
