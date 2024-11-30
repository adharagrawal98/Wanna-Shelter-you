const paypal = require('@paypal/checkout-server-sdk');
const db = require('../firebaseConfig');

const environment = new paypal.core.SandboxEnvironment(
    clientId = process.env.PAYPAL_CLIENT_ID || 'AYs2e7dECSrKaXDDZxN9lsY6V8S_u4BO0y1zxTa3TF5LZNm6yzesYBwLxmP43gVh38nyjUIoUp87hEVT',
    clientSecret = process.env.PAYPAL_SECRET || 'EE6KDKqT11ewGaHrExhTnGPcz9J1GEkc1Ocs9BCEY7mhyu-P7xsmQqiXAvmiNdkmYmNQi055FOuDweM_'
);

const client = new paypal.core.PayPalHttpClient(environment);

const getPayPalEmailByUid = async (uid) => {
    try {
        const docRef = db.collection("charityDetails").doc(uid);
        const docSnapshot = await docRef.get();

        if (!docSnapshot.exists) {
            throw new Error("Charity details not found for the specified UID.");
        }

        const charityData = docSnapshot.data();
        return charityData.PayPalEmail;
    } catch (error) {
        console.error("Error fetching PayPal email:", error.message);
        throw new Error("Failed to fetch PayPal email from Firestore.");
    }
};

exports.createOrder = async (amount, currency = 'GBP', uid) => {
    try {
        const payeeEmail = await getPayPalEmailByUid(uid);
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer('return=representation');
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    reference_id: uid || 'default-reference-id',
                    amount: {
                        currency_code: currency,
                        value: amount,
                    },
                    payee: {
                        email_address: payeeEmail,
                    },
                },
            ],
            application_context: {
                user_action: 'PAY_NOW',
                return_url: 'http://localhost:3000/payment-success',
                cancel_url: 'http://localhost:3000',
            },
        });
        const response = await client.execute(request);
        const approvalLink = response.result.links.find(link => link.rel === 'approve');
        if (!approvalLink) {
            throw new Error('No approval link found in PayPal response');
        }
        return {
            orderId: response.result.id,
            approvalLink: approvalLink.href,
        };
    } catch (error) {
        console.error("Error creating PayPal order:", error.message);
        throw new Error("Failed to create PayPal order");
    }
};

exports.capturePayment = async (orderId) => {
    try {
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});
        const response = await client.execute(request);
        return response.result;
    } catch (error) {
        console.error("Error capturing PayPal payment:", error.message);
        throw new Error("Failed to capture PayPal payment");
    }
};

exports.authorizePayment = async (orderId) => {
    try {
        const request = new paypal.orders.OrdersAuthorizeRequest(orderId);
        request.requestBody({});
        const response = await client.execute(request);
        const authorization = response.result.purchase_units[0].payments.authorizations[0];
        return {
            authorizationId: authorization.id,
            status: authorization.status,
        };
    } catch (error) {
        console.error("Error authorizing PayPal payment:", error.message);
        throw new Error("Failed to authorize PayPal payment");
    }
};