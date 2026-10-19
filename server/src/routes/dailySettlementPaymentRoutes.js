const express = require("express");
const {
  registerAdjustment,
  registerPayment,
} = require("../controllers/dailySettlementPaymentController");

const router = express.Router();

router.post("/payments", registerPayment);
router.post("/adjustments", registerAdjustment);

module.exports = router;
