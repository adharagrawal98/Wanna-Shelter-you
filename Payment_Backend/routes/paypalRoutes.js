const express = require('express')
const router = express.Router()
const paypalController = require('../controllers/paypalController')

router.post('/create-order', paypalController.createOrder)

router.post('/capture-payment/:orderId', paypalController.capturePayment)

router.post('/authorize-payment/:orderId', paypalController.authorizePayment)

module.exports = router
