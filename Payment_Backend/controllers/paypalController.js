const paypalService = require('../services/paypal')
exports.createOrder = async (req, res) => {
    const { amount, currency, uid } = req.body;

    if (!amount || !currency || !uid) {
        return res.status(400).json({ error: 'Amount, currency, and UID are required.' });
    }

    try {
        const approvalUrl = await paypalService.createOrder(amount, currency, uid);
        res.status(200).json(approvalUrl);
    } catch (error) {
        console.error('Error creating PayPal order:', error);
        res.status(500).json({ error: 'Failed to create PayPal order' });
    }
};
exports.capturePayment = async (req, res) => {
    try {
        const { orderId } = req.params
        const paymentData = await paypalService.capturePayment(orderId)
        res.status(200).json(paymentData)
    } catch (error) {
        console.error('Error capturing payment:', error)
        res.status(500).json({ error: 'Failed to capture PayPal payment' })
    }
}

exports.authorizePayment = async (req, res) => {
    try {
        const { orderId } = req.params
        const pamentData = await paypalService.authorizePayment(orderId)
        res.status(200).json(pamentData)
    } catch (error) {
        console.error('Error Authorize payment:', error)
        res.status(500).json({ error: 'Failed to authorize PayPal payment' })
    }
}
