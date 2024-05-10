const express = require('express');
const router = express.Router();
const {paymentIntent} = require("../controllers/payment")


router.route("/intents").post(paymentIntent)

module.exports = router;