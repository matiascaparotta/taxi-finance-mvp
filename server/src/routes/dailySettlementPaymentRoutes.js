const express = require("express");
const {
  registerPayment,
} = require("../controllers/dailySettlementPaymentController");

const router = express.Router();

router.post("/payments", registerPayment);

module.exports = router;
